
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductTag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  created_at?: string;
  updated_at?: string;
  tags?: ProductTag[];
}

interface FetchProductsOptions {
  category?: string;
  platform?: string;
  condition?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async (options: FetchProductsOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
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

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform the data to include tags properly
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        additional_images: product.additional_images,
        sizes: product.sizes,
        colors: product.colors,
        created_at: product.created_at,
        updated_at: product.updated_at,
        tags: product.product_tags?.map((pt: any) => ({
          id: pt.tags.id,
          name: pt.tags.name
        })) || []
      })) || [];

      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Falha ao carregar produtos.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          product_tags(
            tag_id,
            tags(
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return {
        ...data,
        tags: data.product_tags?.map((pt: any) => ({
          id: pt.tags.id,
          name: pt.tags.name
        })) || []
      };
    } catch (err: any) {
      console.error(`Error fetching product with ID ${id}:`, err);
      return null;
    }
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { tagIds?: string[] }) => {
    try {
      const { tagIds, ...productFields } = productData;
      
      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert([productFields])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add tags if provided
      if (tagIds && tagIds.length > 0) {
        const tagInserts = tagIds.map(tagId => ({
          product_id: product.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(tagInserts);

        if (tagError) {
          console.error('Error adding product tags:', tagError);
        }
      }

      toast({ 
        title: 'Sucesso', 
        description: 'Produto adicionado com sucesso.' 
      });

      await fetchProducts();
      return product;
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao adicionar produto.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProducts]);

  const updateProduct = useCallback(async (id: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> & { tagIds?: string[] }) => {
    try {
      const { tagIds, ...productFields } = productData;
      
      const { data: product, error: updateError } = await supabase
        .from('products')
        .update(productFields)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update tags if provided
      if (tagIds !== undefined) {
        // First, remove existing tags
        await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', id);

        // Then add new tags
        if (tagIds.length > 0) {
          const tagInserts = tagIds.map(tagId => ({
            product_id: id,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(tagInserts);

          if (tagError) {
            console.error('Error updating product tags:', tagError);
          }
        }
      }

      toast({ 
        title: 'Sucesso', 
        description: 'Produto atualizado com sucesso.' 
      });

      await fetchProducts();
      return product;
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar produto.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      // First delete related tags
      await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', id);

      // Then delete the product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Produto removido com sucesso.' 
      });

      await fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover produto.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    fetchProductById, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  };
};
