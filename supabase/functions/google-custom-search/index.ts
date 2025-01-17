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
    
    if (!query || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Query e chave da API são obrigatórios' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Usando o ID do seu Custom Search Engine
    const searchEngineId = "04876c2f3fd7a4e1f";
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;
    
    console.log('Fazendo requisição para:', searchUrl);
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    console.log('Resposta da API do Google:', data);

    // Tratamento específico para erro de API bloqueada
    if (data.error?.code === 403) {
      return new Response(
        JSON.stringify({ 
          error: 'Erro de autenticação com a API do Google Custom Search. Verifique sua chave de API e as permissões.',
          details: data.error
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (data.error) {
      throw new Error(data.error.message || 'Erro na API de pesquisa do Google');
    }

    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.snippet,
      companyName: item.title,
      website: item.link,
      extractionDate: new Date().toISOString(),
      keyword: query.split(' em ')[0], // Extrai o nicho da query
      city: query.split(' em ')[1], // Extrai a cidade da query
    })) || [];

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro na pesquisa personalizada:', error);
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