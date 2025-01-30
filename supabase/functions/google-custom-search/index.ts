import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, location } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_CUSTOM_SEARCH_API_KEY')
    console.log('Received request with params:', { query, location })
    
    if (!query) {
      console.error('Query is missing');
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!apiKey) {
      console.error('Google Custom Search API key is missing');
      return new Response(
        JSON.stringify({ error: 'API key configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const searchEngineId = "04876c2f3fd7a4e1f"
    const searchQuery = location ? `${query} em ${location}` : query;
    
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.append('q', searchQuery);
    searchUrl.searchParams.append('key', apiKey);
    searchUrl.searchParams.append('cx', searchEngineId);
    
    console.log('Making request to Google Custom Search API');
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('Google API response status:', response.status);
    
    const data = await response.json();
    console.log('Found results:', data.items?.length || 0);

    if (!response.ok) {
      console.error('Error from Google API:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Erro na API do Google Custom Search',
          details: data.error?.message || 'Unknown error',
          status: response.status
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!data.items) {
      console.log('No results found');
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet,
      companyName: item.title,
      website: item.link,
      extractionDate: new Date().toISOString(),
      keyword: query,
      city: location,
      source: new URL(item.link).hostname,
      type: 'website'
    }));

    console.log('Processed results successfully');

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in custom search:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro ao realizar a pesquisa personalizada',
        details: error 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})