
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Tag } from './useTags';

export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  category?: string;
  condition?: 'new' | 'used' | 'refurbished';
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'tags'> & {
  tagIds?: string[];
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    console.log('[useProducts] Iniciando busca de produtos');
    setLoading(true);
    setError(null);
    
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_tags!inner(
            tags(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('[useProducts] Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      console.log('[useProducts] Dados brutos recebidos:', productsData);

      const processedProducts = (productsData || []).map((product: any) => {
        const processedProduct: Product = {
          id: product.id,
          name: product.name || product.title || '',
          title: product.title || product.name || '',
          description: product.description,
          price: product.price || 0,
          image: product.image,
          images: product.additional_images || [product.image].filter(Boolean),
          additional_images: product.additional_images || [],
          sizes: product.sizes || [],
          colors: product.colors || [],
          stock: product.stock || 0,
          category: product.category || '',
          condition: product.condition as 'new' | 'used' | 'refurbished' || 'new',
          tags: product.product_tags?.map((pt: any) => pt.tags) || [],
          created_at: product.created_at,
          updated_at: product.updated_at,
        };

        console.log('[useProducts] Produto processado:', processedProduct);
        return processedProduct;
      });

      setProducts(processedProducts);
      console.log('[useProducts] Total de produtos definidos no estado:', processedProducts.length);

    } catch (err: any) {
      console.error('[useProducts] Erro na busca:', err);
      setError('Falha ao carregar produtos.');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addProduct = useCallback(async (productData: ProductInput): Promise<Product | null> => {
    console.log('[useProducts] Adicionando produto:', productData);
    setLoading(true);
    
    try {
      const { tagIds, ...productFields } = productData;
      
      const productPayload = {
        ...productFields,
        condition: productFields.condition || 'new' as const,
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productPayload)
        .select()
        .single();

      if (productError) throw productError;

      if (tagIds && tagIds.length > 0) {
        const tagInserts = tagIds.map(tagId => ({
          product_id: product.id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(tagInserts);

        if (tagError) {
          console.error('[useProducts] Erro ao inserir tags:', tagError);
        }
      }

      await fetchProducts();
      
      toast({
        title: 'Sucesso',
        description: 'Produto adicionado com sucesso.',
      });

      return product;

    } catch (err: any) {
      console.error('[useProducts] Erro ao adicionar produto:', err);
      setError('Falha ao adicionar produto.');
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível adicionar o produto.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, toast]);

  const updateProduct = useCallback(async (id: string, productData: Partial<ProductInput>): Promise<Product | null> => {
    console.log('[useProducts] Atualizando produto:', id, productData);
    setLoading(true);
    
    try {
      const { tagIds, ...productFields } = productData;

      const productPayload = {
        ...productFields,
        condition: productFields.condition || 'new' as const,
      };

      const { data: product, error: productError } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', id)
        .select()
        .single();

      if (productError) throw productError;

      if (tagIds !== undefined) {
        await supabase.from('product_tags').delete().eq('product_id', id);
        
        if (tagIds.length > 0) {
          const tagInserts = tagIds.map(tagId => ({
            product_id: id,
            tag_id: tagId,
          }));

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(tagInserts);

          if (tagError) {
            console.error('[useProducts] Erro ao atualizar tags:', tagError);
          }
        }
      }

      await fetchProducts();
      
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso.',
      });

      return product;

    } catch (err: any) {
      console.error('[useProducts] Erro ao atualizar produto:', err);
      setError('Falha ao atualizar produto.');
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, toast]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    console.log('[useProducts] Deletando produto:', id);
    setLoading(true);
    
    try {
      await supabase.from('product_tags').delete().eq('product_id', id);

      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) throw productError;

      await fetchProducts();
      
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso.',
      });

      return true;

    } catch (err: any) {
      console.error('[useProducts] Erro ao excluir produto:', err);
      setError('Falha ao excluir produto.');
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível excluir o produto.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
