// Simplified optimized product detail hook - using integra_products
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchSingleProductFromDatabase } from './useProducts/productApi';
import { Product } from './useProducts/types';

const productDetailCache = new Map<string, { product: Product; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export const useOptimizedProductDetail = (productId: string | undefined) => {
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback((id: string) => {
    const cached = productDetailCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  }, []);

  const productQuery = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');

      const cached = getCachedData(productId);
      if (cached) {
        console.log(`🚀 Using cached data for product ${productId}`);
        return cached;
      }

      console.log(`📡 Fetching product details for ${productId}`);
      const productData = await fetchSingleProductFromDatabase(productId);
      if (!productData) {
        throw new Error('Produto não encontrado');
      }

      const result = { product: productData, timestamp: Date.now() };
      productDetailCache.set(productId, result);
      return result;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000
  });

  useEffect(() => {
    if (productQuery.error) {
      const errorMessage = productQuery.error.message || 'Erro ao carregar produto';
      setError(errorMessage);
      toast.error(errorMessage);
    } else {
      setError(null);
    }
  }, [productQuery.error]);

  return useMemo(() => ({
    product: productQuery.data?.product || null,
    skuNavigation: null,
    loading: productQuery.isLoading,
    error,
    isOptimistic: false,
    getOptimisticData: () => null,
    invalidateCache: () => {
      productQuery.refetch();
      if (productId) productDetailCache.delete(productId);
    },
    prefetchSKU: () => {}
  }), [productQuery.data, productQuery.isLoading, error, productQuery.refetch, productId]);
};