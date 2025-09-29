/**
 * useGlobalProductCache - Cache Global de Produtos
 * 
 * Este hook mantém um cache global de produtos que persiste entre navegações,
 * evitando requisições desnecessárias à API quando o usuário navega entre páginas.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { fetchProductsFromDatabase } from '@/hooks/useProducts/productApi';
import { useToast } from '@/hooks/use-toast';

interface GlobalCacheState {
  products: Product[];
  loading: boolean;
  lastFetch: number | null;
  error: string | null;
}

// Cache global singleton - persiste entre componentes
let globalCache: GlobalCacheState = {
  products: [],
  loading: false,
  lastFetch: null,
  error: null
};

// Lista de subscribers para notificar mudanças
let subscribers: Set<(cache: GlobalCacheState) => void> = new Set();

// TTL do cache: 10 minutos
const CACHE_TTL = 10 * 60 * 1000;

// Função para notificar todos os subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => {
    try {
      callback({ ...globalCache });
    } catch (error) {
      console.error('Erro ao notificar subscriber:', error);
    }
  });
};

// Função para verificar se o cache é válido
const isCacheValid = (): boolean => {
  if (!globalCache.lastFetch) return false;
  return (Date.now() - globalCache.lastFetch) < CACHE_TTL;
};

// Função para buscar produtos (singleton)
let fetchPromise: Promise<void> | null = null;

const fetchProductsToCache = async (): Promise<void> => {
  // Se já há uma requisição em andamento, aguardar ela
  if (fetchPromise) {
    return fetchPromise;
  }

  // Se o cache é válido, não fazer nova requisição
  if (isCacheValid() && globalCache.products.length > 0) {
    console.log('[GlobalCache] ✅ Cache válido, usando dados existentes');
    return Promise.resolve();
  }

  console.log('[GlobalCache] 🌐 Fazendo nova requisição à API');
  
  globalCache.loading = true;
  globalCache.error = null;
  notifySubscribers();

  fetchPromise = (async () => {
    try {
      const products = await fetchProductsFromDatabase(true);
      
      globalCache.products = products;
      globalCache.lastFetch = Date.now();
      globalCache.loading = false;
      globalCache.error = null;
      
      console.log(`[GlobalCache] ✅ ${products.length} produtos carregados e salvos no cache`);
      notifySubscribers();
    } catch (error: any) {
      globalCache.loading = false;
      globalCache.error = error.message || 'Erro ao carregar produtos';
      
      console.error('[GlobalCache] ❌ Erro ao carregar produtos:', error);
      notifySubscribers();
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

/**
 * Hook principal para acessar o cache global de produtos
 */
export const useGlobalProductCache = () => {
  const [cacheState, setCacheState] = useState<GlobalCacheState>(() => ({ ...globalCache }));
  const { toast } = useToast();
  const subscriberRef = useRef<(cache: GlobalCacheState) => void>();

  // Função para forçar refresh do cache
  const refreshCache = useCallback(async () => {
    console.log('[GlobalCache] 🔄 Refresh manual solicitado');
    globalCache.lastFetch = null; // Invalidar cache
    await fetchProductsToCache();
  }, []);

  // Função para invalidar cache
  const invalidateCache = useCallback(() => {
    console.log('[GlobalCache] 🗑️ Cache invalidado');
    globalCache.lastFetch = null;
    globalCache.products = [];
    globalCache.error = null;
    notifySubscribers();
  }, []);

  // Função para obter produtos (com carregamento automático se necessário)
  const getProducts = useCallback(async (): Promise<Product[]> => {
    // Se o cache é válido, retornar imediatamente
    if (isCacheValid() && globalCache.products.length > 0) {
      return globalCache.products;
    }

    // Caso contrário, buscar da API
    await fetchProductsToCache();
    return globalCache.products;
  }, []);

  // Função para obter produto por ID
  const getProductById = useCallback((id: string): Product | undefined => {
    return globalCache.products.find(p => p.id === id);
  }, []);

  // Função para filtrar produtos por critério
  const getProductsByCriteria = useCallback((
    criteria: {
      category?: string;
      platform?: string;
      tags?: string[];
      featured?: boolean;
      active?: boolean;
    }
  ): Product[] => {
    let filtered = globalCache.products;

    if (criteria.category) {
      filtered = filtered.filter(p => p.category === criteria.category);
    }

    if (criteria.platform) {
      filtered = filtered.filter(p => p.platform === criteria.platform);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      filtered = filtered.filter(p => 
        p.tags?.some(tag => 
          criteria.tags!.includes(tag.id) || criteria.tags!.includes(tag.name)
        )
      );
    }

    if (criteria.featured !== undefined) {
      filtered = filtered.filter(p => p.is_featured === criteria.featured);
    }

    if (criteria.active !== undefined) {
      filtered = filtered.filter(p => p.is_active === criteria.active);
    }

    return filtered;
  }, []);

  // Subscribir para mudanças no cache
  useEffect(() => {
    const subscriber = (cache: GlobalCacheState) => {
      setCacheState({ ...cache });
    };

    subscriberRef.current = subscriber;
    subscribers.add(subscriber);

    // Cleanup
    return () => {
      if (subscriberRef.current) {
        subscribers.delete(subscriberRef.current);
      }
    };
  }, []);

  // Carregar produtos automaticamente se não há cache válido
  useEffect(() => {
    if (!isCacheValid() && globalCache.products.length === 0 && !globalCache.loading) {
      console.log('[GlobalCache] 🚀 Carregamento automático iniciado - cache vazio');
      fetchProductsToCache();
    }
  }, []);

  // Mostrar toast em caso de erro
  useEffect(() => {
    if (cacheState.error) {
      toast({
        title: "Erro ao carregar produtos",
        description: cacheState.error,
        variant: "destructive",
      });
    }
  }, [cacheState.error, toast]);

  return {
    // Estado
    products: cacheState.products,
    loading: cacheState.loading,
    error: cacheState.error,
    lastFetch: cacheState.lastFetch,
    
    // Funções
    getProducts,
    getProductById,
    getProductsByCriteria,
    refreshCache,
    invalidateCache,
    
    // Informações do cache
    isCacheValid: isCacheValid(),
    cacheAge: cacheState.lastFetch ? Date.now() - cacheState.lastFetch : null,
  };
};

/**
 * Hook especializado para páginas de seção
 */
export const useProductsForSection = (sectionItems?: Array<{ item_type: string; item_id: string }>) => {
  const { products, loading, getProducts, isCacheValid } = useGlobalProductCache();
  const [sectionProducts, setSectionProducts] = useState<Product[]>([]);

  // Carregar produtos se necessário
  useEffect(() => {
    if (!isCacheValid && products.length === 0 && !loading) {
      console.log('[SectionCache] 🔄 Carregando produtos para seção');
      getProducts();
    }
  }, [isCacheValid, products.length, loading, getProducts]);

  // Filtrar produtos da seção
  useEffect(() => {
    if (!sectionItems || products.length === 0) {
      setSectionProducts([]);
      return;
    }

    const productMap = new Map<string, Product>();

    for (const item of sectionItems) {
      if (item.item_type === 'product') {
        const product = products.find(p => p.id === item.item_id);
        if (product && product.product_type !== 'master' && !productMap.has(product.id)) {
          productMap.set(product.id, product);
        }
      } else if (item.item_type === 'tag') {
        const tagProducts = products.filter(p => 
          p.product_type !== 'master' && 
          p.tags?.some(tag => 
            tag.name.toLowerCase() === item.item_id.toLowerCase() || 
            tag.id === item.item_id
          )
        );
        tagProducts.forEach(product => {
          if (!productMap.has(product.id)) {
            productMap.set(product.id, product);
          }
        });
      }
    }

    const result = Array.from(productMap.values());
    setSectionProducts(result);
    
    console.log(`[SectionCache] ✅ ${result.length} produtos filtrados para seção`);
  }, [sectionItems, products]);

  return {
    products: sectionProducts,
    loading,
    allProducts: products,
    isCacheValid,
  };
};

export default useGlobalProductCache;
