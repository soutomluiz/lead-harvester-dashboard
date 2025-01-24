import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    )

    // Get user profile to check subscription and lead count
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Error getting user')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_type, extracted_leads_count')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Error getting profile')
    }

    // Check if user has reached the free plan limit
    if (profile.subscription_type === 'free' && profile.extracted_leads_count >= 50) {
      return new Response(
        JSON.stringify({ error: 'Free plan limit reached' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Firecrawl
    const firecrawl = new FirecrawlApp({ 
      apiKey: Deno.env.get('FIRECRAWL_API_KEY') ?? '' 
    })

    console.log('Starting crawl for URL:', url)
    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: 10,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    })

    if (!crawlResponse.success) {
      throw new Error('Crawl failed')
    }

    // Process and format the crawled data
    const leads = crawlResponse.data.map(item => ({
      company_name: item.title || 'Unknown Company',
      website: item.url,
      type: 'website',
      extraction_date: new Date().toISOString(),
      user_id: user.id,
      status: 'new',
      tags: ['auto-extracted']
    }))

    // Insert leads into database
    const { error: insertError } = await supabase
      .from('leads')
      .insert(leads)

    if (insertError) {
      throw new Error('Error inserting leads')
    }

    // Update extracted leads count
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        extracted_leads_count: profile.extracted_leads_count + leads.length 
      })
      .eq('id', user.id)

    if (updateError) {
      throw new Error('Error updating profile')
    }

    return new Response(
      JSON.stringify({ success: true, leadsExtracted: leads.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})