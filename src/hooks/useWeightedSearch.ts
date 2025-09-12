import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeightedSearchResult {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_slug: string;
  relevance_score: number;
  matched_tags: Array<{
    name: string;
    category: string;
    weight: number;
  }>;
  debug_info: {
    base_score: number;
    weighted_score: number;
    type_boost: number;
    final_score: number;
  };
}

export interface WeightedSearchResponse {
  success: boolean;
  results: WeightedSearchResult[];
  meta: {
    total: number;
    search_terms: string[];
    limit: number;
  };
}

export function useWeightedSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    query: string, 
    limit: number = 20
  ): Promise<WeightedSearchResult[]> => {
    if (!query.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Tokenizar a query (dividir por espaços e filtrar termos vazios)
      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 0);

      console.log('[useWeightedSearch] Search terms:', searchTerms);

      // Chamar edge function de busca com pesos
      const { data, error: functionError } = await supabase.functions.invoke(
        'search-weighted',
        {
          body: {
            searchTerms,
            limit
          }
        }
      );

      if (functionError) {
        console.error('[useWeightedSearch] Function error:', functionError);
        throw new Error(functionError.message || 'Search failed');
      }

      const response = data as WeightedSearchResponse;
      
      if (!response.success) {
        throw new Error('Search request failed');
      }

      console.log(`[useWeightedSearch] Found ${response.results.length} results`);
      
      // Log dos resultados para debug
      response.results.slice(0, 3).forEach((result, index) => {
        console.log(`[useWeightedSearch] ${index + 1}. ${result.product_name} (score: ${result.relevance_score})`);
        console.log(`[useWeightedSearch] Tags: ${result.matched_tags.map(tag => `${tag.name}(${tag.weight})`).join(', ')}`);
      });

      return response.results;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[useWeightedSearch] Error:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCategory = useCallback(async (
    query: string,
    category: string,
    limit: number = 20
  ): Promise<WeightedSearchResult[]> => {
    // Para buscas por categoria, adicionar o termo da categoria aos termos de busca
    const categoryTerms: Record<string, string[]> = {
      platform: ['xbox', 'ps4', 'ps5', 'nintendo', 'pc'],
      product_type: ['jogo', 'console', 'controle'],
      game_title: ['minecraft', 'fifa', 'gta'],
      brand: ['sony', 'microsoft', 'nintendo'],
      genre: ['acao', 'aventura', 'rpg', 'fps']
    };

    const additionalTerms = categoryTerms[category] || [];
    const enhancedQuery = `${query} ${additionalTerms.join(' ')}`;
    
    return search(enhancedQuery, limit);
  }, [search]);

  return {
    search,
    searchByCategory,
    loading,
    error
  };
}