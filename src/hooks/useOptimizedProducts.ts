import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts/types';
import { toast } from 'sonner';

interface UseOptimizedProductsOptions {
  category?: string;
  limit?: number;
  enableInfiniteScroll?: boolean;
  enableVirtualization?: boolean;
  prefetchNext?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface OptimizedProduct extends Product {
  formattedPrice: string;
  formattedPromotionalPrice?: string;
  formattedUtiProPrice?: string;
  discountPercentage?: number;
  hasDiscount: boolean;
}

export const useOptimizedProducts = (options: UseOptimizedProductsOptions = {}) => {
  const {
    category,
    limit = 12,
    enableInfiniteScroll = false,
    enableVirtualization = false,
    prefetchNext = true,
    staleTime = 5 * 60 * 1000, // 5 minutos
    cacheTime = 10 * 60 * 1000, // 10 minutos
  } = options;

  const [page, setPage] = useState(0);
  const [allProducts, setAllProducts] = useState<OptimizedProduct[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver>();

  // Função para formatar preços
  const formatPrice = useCallback((price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }, []);

  // Função para calcular desconto
  const calculateDiscount = useCallback((originalPrice: number, promotionalPrice?: number): number => {
    if (!promotionalPrice || promotionalPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
  }, []);

  // Função para otimizar dados do produto
  const optimizeProduct = useCallback((product: Product): OptimizedProduct => {
    const formattedPrice = formatPrice(product.price);
    const formattedPromotionalPrice = product.promotional_price 
      ? formatPrice(product.promotional_price) 
      : undefined;
    const formattedUtiProPrice = product.uti_pro_price 
      ? formatPrice(product.uti_pro_price) 
      : undefined;
    
    const discountPercentage = calculateDiscount(product.price, product.promotional_price);
    const hasDiscount = discountPercentage > 0;

    return {
      ...product,
      formattedPrice,
      formattedPromotionalPrice,
      formattedUtiProPrice,
      discountPercentage,
      hasDiscount,
    };
  }, [formatPrice, calculateDiscount]);

  // Query para buscar produtos
  const {
    data: rawProducts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['optimized-products', category, page, limit],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          promotional_price,
          uti_pro_price,
          image,
          slug,
          description,
          category,
          platform,
          is_featured,
          stock_quantity,
          created_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (enableInfiniteScroll) {
        query = query.range(page * limit, (page + 1) * limit - 1);
      } else {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }

      return (data || []) as unknown as Product[];
    },
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus: false,
    retry: 2,
    select: useCallback((data: Product[]) => {
      return data.map(optimizeProduct);
    }, [optimizeProduct]),
  });

  // Produtos otimizados
  const optimizedProducts = useMemo(() => {
    if (enableInfiniteScroll) {
      return allProducts;
    }
    return rawProducts;
  }, [enableInfiniteScroll, allProducts, rawProducts]);

  // Atualizar lista para infinite scroll
  useEffect(() => {
    if (enableInfiniteScroll && rawProducts.length > 0) {
      if (page === 0) {
        setAllProducts(rawProducts);
      } else {
        setAllProducts(prev => [...prev, ...rawProducts]);
      }
      
      setHasNextPage(rawProducts.length === limit);
    }
  }, [rawProducts, page, limit, enableInfiniteScroll]);

  // Prefetch da próxima página
  useEffect(() => {
    if (prefetchNext && !enableInfiniteScroll && rawProducts.length > 0) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: ['optimized-products', category, nextPage, limit],
        queryFn: async () => {
          let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range(nextPage * limit, (nextPage + 1) * limit - 1);

          if (category) {
            query = query.eq('category', category);
          }

          const { data } = await query;
          return data as Product[];
        },
        staleTime: staleTime / 2, // Prefetch com stale time menor
      });
    }
  }, [rawProducts, page, limit, category, prefetchNext, enableInfiniteScroll, queryClient, staleTime]);

  // Função para carregar mais produtos (infinite scroll)
  const loadMore = useCallback(() => {
    if (enableInfiniteScroll && hasNextPage && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [enableInfiniteScroll, hasNextPage, isLoading]);

  // Ref callback para infinite scroll
  const lastProductElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMore();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px', // Começar a carregar 100px antes
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, loadMore]);

  // Função para buscar produto específico
  const getProduct = useCallback(async (id: string): Promise<OptimizedProduct | null> => {
    try {
      // Primeiro tentar no cache
      const cachedProduct = optimizedProducts.find(p => p.id === id);
      if (cachedProduct) return cachedProduct;

      // Buscar no banco se não estiver no cache
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return optimizeProduct(data as Product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }, [optimizedProducts, optimizeProduct]);

  // Função para buscar produtos relacionados
  const getRelatedProducts = useCallback(async (productId: string, count: number = 4): Promise<OptimizedProduct[]> => {
    try {
      const currentProduct = await getProduct(productId);
      if (!currentProduct) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', currentProduct.category)
        .neq('id', productId)
        .limit(count);

      if (error || !data) return [];

      return data.map((product: any) => optimizeProduct(product as Product));
    } catch (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return [];
    }
  }, [getProduct, optimizeProduct]);

  // Função para invalidar cache
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['optimized-products'] });
  }, [queryClient]);

  // Função para reset
  const reset = useCallback(() => {
    setPage(0);
    setAllProducts([]);
    setHasNextPage(true);
  }, []);

  // Cleanup do observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Tratamento de erro
  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar produtos. Tente novamente.');
    }
  }, [error]);

  return {
    products: optimizedProducts,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    lastProductElementRef,
    getProduct,
    getRelatedProducts,
    invalidateCache,
    reset,
    refetch,
    // Estatísticas úteis
    totalLoaded: optimizedProducts.length,
    currentPage: page,
  };
};

