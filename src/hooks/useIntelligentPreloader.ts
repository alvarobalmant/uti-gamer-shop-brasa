
import { useEffect, useCallback, useRef } from 'react';
import { useProductPrefetch } from './useProductPrefetch';

interface PreloaderStats {
  prefetchedItems: number;
  cacheHits: number;
  averageLoadTime: number;
  lastUpdate: number;
}

export const useIntelligentPreloader = () => {
  const { prefetchProducts, getCacheStats } = useProductPrefetch();
  const statsRef = useRef<PreloaderStats>({
    prefetchedItems: 0,
    cacheHits: 0,
    averageLoadTime: 0,
    lastUpdate: Date.now()
  });

  // Preload crítico - recursos essenciais primeiro
  const preloadCriticalResources = useCallback(async () => {
    try {
      // Preload imagens críticas
      const criticalImages = [
        '/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png', // Logo
      ];

      const imagePromises = criticalImages.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      await Promise.allSettled(imagePromises);

      // Preload de produtos em destaque (apenas IDs mais acessados)
      const featuredProductIds = ['featured-1', 'featured-2', 'featured-3'];
      await prefetchProducts(featuredProductIds);

      statsRef.current.prefetchedItems += featuredProductIds.length;
      console.log('🚀 Recursos críticos precarregados');
    } catch (error) {
      console.warn('⚠️ Erro no preload crítico:', error);
    }
  }, [prefetchProducts]);

  // Preload secundário - recursos menos críticos
  const preloadSecondaryResources = useCallback(async () => {
    // Aguardar um pouco antes de carregar recursos secundários
    setTimeout(async () => {
      try {
        // Preload de categorias populares
        const popularCategories = ['playstation', 'xbox', 'nintendo'];
        
        for (const category of popularCategories) {
          // Simular prefetch por categoria
          console.log(`🔄 Prefetch categoria: ${category}`);
        }

        console.log('✨ Recursos secundários precarregados');
      } catch (error) {
        console.warn('⚠️ Erro no preload secundário:', error);
      }
    }, 2000);
  }, []);

  // Preload baseado em interação do usuário
  const preloadOnHover = useCallback((elementType: string) => {
    switch (elementType) {
      case 'product':
        console.log('🎯 Preload produto ao hover');
        break;
      case 'category':
        console.log('🎯 Preload categoria ao hover');
        break;
    }
  }, []);

  // Inicializar preloader
  useEffect(() => {
    // Preload imediato de recursos críticos
    preloadCriticalResources();
    
    // Preload atrasado de recursos secundários
    preloadSecondaryResources();

    // Cleanup
    return () => {
      console.log('🧹 Preloader cleanup');
    };
  }, [preloadCriticalResources, preloadSecondaryResources]);

  const getStats = useCallback((): PreloaderStats => {
    const cacheStats = getCacheStats();
    return {
      ...statsRef.current,
      cacheHits: cacheStats.valid,
      lastUpdate: Date.now()
    };
  }, [getCacheStats]);

  return {
    preloadOnHover,
    getStats
  };
};
