import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CacheKeys } from './useOptimizedCache';

// Chave para localStorage
const LAYOUT_CACHE_KEY = 'uti_homepage_layout_cache';
const CACHE_VERSION = 'v1.0';

interface PersistentCacheData {
  data: any;
  timestamp: number;
  version: string;
}

// Hook para cache persistente de layout que sobrevive a unmount/remount
export const usePersistentLayoutCache = () => {
  const queryClient = useQueryClient();
  const isInitializedRef = useRef(false);

  // Salvar cache no localStorage
  const saveToLocalStorage = useCallback((data: any) => {
    try {
      const cacheData: PersistentCacheData = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      localStorage.setItem(LAYOUT_CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Layout cache salvo no localStorage');
    } catch (error) {
      console.warn('⚠️ Erro ao salvar cache no localStorage:', error);
    }
  }, []);

  // Carregar cache do localStorage
  const loadFromLocalStorage = useCallback((): any => {
    try {
      const stored = localStorage.getItem(LAYOUT_CACHE_KEY);
      if (!stored) return null;

      const cacheData: PersistentCacheData = JSON.parse(stored);
      
      // Verificar versão e idade do cache (máximo 1 hora)
      const maxAge = 60 * 60 * 1000; // 1 hora
      const isValid = cacheData.version === CACHE_VERSION && 
                     (Date.now() - cacheData.timestamp) < maxAge;

      if (isValid) {
        console.log('📦 Layout cache carregado do localStorage');
        return cacheData.data;
      } else {
        // Limpar cache inválido
        localStorage.removeItem(LAYOUT_CACHE_KEY);
        console.log('🗑️ Cache localStorage inválido removido');
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar cache do localStorage:', error);
      return null;
    }
  }, []);

  // Pré-popular o React Query cache com dados do localStorage
  const restoreLayoutCache = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    const cachedData = loadFromLocalStorage();
    if (cachedData) {
      const layoutKey = CacheKeys.layout();
      
      // Definir dados no React Query cache com configuração ultra-persistente
      queryClient.setQueryData(layoutKey, cachedData, {
        updatedAt: Date.now() - 30000, // Marcar como "um pouco antigo" para permitir refresh em background
      });
      
      console.log('🚀 Layout cache restaurado para React Query');
    }
    
    isInitializedRef.current = true;
  }, [queryClient, loadFromLocalStorage]);

  // Interceptar e salvar novos dados de layout
  const persistLayoutData = useCallback((data: any) => {
    if (data) {
      saveToLocalStorage(data);
      
      // Garantir que os dados ficam no React Query cache por muito tempo
      const layoutKey = CacheKeys.layout();
      queryClient.setQueryData(layoutKey, data);
    }
  }, [queryClient, saveToLocalStorage]);

  // Limpar cache quando necessário
  const clearLayoutCache = useCallback(() => {
    localStorage.removeItem(LAYOUT_CACHE_KEY);
    queryClient.removeQueries({ queryKey: CacheKeys.layout() });
    isInitializedRef.current = false;
    console.log('🗑️ Layout cache completamente limpo');
  }, [queryClient]);

  // Verificar se existe cache persistente
  const hasPersistentCache = useCallback((): boolean => {
    const stored = localStorage.getItem(LAYOUT_CACHE_KEY);
    return !!stored;
  }, []);

  // Setup inicial e cleanup
  useEffect(() => {
    // Restaurar cache na inicialização
    restoreLayoutCache();

    // Listener para salvar dados quando eles mudarem no React Query
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === 'layout' && 
          event?.query?.queryKey?.[1] === 'homepage' &&
          event.type === 'updated') {
        const data = event.query.state.data;
        if (data) {
          saveToLocalStorage(data);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, restoreLayoutCache, saveToLocalStorage]);

  return {
    restoreLayoutCache,
    persistLayoutData,
    clearLayoutCache,
    hasPersistentCache,
    saveToLocalStorage,
    loadFromLocalStorage
  };
};