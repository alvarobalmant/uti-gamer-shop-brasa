
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  tags?: { id: string; name: string; }[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos...');
      
      // Primeira consulta: buscar todos os produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      console.log('Produtos encontrados:', productsData);

      // Segunda consulta: buscar as tags para cada produto
      const productsWithTags = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: productTagsData, error: tagsError } = await supabase
            .from('product_tags')
            .select(`
              tags (
                id,
                name
              )
            `)
            .eq('product_id', product.id);

          if (tagsError) {
            console.error('Erro ao buscar tags do produto:', tagsError);
            return {
              ...product,
              tags: []
            };
          }

          return {
            ...product,
            tags: productTagsData?.map((pt: any) => pt.tags).filter(Boolean) || []
          };
        })
      );

      setProducts(productsWithTags);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
    try {
      const { tagIds, ...product } = productData;
      
      const { data: productResult, error: productError } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (productError) throw productError;

      // Adicionar relacionamentos com tags
      if (tagIds.length > 0) {
        const tagRelations = tagIds.map(tagId => ({
          product_id: productResult.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(tagRelations);

        if (tagError) throw tagError;
      }

      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      
      return productResult;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
    try {
      const { tagIds, tags, ...productUpdates } = updates;

      const { data, error } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar tags se fornecidas
      if (tagIds !== undefined) {
        // Remover relacionamentos existentes
        await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', id);

        // Adicionar novos relacionamentos
        if (tagIds.length > 0) {
          const tagRelations = tagIds.map(tagId => ({
            product_id: id,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(tagRelations);

          if (tagError) throw tagError;
        }
      }

      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
