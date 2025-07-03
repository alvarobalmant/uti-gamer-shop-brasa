
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, SKUNavigation } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';
import { supabase } from '@/integrations/supabase/client';

// Cache local para produtos
const productCache = new Map<string, Product>();

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [skuNavigation, setSKUNavigation] = useState<SKUNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSKUNavigationOptimized = useCallback(async (productData: Product): Promise<SKUNavigation | null> => {
    try {
      // Se não é um produto SKU ou master, não precisa de navegação
      if (productData.product_type !== 'master' && productData.product_type !== 'sku') {
        return null;
      }

      let masterProductId = productData.id;
      let currentSKU = undefined;

      // Se é um SKU, buscar o produto mestre
      if (productData.product_type === 'sku' && productData.parent_product_id) {
        masterProductId = productData.parent_product_id;
        currentSKU = productData;
      }

      // Buscar produto mestre (usar cache se disponível)
      let masterProduct = productCache.get(masterProductId);
      if (!masterProduct) {
        masterProduct = await fetchSingleProductFromDatabase(masterProductId);
        if (masterProduct) {
          productCache.set(masterProductId, masterProduct);
        }
      }

      if (!masterProduct) return null;

      // Buscar todos os SKUs do produto mestre em uma única query
      const { data: skusData, error } = await supabase
        .from('view_product_with_tags')
        .select('product_id, product_name, product_price, variant_attributes, sku_code, sort_order')
        .eq('parent_product_id', masterProduct.id)
        .eq('product_type', 'sku')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Erro ao buscar SKUs:', error);
        return null;
      }

      const skus = skusData?.map((row: any) => ({
        id: row.product_id,
        name: row.product_name || '',
        price: Number(row.product_price) || 0,
        variant_attributes: row.variant_attributes || {},
        sku_code: row.sku_code,
        sort_order: row.sort_order || 0
      })) || [];

      return {
        masterProduct: masterProduct as any,
        currentSKU: currentSKU as any,
        availableSKUs: skus as any,
        platforms: skus.map(sku => ({
          platform: sku.variant_attributes?.platform || '',
          sku: sku as any,
          available: true
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar navegação de SKUs:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProductAndNavigation = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Verificar cache primeiro
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

        // Carregar navegação de SKU em paralelo
        const navigation = await fetchSKUNavigationOptimized(productData);
        setSKUNavigation(navigation);

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

    fetchProductAndNavigation();
  }, [productId, toast, fetchSKUNavigationOptimized]);

  return { product, skuNavigation, loading, error };
};
