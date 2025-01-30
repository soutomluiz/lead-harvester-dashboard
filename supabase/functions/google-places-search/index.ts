import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, location, type, radius = 5000, limit } = await req.json()
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

    console.log('Starting search with params:', { query, location, type, radius });

    // Construir a query com localização
    const searchQuery = location ? `${query} in ${location}` : query;
    
    // First, search for places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&radius=${radius}&key=${apiKey}`
    console.log('Making request to:', searchUrl);
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    console.log('Search response status:', searchData.status);

    if (searchData.status === "REQUEST_DENIED") {
      console.error('Google API request denied:', searchData);
      throw new Error("Erro na configuração da API do Google Maps")
    }

    if (!searchData.results || searchData.results.length === 0) {
      console.log('No results found');
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Limit results if specified (for free plan)
    const resultsToProcess = limit ? searchData.results.slice(0, limit) : searchData.results;

    // For each place found, get additional details
    const detailedResults = await Promise.all(
      resultsToProcess.map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total,opening_hours,photos&key=${apiKey}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        
        return {
          companyName: place.name,
          address: place.formatted_address,
          phone: detailsData.result?.formatted_phone_number || '',
          website: detailsData.result?.website || '',
          rating: detailsData.result?.rating || 0,
          user_ratings_total: detailsData.result?.user_ratings_total || 0,
          type: 'place',
          extractionDate: new Date().toISOString(),
          city: location,
          keyword: query,
          link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        }
      })
    )

    console.log(`Processed ${detailedResults.length} results`);

    return new Response(
      JSON.stringify({ results: detailedResults }),
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