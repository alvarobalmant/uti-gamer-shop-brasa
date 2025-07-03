import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoizar para evitar re-execuções desnecessárias
  const memoizedProductId = useMemo(() => productId, [productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!memoizedProductId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const productData = await fetchSingleProductFromDatabase(memoizedProductId);

        if (!productData) {
          setProduct(null);
          setError('Produto não encontrado');
          return;
        }

        setProduct(productData);
      } catch (err: any) {
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
  }, [memoizedProductId, toast]);

  return { product, loading, error };
};