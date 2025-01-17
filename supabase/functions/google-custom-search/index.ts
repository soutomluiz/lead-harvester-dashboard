import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, apiKey } = await req.json()
    
    if (!query || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Query and API key are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=017576662512468239146:omuauf_lfve`
    const response = await fetch(searchUrl)
    const data = await response.json()

    console.log('Google Custom Search response:', data)

    if (data.error) {
      throw new Error(data.error.message)
    }

    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet,
      companyName: item.title,
      website: item.link,
      extractionDate: new Date().toISOString(),
    })) || []

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in google-custom-search:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})