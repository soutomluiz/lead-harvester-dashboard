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
    const { query } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_CUSTOM_SEARCH_API_KEY')
    console.log('Received request with query:', query)
    
    if (!query || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Query e chave da API são obrigatórios' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const searchEngineId = "04876c2f3fd7a4e1f";
    
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.append('q', query);
    searchUrl.searchParams.append('key', apiKey);
    searchUrl.searchParams.append('cx', searchEngineId);
    
    console.log('Making request to Google API URL:', searchUrl.toString());
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('Google API response status:', response.status);
    
    const data = await response.json();
    console.log('Google API response:', JSON.stringify(data, null, 2));

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
      keyword: query.split(' em ')[0],
      city: query.split(' em ')[1],
      source: new URL(item.link).hostname,
      type: 'website'
    }));

    console.log('Processed results:', results);

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