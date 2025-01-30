import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Received request:', req);
    const requestBody = await req.text();
    console.log('Request body:', requestBody);
    
    let { query, location } = JSON.parse(requestBody);
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    console.log('Parsed request data:', { query, location });
    
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
      console.error('Google Maps API key is missing');
      return new Response(
        JSON.stringify({ error: 'API key configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Starting search with params:', { query, location });

    const searchQuery = location ? `${query} in ${location}` : query;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`
    
    console.log('Making request to Google Places API with URL:', searchUrl);
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    console.log('Search response:', searchData);

    if (searchData.status === "REQUEST_DENIED") {
      console.error('Google API request denied:', searchData);
      throw new Error("API key error or quota exceeded")
    }

    if (!searchData.results || searchData.results.length === 0) {
      console.log('No results found');
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${searchData.results.length} results, fetching details...`);

    const detailedResults = await Promise.all(
      searchData.results.map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total,opening_hours&key=${apiKey}`
        console.log(`Fetching details for ${place.name}`);
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        
        console.log(`Details for ${place.name}:`, detailsData);
        
        return {
          companyName: place.name,
          address: place.formatted_address,
          phone: detailsData.result?.formatted_phone_number || null,
          website: detailsData.result?.website || null,
          rating: place.rating || 0,
          user_ratings_total: place.user_ratings_total || 0,
          type: 'place',
          extractionDate: new Date().toISOString(),
          city: location,
          keyword: query,
          link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        }
      })
    )

    console.log('Final results:', detailedResults);

    return new Response(
      JSON.stringify({ results: detailedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in google-places-search:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})