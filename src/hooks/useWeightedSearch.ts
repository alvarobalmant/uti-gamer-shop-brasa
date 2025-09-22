import { useState, useEffect, useMemo } from 'react';
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

export const useWeightedSearch = (query: string): WeightedSearchResult => {
  const { products: allProducts, loading: productsLoading } = useProducts();

  // Frontend-only search - sem backend
  const frontendResult = useMemo(() => {
    const startTime = Date.now();
    
    if (!allProducts || productsLoading) {
      return { 
        exactMatches: [], 
        relatedProducts: [], 
        tagSuggestions: [],
        responseTime: Date.now() - startTime
      };
    }
    
    const searchResult = enhancedSmartSearch(allProducts, query);
    
    return {
      ...searchResult,
      responseTime: Date.now() - startTime
    };
  }, [allProducts, query, productsLoading]);

  // Log debug info quando há mudanças significativas
  useEffect(() => {
    if (query && frontendResult.exactMatches) {
      console.log(`[useWeightedSearch] 🔍 Query: "${query}"`);
      console.log(`[useWeightedSearch] 📊 Resultados: ${frontendResult.exactMatches.length} exatos, ${frontendResult.relatedProducts.length} relacionados`);
      console.log(`[useWeightedSearch] ⚡ Frontend-only: SIM`);
      console.log(`[useWeightedSearch] ⏱️ Tempo: ${frontendResult.responseTime}ms`);
    }
  }, [query, frontendResult.exactMatches?.length, frontendResult.responseTime]);

  return {
    exactMatches: frontendResult.exactMatches,
    relatedProducts: frontendResult.relatedProducts,
    tagSuggestions: frontendResult.tagSuggestions,
    isLoading: productsLoading,
    error: null, // Sem backend, sem erros de rede
    debug: {
      backendUsed: false, // Sempre false agora
      searchTerms: query.split(' ').filter(term => term.trim().length > 0),
      responseTime: frontendResult.responseTime || 0,
      fallbackUsed: false, // Não é fallback, é o método principal
      detailedResults: frontendResult.exactMatches?.map((p: any) => ({
        id: p.id,
        name: p.name,
        relevance_score: p.relevance_score || 0,
        matched_tags: p.matched_tags || [],
        debug_info: p.debug_info || {}
      })) || []
    }
  };
};