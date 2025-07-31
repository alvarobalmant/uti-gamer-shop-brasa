import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProductsFromDatabase, fetchSingleProductFromDatabase } from './useProducts/productApi';
import { CacheKeys } from './useOptimizedCache';

/**
 * Hook para preload agressivo de produtos da homepage
 * Carrega produtos críticos IMEDIATAMENTE na montagem do componente
 */
export const useHomepageProductPreload = () => {
  const queryClient = useQueryClient();

  // Preload imediato dos produtos críticos da homepage
  const preloadCriticalProducts = useCallback(async () => {
    try {
      console.time('homepage-products-preload');
      
      // 1. Preload TODOS os produtos em paralelo (cache agressivo)
      const productsPromise = queryClient.prefetchQuery({
        queryKey: CacheKeys.products(),
        queryFn: () => fetchProductsFromDatabase(),
        staleTime: 30 * 1000, // 30 segundos - muito agressivo
        gcTime: 5 * 60 * 1000, // 5 minutos
      });

      // 2. Preload produtos em destaque especificamente
      const featuredPromise = queryClient.prefetchQuery({
        queryKey: CacheKeys.products({ featured: true }),
        queryFn: async () => {
          const allProducts = await fetchProductsFromDatabase();
          return allProducts.filter(p => p.is_featured);
        },
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
      });

      // 3. Preload produtos por categorias principais
      const categoriesPromise = queryClient.prefetchQuery({
        queryKey: CacheKeys.products({ mainCategories: true }),
        queryFn: async () => {
          const allProducts = await fetchProductsFromDatabase();
          // Pegar apenas as categorias principais que aparecem na homepage
          const mainCategories = ['Periféricos', 'Hardware', 'Notebooks', 'Móveis'];
          return allProducts.filter(p => mainCategories.includes(p.category || ''));
        },
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
      });

      // Aguardar todos os preloads em paralelo
      await Promise.allSettled([productsPromise, featuredPromise, categoriesPromise]);
      
      console.timeEnd('homepage-products-preload');
      console.log('✅ Homepage products preloaded successfully');
      
    } catch (error) {
      console.warn('❌ Error preloading homepage products:', error);
    }
  }, [queryClient]);

  // Preload de imagens críticas dos primeiros produtos
  const preloadCriticalImages = useCallback(async () => {
    try {
      // Obter produtos do cache (se já estiverem lá)
      const cachedProducts = queryClient.getQueryData(CacheKeys.products());
      
      if (cachedProducts && Array.isArray(cachedProducts)) {
        // Preload das primeiras 10 imagens (produtos mais importantes)
        const firstProducts = cachedProducts.slice(0, 10);
        
        const imagePromises = firstProducts.map(product => {
          if (product.image_url) {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null); // Não falhar se uma imagem não carregar
              img.src = product.image_url;
            });
          }
          return Promise.resolve(null);
        });

        await Promise.allSettled(imagePromises);
        console.log('✅ Critical product images preloaded');
      }
    } catch (error) {
      console.warn('❌ Error preloading critical images:', error);
    }
  }, [queryClient]);

  // Executar preload imediatamente quando hook é usado
  useEffect(() => {
    // Preload imediato sem aguardar lazy loading ou intersection observer
    preloadCriticalProducts().then(() => {
      // Após carregar dados, preload das imagens críticas
      preloadCriticalImages();
    });
  }, [preloadCriticalProducts, preloadCriticalImages]);

  return {
    preloadCriticalProducts,
    preloadCriticalImages
  };
};

/**
 * Hook para batch loading de seções da homepage
 * Carrega todas as seções necessárias em uma única operação
 */
export const useBatchProductSections = () => {
  const queryClient = useQueryClient();

  const loadAllSections = useCallback(async () => {
    try {
      console.time('batch-sections-load');

      // Fazer UMA query que retorna TODOS os produtos
      // Distribuir entre as seções localmente (evita múltiplas queries)
      const allProducts = await queryClient.fetchQuery({
        queryKey: CacheKeys.products({ includeAdmin: false }),
        queryFn: () => fetchProductsFromDatabase(false),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
      });

      // Distribuir produtos por seções localmente
      const sections = {
        featured: allProducts.filter(p => p.is_featured),
        newArrivals: allProducts.slice(0, 12), // Últimos produtos
        topSellers: allProducts.filter(p => p.is_featured), // Usar featured como proxy para top sellers
        categories: {}
      };

      // Organizar por categorias
      allProducts.forEach(product => {
        if (product.category) {
          if (!sections.categories[product.category]) {
            sections.categories[product.category] = [];
          }
          sections.categories[product.category].push(product);
        }
      });

      // Cachear cada seção separadamente para acesso rápido
      Object.entries(sections).forEach(([sectionKey, sectionProducts]) => {
        if (sectionKey !== 'categories') {
          queryClient.setQueryData(
            CacheKeys.products({ section: sectionKey }),
            sectionProducts
          );
        }
      });

      // Cachear categorias
      Object.entries(sections.categories).forEach(([category, products]) => {
        queryClient.setQueryData(
          CacheKeys.products({ category }),
          products
        );
      });

      console.timeEnd('batch-sections-load');
      console.log('✅ All sections loaded in batch');

      return sections;
    } catch (error) {
      console.error('❌ Error in batch sections load:', error);
      throw error;
    }
  }, [queryClient]);

  return { loadAllSections };
};

/**
 * Hook para app-level prefetch
 * Inicia prefetch no momento que o App carrega, antes mesmo do usuário chegar na homepage
 */
export const useAppInitialLoad = () => {
  const { preloadCriticalProducts } = useHomepageProductPreload();
  const { loadAllSections } = useBatchProductSections();

  useEffect(() => {
    // IMEDIATAMENTE no carregamento inicial do app:
    const initializeApp = async () => {
      try {
        console.log('🚀 Starting app-level prefetch...');
        
        // 1. Prefetch produtos críticos
        await preloadCriticalProducts();
        
        // 2. Carregar todas as seções em batch
        await loadAllSections();
        
        console.log('✅ App-level prefetch completed');
      } catch (error) {
        console.warn('❌ App-level prefetch failed:', error);
      }
    };

    // Executar prefetch imediatamente, sem delays
    initializeApp();
  }, [preloadCriticalProducts, loadAllSections]);
};