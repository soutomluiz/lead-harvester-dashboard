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
    const { query, apiKey } = await req.json()
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
    
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;
    
    console.log('Making request to Google API...');
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    console.log('Google API response status:', response.status);
    console.log('Google API response:', data);

    if (!response.ok) {
      console.error('Error from Google API:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Erro na API do Google Custom Search',
          details: data
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet,
      companyName: item.title,
      website: item.link,
      extractionDate: new Date().toISOString(),
      keyword: query.split(' em ')[0],
      city: query.split(' em ')[1],
    })) || [];

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