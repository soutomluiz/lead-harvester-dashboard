import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS
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

    // Primeiro, fazemos a busca por texto para obter os lugares
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status === "REQUEST_DENIED") {
      throw new Error("Chave de API inválida ou sem permissões necessárias")
    }

    // Para cada lugar encontrado, buscamos os detalhes adicionais
    const detailedResults = await Promise.all(
      searchData.results.map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,formatted_address,name,website,email,opening_date,rating,user_ratings_total&key=${apiKey}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        return {
          ...place,
          formatted_phone_number: detailsData.result?.formatted_phone_number || '',
          website: detailsData.result?.website || '',
          email: detailsData.result?.email || '',
          opening_date: detailsData.result?.opening_date || '',
          rating: detailsData.result?.rating || 0,
          user_ratings_total: detailsData.result?.user_ratings_total || 0
        }
      })
    )

    searchData.results = detailedResults

    return new Response(
      JSON.stringify(searchData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in google-places-search:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})