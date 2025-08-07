import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePersistentLayoutCache } from './usePersistentLayoutCache';
import { CacheKeys } from './useOptimizedCache';
import { supabase } from '@/integrations/supabase/client';

// Função para buscar dados da view unificada (mesma do useOptimizedHomepageLayout)
const fetchOptimizedHomepageLayout = async (): Promise<any[]> => {
  console.log('🚀 [Preloader] Buscando layout otimizado...');
  
  const { data, error } = await supabase
    .from('view_homepage_layout_complete')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ [Preloader] Erro ao buscar layout:', error);
    throw error;
  }

  console.log('✅ [Preloader] Layout carregado:', data?.length, 'itens');
  return data || [];
};

// Hook para preloading inteligente do layout
export const useLayoutPreloader = () => {
  const queryClient = useQueryClient();
  const { hasPersistentCache, restoreLayoutCache, persistLayoutData } = usePersistentLayoutCache();
  const preloadAttemptedRef = useRef(false);

  // Preload do layout com estratégia inteligente
  const preloadLayout = useCallback(async (force: boolean = false) => {
    // Evitar múltiplos preloads desnecessários
    if (preloadAttemptedRef.current && !force) {
      console.log('⏭️ [Preloader] Preload já tentado, pulando...');
      return;
    }

    const layoutKey = CacheKeys.layout();
    
    // Verificar se já existe no React Query cache
    const existingData = queryClient.getQueryData(layoutKey);
    
    if (existingData && !force) {
      console.log('✅ [Preloader] Layout já existe no React Query cache');
      persistLayoutData(existingData);
      preloadAttemptedRef.current = true;
      return;
    }

    // Verificar cache persistente
    if (hasPersistentCache() && !force) {
      console.log('📦 [Preloader] Restaurando do cache persistente...');
      await restoreLayoutCache();
      preloadAttemptedRef.current = true;
      return;
    }

    try {
      console.log('🔄 [Preloader] Iniciando fetch do layout...');
      
      // Prefetch com configuração ultra-agressiva
      await queryClient.prefetchQuery({
        queryKey: layoutKey,
        queryFn: fetchOptimizedHomepageLayout,
        staleTime: 30 * 60 * 1000, // 30 minutos
        gcTime: 60 * 60 * 1000,    // 1 hora
      });

      // Salvar no cache persistente
      const freshData = queryClient.getQueryData(layoutKey);
      if (freshData) {
        persistLayoutData(freshData);
        console.log('💾 [Preloader] Layout salvo no cache persistente');
      }

      preloadAttemptedRef.current = true;
      console.log('✅ [Preloader] Layout preload concluído');
      
    } catch (error) {
      console.error('❌ [Preloader] Erro no preload:', error);
      
      // Tentar restaurar do cache persistente como fallback
      if (hasPersistentCache()) {
        console.log('🔄 [Preloader] Tentando fallback para cache persistente...');
        await restoreLayoutCache();
      }
    }
  }, [queryClient, hasPersistentCache, restoreLayoutCache, persistLayoutData]);

  // Preload imediato durante a inicialização da aplicação
  const initializeLayoutCache = useCallback(async () => {
    console.log('🏗️ [Preloader] Inicializando cache de layout...');
    
    // Sempre tentar restaurar primeiro
    await restoreLayoutCache();
    
    // Depois fazer preload se necessário
    setTimeout(() => {
      preloadLayout();
    }, 100); // Pequeno delay para não bloquear o render inicial
    
  }, [restoreLayoutCache, preloadLayout]);

  // Preload em background para próximas navegações
  const backgroundPreload = useCallback(() => {
    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadLayout();
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        preloadLayout();
      }, 1000);
    }
  }, [preloadLayout]);

  // Force refresh do cache (para usar quando necessário)
  const refreshLayoutCache = useCallback(async () => {
    console.log('🔄 [Preloader] Force refresh do layout cache...');
    preloadAttemptedRef.current = false;
    await preloadLayout(true);
  }, [preloadLayout]);

  // Auto-inicialização
  useEffect(() => {
    initializeLayoutCache();
  }, [initializeLayoutCache]);

  return {
    preloadLayout,
    initializeLayoutCache,
    backgroundPreload,
    refreshLayoutCache,
    isPreloaded: preloadAttemptedRef.current
  };
};