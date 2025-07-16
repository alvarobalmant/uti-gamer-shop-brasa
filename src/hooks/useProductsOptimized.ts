import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts/types';
import { 
  fetchProductsFromDatabase, 
  fetchProductsByCriteria,
  fetchSingleProductFromDatabase 
} from './useProducts/productApi';
import { handleProductError } from './useProducts/productErrorHandler';
import { CarouselConfig } from '@/types/specialSections';

export type { Product } from './useProducts/types';

interface UseProductsOptimizedOptions {
  limit?: number;
  enablePrefetch?: boolean;
  cacheTime?: number;
  staleTime?: number;
  config?: CarouselConfig;
}

interface ProductCache {
  data: Product[];
  timestamp: number;
  isStale: boolean;
}

// Cache global para produtos
const productCache = new Map<string, ProductCache>();
const prefetchQueue = new Set<string>();

export const useProductsOptimized = (options: UseProductsOptimizedOptions = {}) => {
  const {
    limit = 50,
    enablePrefetch = true,
    cacheTime = 10 * 60 * 1000, // 10 minutos
    staleTime = 5 * 60 * 1000,  // 5 minutos
    config
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Gerar chave de cache baseada nas opções
  const cacheKey = useMemo(() => {
    const key = config 
      ? `config_${JSON.stringify(config)}_${limit}`
      : `all_${limit}`;
    return key;
  }, [config, limit]);

  // Verificar se dados estão em cache e são válidos
  const getCachedData = useCallback((key: string): ProductCache | null => {
    const cached = productCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    const isExpired = now - cached.timestamp > cacheTime;
    
    if (isExpired) {
      productCache.delete(key);
      return null;
    }

    // Marcar como stale se passou do staleTime
    cached.isStale = now - cached.timestamp > staleTime;
    return cached;
  }, [cacheTime, staleTime]);

  // Salvar dados no cache
  const setCachedData = useCallback((key: string, data: Product[]) => {
    productCache.set(key, {
      data: [...data], // Clone para evitar mutações
      timestamp: Date.now(),
      isStale: false
    });
  }, []);

  // Função otimizada para buscar produtos
  const fetchProductsOptimized = useCallback(async (forceRefresh = false) => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Verificar cache primeiro
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setProducts(cached.data);
        setLoading(false);
        setError(null);
        
        // Se dados estão stale, buscar em background
        if (cached.isStale && enablePrefetch) {
          fetchProductsOptimized(true);
        }
        return cached.data;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Criar novo AbortController
      abortControllerRef.current = new AbortController();
      const fetchTime = Date.now();
      lastFetchRef.current = fetchTime;

      let productsData: Product[];

      if (config) {
        productsData = await fetchProductsByCriteria(config);
      } else {
        productsData = await fetchProductsFromDatabase();
      }

      // Verificar se esta ainda é a requisição mais recente
      if (lastFetchRef.current !== fetchTime) {
        return; // Requisição mais recente já foi feita
      }

      // Aplicar limite se especificado
      if (limit && productsData.length > limit) {
        productsData = productsData.slice(0, limit);
      }

      // Pré-processar dados para melhor performance
      const processedProducts = productsData.map(product => ({
        ...product,
        // Calcular campos derivados uma vez
        formattedPrice: product.price ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : 'Preço não disponível',
        formattedPromotionalPrice: product.promotional_price ? `R$ ${product.promotional_price.toFixed(2).replace('.', ',')}` : null,
        formattedUtiProPrice: product.uti_pro_price ? `R$ ${product.uti_pro_price.toFixed(2).replace('.', ',')}` : null,
        hasDiscount: product.promotional_price && product.promotional_price < product.price,
        discountPercentage: product.promotional_price && product.price 
          ? Math.round(((product.price - product.promotional_price) / product.price) * 100)
          : 0,
      }));

      setProducts(processedProducts);
      setCachedData(cacheKey, processedProducts);
      
      return processedProducts;
    } catch (error: any) {
      // Ignorar erros de abort
      if (error.name === 'AbortError') {
        return;
      }

      const errorMessage = handleProductError(error, 'ao carregar produtos');
      setError(errorMessage);
      
      // Não mostrar toast se temos dados em cache
      const cached = getCachedData(cacheKey);
      if (!cached) {
        toast({
          title: "Erro ao carregar produtos",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, config, limit, enablePrefetch, getCachedData, setCachedData, toast]);

  // Prefetch de produtos relacionados
  const prefetchRelatedProducts = useCallback(async (relatedConfig?: CarouselConfig) => {
    if (!enablePrefetch || !relatedConfig) return;

    const prefetchKey = `config_${JSON.stringify(relatedConfig)}_${limit}`;
    
    // Evitar prefetch duplicado
    if (prefetchQueue.has(prefetchKey)) return;
    
    // Verificar se já está em cache
    const cached = getCachedData(prefetchKey);
    if (cached && !cached.isStale) return;

    prefetchQueue.add(prefetchKey);

    try {
      const productsData = await fetchProductsByCriteria(relatedConfig);
      const limitedData = limit ? productsData.slice(0, limit) : productsData;
      setCachedData(prefetchKey, limitedData);
    } catch (error) {
      // Ignorar erros de prefetch silenciosamente
      console.warn('Prefetch failed:', error);
    } finally {
      prefetchQueue.delete(prefetchKey);
    }
  }, [enablePrefetch, limit, getCachedData, setCachedData]);

  // Buscar produto individual com cache
  const fetchSingleProductOptimized = useCallback(async (id: string): Promise<Product | null> => {
    const singleCacheKey = `single_${id}`;
    
    // Verificar cache primeiro
    const cached = getCachedData(singleCacheKey);
    if (cached && cached.data.length > 0) {
      return cached.data[0];
    }

    try {
      const product = await fetchSingleProductFromDatabase(id);
      if (product) {
        setCachedData(singleCacheKey, [product]);
      }
      return product;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produto');
      toast({
        title: "Erro ao carregar produto",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [getCachedData, setCachedData, toast]);

  // Invalidar cache
  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      // Invalidar caches que correspondem ao padrão
      for (const key of productCache.keys()) {
        if (key.includes(pattern)) {
          productCache.delete(key);
        }
      }
    } else {
      // Limpar todo o cache
      productCache.clear();
    }
  }, []);

  // Refresh manual
  const refresh = useCallback(() => {
    invalidateCache(cacheKey);
    return fetchProductsOptimized(true);
  }, [cacheKey, invalidateCache, fetchProductsOptimized]);

  // Efeito principal
  useEffect(() => {
    fetchProductsOptimized();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProductsOptimized]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Estatísticas do cache (para debugging)
  const getCacheStats = useCallback(() => {
    return {
      totalCached: productCache.size,
      cacheKeys: Array.from(productCache.keys()),
      currentKey: cacheKey,
      isCurrentCached: productCache.has(cacheKey),
    };
  }, [cacheKey]);

  return {
    products,
    loading,
    error,
    refresh,
    prefetchRelatedProducts,
    fetchSingleProduct: fetchSingleProductOptimized,
    invalidateCache,
    getCacheStats,
    
    // Compatibilidade com hook original
    refetch: refresh,
    fetchProductsByConfig: fetchProductsOptimized,
  };
};

// Hook para limpar cache periodicamente
export const useCacheCleanup = (intervalMs = 30 * 60 * 1000) => { // 30 minutos
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hora
      
      for (const [key, cache] of productCache.entries()) {
        if (now - cache.timestamp > maxAge) {
          productCache.delete(key);
        }
      }
    };

    const interval = setInterval(cleanup, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
};

