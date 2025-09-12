<<<<<<< HEAD
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProductsWithWeights } from './useProducts/productApi';
import { enhancedSmartSearch } from '@/utils/multiTagSearch';
import { useProducts, Product } from './useProducts';

interface WeightedSearchResult {
  exactMatches: Product[];
  relatedProducts: Product[];
  tagSuggestions: string[];
  isLoading: boolean;
  error: Error | null;
  debug: {
    backendUsed: boolean;
    searchTerms: string[];
    responseTime: number;
    fallbackUsed: boolean;
    detailedResults?: Array<{
      id: string;
      name: string;
      relevance_score: number;
      matched_tags: string[];
      debug_info: any;
    }>;
  };
}

export const useWeightedSearch = (query: string, enableBackend: boolean = true): WeightedSearchResult => {
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // SEMPRE forçar backend - sem fallback para teste
  const forceBackend = true;

  // Backend search usando React Query
  const {
    data: backendResult,
    isLoading: backendLoading,
    error: backendError
  } = useQuery({
    queryKey: ['weightedSearch', query],
    queryFn: () => searchProductsWithWeights(query, 20),
    enabled: forceBackend && query.trim().length > 0,
    staleTime: 30000, // Cache por 30 segundos
    retry: 0, // NÃO retry para ver erros imediatamente
    retryDelay: 1000
  });

  // Frontend fallback search
  const frontendResult = useMemo(() => {
    if (!allProducts || productsLoading) {
      return { exactMatches: [], relatedProducts: [], tagSuggestions: [] };
    }
    
    return enhancedSmartSearch(allProducts, query);
  }, [allProducts, query, productsLoading]);

  // Determinar qual resultado usar
  const finalResult = useMemo(() => {
    const startTime = Date.now();

    // Se o backend está carregando, usar frontend como fallback temporário
    if (backendLoading && !fallbackUsed) {
      console.log('[useWeightedSearch] Backend loading, usando frontend temporariamente');
      return {
        exactMatches: frontendResult.exactMatches,
        relatedProducts: frontendResult.relatedProducts,
        tagSuggestions: frontendResult.tagSuggestions,
        debug: {
          backendUsed: false,
          searchTerms: query.split(' '),
          responseTime: Date.now() - startTime,
          fallbackUsed: true,
          detailedResults: frontendResult.exactMatches.map((p: any) => ({
            id: p.id,
            name: p.name,
            relevance_score: p.relevance_score || 0,
            matched_tags: p.matched_tags || [],
            debug_info: p.debug_info || {}
          }))
        }
      };
    }

    // Se backend teve erro, usar frontend como fallback
    if (backendError || (enableBackend && !backendResult)) {
      if (backendError && !fallbackUsed) {
        console.warn('[useWeightedSearch] Backend error, fallback para frontend:', backendError);
        setFallbackUsed(true);
      }
      
      return {
        exactMatches: frontendResult.exactMatches,
        relatedProducts: frontendResult.relatedProducts,
        tagSuggestions: frontendResult.tagSuggestions,
        debug: {
          backendUsed: false,
          searchTerms: query.split(' '),
          responseTime: Date.now() - startTime,
          fallbackUsed: true,
          detailedResults: frontendResult.exactMatches.map((p: any) => ({
            id: p.id,
            name: p.name,
            relevance_score: p.relevance_score || 0,
            matched_tags: p.matched_tags || [],
            debug_info: p.debug_info || {}
          }))
        }
      };
    }

    // Se backend retornou resultados, usar eles
    if (backendResult && backendResult.products.length > 0) {
      console.log('[useWeightedSearch] ✅ Usando resultados do backend:', {
        query,
        resultCount: backendResult.products.length,
        responseTime: backendResult.debug.responseTime
      });

      // Reset fallback flag quando backend funciona
      if (fallbackUsed) {
        setFallbackUsed(false);
      }

      // Mesclar debug do frontend para complementar o backend (quando o backend não traz tudo)
      const enrichedBackendProducts = backendResult.products.map((p: any) => {
        const f = (frontendResult.exactMatches as any[]).find(x => x.id === p.id)
          || (frontendResult.relatedProducts as any[]).find(x => x.id === p.id);
        const backendScore = typeof p.relevance_score === 'number' ? p.relevance_score : 0;
        const fallbackScore = typeof f?.relevance_score === 'number' ? f.relevance_score : 0;
        const mergedDebug = (p.debug_info && Object.keys(p.debug_info).length > 0) ? p.debug_info : (f?.debug_info || {});
        const mergedTags = (Array.isArray(p.matched_tags) && p.matched_tags.length > 0) ? p.matched_tags : (f?.matched_tags || []);
        return {
          ...p,
          relevance_score: backendScore > 0 ? backendScore : fallbackScore,
          matched_tags: mergedTags,
          debug_info: mergedDebug,
        };
      });

      return {
        exactMatches: enrichedBackendProducts,
        relatedProducts: frontendResult.relatedProducts.slice(0, 8), // Usar frontend para relacionados
        tagSuggestions: frontendResult.tagSuggestions,
        debug: {
          backendUsed: true,
          searchTerms: backendResult.debug.searchTerms,
          responseTime: backendResult.debug.responseTime,
          fallbackUsed: false,
          detailedResults: enrichedBackendProducts.map((product: any) => ({
            id: product.id,
            name: product.name,
            relevance_score: product.relevance_score || 0,
            matched_tags: product.matched_tags || [],
            debug_info: product.debug_info || {}
          }))
        }
      };
    }

    // Se backend não retornou resultados, usar frontend
    console.log('[useWeightedSearch] Backend sem resultados, usando frontend');
    return {
      exactMatches: frontendResult.exactMatches,
      relatedProducts: frontendResult.relatedProducts,
      tagSuggestions: frontendResult.tagSuggestions,
      debug: {
        backendUsed: false,
        searchTerms: query.split(' '),
        responseTime: Date.now() - startTime,
        fallbackUsed: true,
        detailedResults: frontendResult.exactMatches.map((p: any) => ({
          id: p.id,
          name: p.name,
          relevance_score: p.relevance_score || 0,
          matched_tags: p.matched_tags || [],
          debug_info: p.debug_info || {}
        }))
      }
    };
  }, [
    backendResult, 
    backendError, 
    backendLoading, 
    frontendResult, 
    query, 
    enableBackend, 
    fallbackUsed
  ]);

  // Log debug info quando há mudanças significativas
  useEffect(() => {
    if (query && finalResult.debug) {
      console.log(`[useWeightedSearch] 🔍 Query: "${query}"`);
      console.log(`[useWeightedSearch] 📊 Resultados: ${finalResult.exactMatches.length} exatos, ${finalResult.relatedProducts.length} relacionados`);
      console.log(`[useWeightedSearch] ⚡ Backend: ${finalResult.debug.backendUsed ? 'SIM' : 'NÃO'}`);
      console.log(`[useWeightedSearch] ⏱️ Tempo: ${finalResult.debug.responseTime}ms`);
      
      if (finalResult.debug.fallbackUsed) {
        console.log(`[useWeightedSearch] 🔄 Fallback ativo`);
      }
    }
  }, [query, finalResult.exactMatches.length, finalResult.debug]);

  return {
    exactMatches: finalResult.exactMatches,
    relatedProducts: finalResult.relatedProducts,
    tagSuggestions: finalResult.tagSuggestions,
    isLoading: backendLoading || productsLoading,
    error: backendError as Error | null,
    debug: finalResult.debug
  };
};
=======
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
>>>>>>> 8e37538e6a1190ba1a2f2e58a16b837b9f624d26
