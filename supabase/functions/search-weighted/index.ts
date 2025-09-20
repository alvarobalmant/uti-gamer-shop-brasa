import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchResult {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_slug: string;
  relevance_score: number;
  matched_tags: any[];
  debug_info: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { searchTerms, limit = 20 } = await req.json();

    if (!searchTerms || !Array.isArray(searchTerms)) {
      return new Response(
        JSON.stringify({ error: 'searchTerms array is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[search-weighted] Searching for terms: ${searchTerms.join(', ')}`);

    // Chamar função SQL de busca com pesos melhorada
    const { data: searchResults, error } = await supabase
      .rpc('search_products_enhanced', {
        search_terms: searchTerms,
        limit_count: limit
      });

    if (error) {
      console.error('[search-weighted] Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Search failed', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const results: SearchResult[] = searchResults || [];
    
    console.log(`[search-weighted] Found ${results.length} results`);
    
    // Log dos primeiros 3 resultados para debug
    results.slice(0, 3).forEach((result, index) => {
      console.log(`[search-weighted] Result ${index + 1}: ${result.product_name} (score: ${result.relevance_score})`);
      console.log(`[search-weighted] Debug: ${JSON.stringify(result.debug_info)}`);
      console.log(`[search-weighted] Matched tags: ${JSON.stringify(result.matched_tags)}`);
    });

    return new Response(
      JSON.stringify({
        success: true,
        results,
        meta: {
          total: results.length,
          search_terms: searchTerms,
          limit
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[search-weighted] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});