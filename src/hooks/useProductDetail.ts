// Simplified product detail hook - using integra_products
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';

const productCache = new Map<string, Product>();

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let productData = productCache.get(productId);
        if (!productData) {
          productData = await fetchSingleProductFromDatabase(productId);
          if (productData) {
            productCache.set(productId, productData);
          }
        }

        if (!productData) {
          setProduct(null);
          setError('Produto não encontrado');
          return;
        }

        setProduct(productData);
        console.log('[useProductDetail] Produto carregado:', productData.name);
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
      }
    };

    fetchProduct();
  }, [productId, toast]);

  return { product, skuNavigation: null, loading, error };
};