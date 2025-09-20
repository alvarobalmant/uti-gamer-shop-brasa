import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProductsWithWeights } from './useProducts/productApi';
import { enhancedSmartSearch } from '@/utils/multiTagSearch';
import { useProducts, Product } from './useProducts';

export interface WeightedSearchResult {
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
    queryKey: ['enhancedSearch', query],
    queryFn: () => searchProductsWithWeights(query, 20),
    enabled: forceBackend && query.trim().length > 0,
    staleTime: 60000, // Cache por 1 minuto para resultados mais estáveis
    retry: 1, // 1 retry para melhor confiabilidade
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