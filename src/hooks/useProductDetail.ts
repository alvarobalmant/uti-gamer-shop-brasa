
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { supabase } from '@/integrations/supabase/client';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('view_product_with_tags')
          .select('*')
          .eq('product_id', productId);

        if (error) throw error;

        if (!data || data.length === 0) {
          setProduct(null);
          return;
        }

        // Agrupar dados do produto com tags usando os campos corretos da view
        console.log('useProductDetail: Raw data from view:', data[0]);
        
        const productData: Product = {
          id: data[0].product_id,
          name: data[0].product_name || '',
          description: data[0].product_description || '',
          price: Number(data[0].product_price) || 0,
          pro_price: data[0].pro_price ? Number(data[0].pro_price) : undefined,
          list_price: data[0].list_price ? Number(data[0].list_price) : undefined,
          image: data[0].product_image || '',
          additional_images: data[0].additional_images || [],
          sizes: data[0].sizes || [],
          colors: data[0].colors || [],
          stock: data[0].product_stock || 0,
          badge_text: data[0].badge_text || '',
          badge_color: data[0].badge_color || '#22c55e',
          badge_visible: data[0].badge_visible || false,
          specifications: data[0].specifications || [],
          technical_specs: data[0].technical_specs || {},
          product_features: data[0].product_features || {},
          shipping_weight: data[0].shipping_weight ? Number(data[0].shipping_weight) : undefined,
          free_shipping: data[0].free_shipping || false,
          meta_title: data[0].meta_title || '',
          meta_description: data[0].meta_description || '',
          slug: data[0].slug || '',
          is_active: data[0].is_active !== false,
          is_featured: data[0].is_featured || false,
          tags: [],
          created_at: data[0].created_at || new Date().toISOString(),
          updated_at: data[0].updated_at || new Date().toISOString(),
          // Valores padrão/calculados para campos opcionais
          new_price: data[0].list_price ? Number(data[0].list_price) * 1.1 : undefined,
          digital_price: Number(data[0].product_price) * 1.05,
          pro_discount_percent: data[0].pro_price ? Math.round(((Number(data[0].product_price) - Number(data[0].pro_price)) / Number(data[0].product_price)) * 100) : undefined,
          rating: 4.8, // Mock - pode ser implementado futuramente
        };

        console.log('useProductDetail: Processed product data:', productData);
        console.log('useProductDetail: Product specifications:', productData.specifications);
        console.log('useProductDetail: Product meta_title:', productData.meta_title);
        console.log('useProductDetail: Product meta_description:', productData.meta_description);
        console.log('useProductDetail: Product slug:', productData.slug);

        // Adicionar tags únicas
        const uniqueTags = new Map();
        data.forEach((row: any) => {
          if (row.tag_id && row.tag_name && !uniqueTags.has(row.tag_id)) {
            uniqueTags.set(row.tag_id, {
              id: row.tag_id,
              name: row.tag_name
            });
          }
        });
        productData.tags = Array.from(uniqueTags.values());

        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product:', err);
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

  return { product, loading, error };
};
