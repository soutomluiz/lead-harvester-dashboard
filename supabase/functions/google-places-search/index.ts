import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, type, radius = 5000 } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // First, search for places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=${radius}&key=${apiKey}`
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status === "REQUEST_DENIED") {
      throw new Error("Erro na configuração da API do Google Maps")
    }

    // For each place found, get additional details
    const detailedResults = await Promise.all(
      searchData.results.map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total,opening_hours,photos&key=${apiKey}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        
        return {
          ...place,
          formatted_phone_number: detailsData.result?.formatted_phone_number || '',
          website: detailsData.result?.website || '',
          opening_hours: detailsData.result?.opening_hours,
          rating: detailsData.result?.rating || 0,
          user_ratings_total: detailsData.result?.user_ratings_total || 0,
          photos: detailsData.result?.photos || []
        }
      })
    )

    // Filter results based on search type if specified
    let filteredResults = detailedResults;
    if (type === 'opportunities') {
      filteredResults = detailedResults.filter((result: any) => {
        const hasWebsite = !!result.website;
        const hasRating = result.rating > 0;
        return !hasWebsite && !hasRating;
      });
    }

    searchData.results = filteredResults;

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