
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('[useProductDetail] fetchProduct called with productId:', productId);
      
      if (!productId) {
        console.log('[useProductDetail] No productId provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('[useProductDetail] Starting fetchSingleProductFromDatabase');
        const productData = await fetchSingleProductFromDatabase(productId);
        console.log('[useProductDetail] Product data received:', productData);

        if (!productData) {
          console.log('[useProductDetail] No product data found');
          setProduct(null);
          setError('Produto não encontrado');
          return;
        }

        setProduct(productData);
        console.log('[useProductDetail] Product set successfully');
      } catch (err: any) {
        console.error('[useProductDetail] Error fetching product:', err);
        setError(err.message || 'Erro ao carregar produto');
        toast({
          title: "Erro ao carregar produto",
          description: err.message || 'Tente novamente em alguns instantes',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        console.log('[useProductDetail] Loading finished');
      }
    };

    fetchProduct();
  }, [productId, toast]);

  return { product, loading, error };
};
