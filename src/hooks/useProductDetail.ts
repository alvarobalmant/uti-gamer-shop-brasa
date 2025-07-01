
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

        // Agrupar dados do produto com tags
        const productData: Product = {
          id: data[0].product_id,
          name: data[0].product_name || '',
          description: data[0].product_description || '',
          price: Number(data[0].product_price) || 0,
          image: data[0].product_image || '',
          stock: data[0].product_stock || 0,
          badge_text: data[0].badge_text || '',
          badge_color: data[0].badge_color || '#22c55e',
          badge_visible: data[0].badge_visible || false,
          specifications: data[0].product_specifications || [],
          images: data[0].product_images || [],
          additional_images: data[0].product_images || [],
          tags: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          is_featured: Math.random() > 0.7, // Mock para destaque
          list_price: Number(data[0].product_price) * 1.2, // Mock para preço de lista
          new_price: Number(data[0].product_price) * 1.1, // Mock para preço novo
          digital_price: Number(data[0].product_price) * 1.05, // Mock para preço digital
          pro_price: Number(data[0].product_price) * 0.9, // Mock para preço PRO
          pro_discount_percent: 10,
          sizes: ['Físico', 'Digital'], // Mock
          colors: [], // Mock
          rating: 4.8, // Mock
        };

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
