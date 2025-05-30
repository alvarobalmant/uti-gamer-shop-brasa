
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  list_price?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  image: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
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
      
      // Buscar todos os produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      console.log('Produtos encontrados:', productsData?.length || 0);

      // Buscar as tags para cada produto usando a view otimizada
      const productsWithTags = await Promise.all(
        (productsData || []).map(async (product) => {
          console.log('Buscando tags para produto:', product.name);
          
          const { data: productTagsData, error: tagsError } = await supabase
            .from('view_product_with_tags')
            .select('tag_id, tag_name')
            .eq('product_id', product.id);

          if (tagsError) {
            console.error('Erro ao buscar tags do produto:', product.name, tagsError);
            return {
              ...product,
              tags: []
            };
          }

          const tags = productTagsData?.map(row => ({
            id: row.tag_id,
            name: row.tag_name
          })).filter(tag => tag.id && tag.name) || [];

          console.log(`Tags para ${product.name}:`, tags);

          return {
            ...product,
            tags
          };
        })
      );

      console.log('Produtos com tags carregados:', productsWithTags.length);
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
      console.log('Adicionando produto:', productData);
      const { tagIds, ...product } = productData;
      
      const { data: productResult, error: productError } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (productError) {
        console.error('Erro ao inserir produto:', productError);
        throw productError;
      }

      console.log('Produto criado:', productResult.id);

      // Adicionar relacionamentos com tags
      if (tagIds && tagIds.length > 0) {
        console.log('Adicionando tags ao produto:', tagIds);
        const tagRelations = tagIds.map(tagId => ({
          product_id: productResult.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(tagRelations);

        if (tagError) {
          console.error('Erro ao adicionar tags:', tagError);
          throw tagError;
        }
        console.log('Tags adicionadas com sucesso');
      }

      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      
      return productResult;
    } catch (error: any) {
      console.error('Erro completo ao adicionar produto:', error);
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
      console.log('Atualizando produto:', id, updates);
      const { tagIds, tags, ...productUpdates } = updates;

      const { data, error } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }

      console.log('Produto atualizado:', data.id);

      // Atualizar tags se fornecidas
      if (tagIds !== undefined) {
        console.log('Atualizando tags do produto:', tagIds);
        
        // Remover relacionamentos existentes
        const { error: deleteError } = await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', id);

        if (deleteError) {
          console.error('Erro ao remover tags antigas:', deleteError);
          throw deleteError;
        }

        // Adicionar novos relacionamentos
        if (tagIds.length > 0) {
          const tagRelations = tagIds.map(tagId => ({
            product_id: id,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(tagRelations);

          if (tagError) {
            console.error('Erro ao inserir novas tags:', tagError);
            throw tagError;
          }
        }
        console.log('Tags atualizadas com sucesso');
      }

      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro completo ao atualizar produto:', error);
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
      console.log('Deletando produto:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
      console.log('Produto deletado com sucesso');
    } catch (error: any) {
      console.error('Erro completo ao deletar produto:', error);
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
