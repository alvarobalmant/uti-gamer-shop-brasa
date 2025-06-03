
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  additional_images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  // Optional pricing fields that some components expect
  pro_discount_percent?: number;
  pro_price?: number;
  list_price?: number;
  new_price?: number;
  digital_price?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando produtos...');
      
      // Fetch products with their tags
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_tags!inner(
            tag_id,
            tags!inner(
              id,
              name
            )
          )
        `);

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      // Transform the data to include tags properly
      const transformedProducts: Product[] = [];
      const productMap = new Map<string, Product>();

      productsData?.forEach((product: any) => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            tags: []
          });
        }

        const existingProduct = productMap.get(product.id)!;
        
        if (product.product_tags && product.product_tags.tags) {
          const tag = {
            id: product.product_tags.tags.id,
            name: product.product_tags.tags.name
          };
          
          // Check if tag already exists to avoid duplicates
          if (!existingProduct.tags!.some(t => t.id === tag.id)) {
            existingProduct.tags!.push(tag);
          }
        }
      });

      const finalProducts = Array.from(productMap.values());
      
      console.log(`${finalProducts.length} produtos carregados`);
      setProducts(finalProducts);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      setError(error.message || 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto criado com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto removido com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
