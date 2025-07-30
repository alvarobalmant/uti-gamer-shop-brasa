import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchProductsLightPaginated, 
  fetchProductsByCriteriaOptimized,
  fetchProductDetails,
  ProductLight,
  preloadCriticalImages,
  invalidateProductCache
} from './useProducts/productApiOptimized';
import { Product } from './useProducts/types';
import { handleProductError } from './useProducts/productErrorHandler';

interface UseProductsLightOptions {
  enablePagination?: boolean;
  pageSize?: number;
  enableCache?: boolean;
  preloadImages?: boolean;
}

export const useProductsLight = (options: UseProductsLightOptions = {}) => {
  const {
    enablePagination = true,
    pageSize = 20,
    enableCache = true,
    preloadImages = true
  } = options;

  const [productsLight, setProductsLight] = useState<ProductLight[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const { toast } = useToast();

  // Cache para produtos detalhados
  const [productDetailsCache, setProductDetailsCache] = useState<Map<string, Product>>(new Map());

  const fetchProducts = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      
      const { products, hasMore: hasMoreProducts, total } = await fetchProductsLightPaginated(page, pageSize);
      
      if (append) {
        setProductsLight(prev => [...prev, ...products]);
      } else {
        setProductsLight(products);
        
        // Pré-carregar imagens críticas
        if (preloadImages && products.length > 0) {
          preloadCriticalImages(products, 6);
        }
      }
      
      setHasMore(hasMoreProducts);
      setTotalProducts(total);
      setCurrentPage(page);
      
      console.log(`[useProductsLight] Carregados ${products.length} produtos da página ${page}`);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      toast({
        title: "Erro ao carregar produtos",
        description: errorMessage,
        variant: "destructive",
      });
      setProductsLight([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, preloadImages, toast]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchProducts(currentPage + 1, true);
  }, [hasMore, loading, currentPage, fetchProducts]);

  const fetchProductDetails = useCallback(async (productId: string): Promise<Product | null> => {
    // Verificar cache primeiro
    if (productDetailsCache.has(productId)) {
      return productDetailsCache.get(productId)!;
    }

    try {
      const product = await fetchProductDetails(productId);
      if (product) {
        setProductDetailsCache(prev => new Map(prev).set(productId, product));
      }
      return product;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar detalhes do produto');
      toast({
        title: "Erro ao carregar produto",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [productDetailsCache, toast]);

  const invalidateCache = useCallback(() => {
    invalidateProductCache();
    setProductDetailsCache(new Map());
  }, []);

  const refresh = useCallback(async () => {
    invalidateCache();
    setCurrentPage(0);
    await fetchProducts(0, false);
  }, [fetchProducts, invalidateCache]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchProducts(0, false);
  }, [fetchProducts]);

  // Memoizar valores computados
  const isEmpty = useMemo(() => productsLight.length === 0, [productsLight.length]);
  const isLoadingMore = useMemo(() => loading && currentPage > 0, [loading, currentPage]);

  return {
    productsLight,
    loading,
    hasMore,
    currentPage,
    totalProducts,
    isEmpty,
    isLoadingMore,
    loadMore,
    fetchProductDetails,
    refresh,
    invalidateCache
  };
};