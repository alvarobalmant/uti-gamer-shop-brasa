import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

<<<<<<< HEAD
// Interface restaurada para incluir campos usados no frontend/admin
export interface Product {
  id: string;
  title: string; // Usar 'title' consistentemente
  name?: string; // Adicionar 'name' como opcional se ainda for usado em algum lugar legado, mas priorizar 'title'
  description: string;
  price: number;
  discount_price?: number;
  images: string[]; // Campo principal para imagens
  image?: string; // Adicionar 'image' como opcional se ainda for usado em algum lugar legado, mas priorizar 'images[0]'
  category: string;
  platform?: string;
  condition?: 'new' | 'used' | 'refurbished';
  stock: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[]; // Assumindo que tags são armazenadas como array de strings no Supabase ou tratadas no fetch
  rating?: number;
  pro_discount?: number;
  // Campos adicionados para compatibilidade com Admin/Form
  additional_images?: string[]; 
  sizes?: string[];
  colors?: string[];
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
}

export const useProducts = () => {
<<<<<<< HEAD
  const [products, setProducts] = useState<Product[]>([]); // Inicializa vazio, busca no useEffect
=======
  const [products, setProducts] = useState<Product[]>([]);
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

<<<<<<< HEAD
  const fetchProducts = useCallback(async (options?: {
    category?: string;
    platform?: string;
    condition?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'desc' | 'asc';
  }) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[useProducts] Iniciando busca de produtos com opções: ${JSON.stringify(options)}`);
      setLoading(true);
      setError(null);
      
      let query = supabase.from('products').select('*');
      console.log('[useProducts] Query base criada: supabase.from("products").select("*")');

      // Apply filters based on options
      if (options?.category) {
        query = query.eq('category', options.category);
        console.log(`[useProducts] Filtro adicionado: category = ${options.category}`);
      }
      if (options?.platform) {
        query = query.eq('platform', options.platform);
        console.log(`[useProducts] Filtro adicionado: platform = ${options.platform}`);
      }
      if (options?.condition) {
        query = query.eq('condition', options.condition);
        console.log(`[useProducts] Filtro adicionado: condition = ${options.condition}`);
      }
      if (options?.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
        console.log(`[useProducts] Filtro adicionado: is_featured = ${options.featured}`);
      }
      if (options?.search) {
        query = query.ilike('title', `%${options.search}%`); 
        console.log(`[useProducts] Filtro adicionado: title ilike %${options.search}%`);
      }
      if (options?.sortBy) {
        query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
        console.log(`[useProducts] Ordenação adicionada: ${options.sortBy} ${options.sortOrder}`);
      }
      if (options?.limit) {
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
        query = query.limit(options.limit);
      }

<<<<<<< HEAD
      console.log('[useProducts] Executando query Supabase...');
      const { data, error: fetchError } = await query;
      console.log('[useProducts] Query Supabase concluída.');
      
      // Log raw response immediately
      console.log('[useProducts] Resposta RAW da busca de produtos:', { 
        data: data, 
        error: fetchError,
        count: data?.length || 0
      });

      if (fetchError) {
        console.error('[useProducts] Erro DETALHADO retornado pelo Supabase:', fetchError);
        throw fetchError; // Re-throw to be caught by the main catch block
      }

      // Garantir que os dados não sejam nulos e fazer o mapeamento correto
      if (data && data.length > 0) {
        console.log(`[useProducts] ${data.length} produtos recebidos. Mapeando...`);
        const mappedData = data.map(p => {
          const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
          return {
            ...p,
            name: p.title || p.name || 'Produto sem título',
            title: p.title || p.name || 'Produto sem título',
            image: images[0] || '',
            images: images,
            description: p.description || '',
            price: typeof p.price === 'number' ? p.price : 0,
            stock: typeof p.stock === 'number' ? p.stock : 0,
            category: p.category || 'Sem categoria'
          };
        });
        console.log('[useProducts] Dados mapeados e normalizados:', mappedData.length);
        setProducts(mappedData);
      } else {
        console.log('[useProducts] Nenhum produto encontrado ou array vazio retornado pelo Supabase.');
        setProducts([]);
      }

    } catch (err: any) {
      console.error('[useProducts] Erro GERAL no bloco catch ao buscar produtos:', err);
      // Log specific details if available
      if (err && err.message) {
        console.error('[useProducts] Mensagem de erro:', err.message);
      }
      if (err && err.details) {
        console.error('[useProducts] Detalhes do erro:', err.details);
      }
      if (err && err.hint) {
        console.error('[useProducts] Hint do erro:', err.hint);
      }
      setError('Falha ao carregar produtos.');
      setProducts([]); // Limpa produtos em caso de erro
      toast({ title: 'Erro', description: 'Não foi possível buscar os produtos.', variant: 'destructive' });
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

<<<<<<< HEAD
    } catch (err: any) {
      console.error(`Error fetching product with ID ${id}:`, err);
      setError(`Falha ao carregar produto com ID ${id}.`);
      toast({ title: 'Erro', description: `Não foi possível buscar o produto ${id}.`, variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
    }
  }, [toast]);

<<<<<<< HEAD
  // --- Funções CRUD Restauradas --- 
  const addProduct = useCallback(async (productData: ProductInput) => {
    setLoading(true);
    setError(null);
    try {
      // Remover campos que não devem ser enviados ou são opcionais e vazios
      const { name, image, ...restData } = productData;
      const payload: any = { ...restData };
      if (!payload.discount_price) delete payload.discount_price;
      if (!payload.platform) delete payload.platform;
      if (!payload.condition) delete payload.condition;
      if (!payload.tags) delete payload.tags;
      if (!payload.rating) delete payload.rating;
      if (!payload.pro_discount) delete payload.pro_discount;
      if (!payload.additional_images) delete payload.additional_images;
      if (!payload.sizes) delete payload.sizes;
      if (!payload.colors) delete payload.colors;

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(payload)
=======
  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { tagIds?: string[] }) => {
    try {
      const { tagIds, ...productFields } = productData;
      
      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert([productFields])
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
        .select()
        .single();

      if (insertError) throw insertError;

<<<<<<< HEAD
      // Atualiza a lista local
      await fetchProducts(); 
      toast({ title: 'Sucesso', description: 'Produto adicionado com sucesso.' });
      return data;

    } catch (err: any) {
      console.error('Error adding product:', err);
      setError('Falha ao adicionar produto.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível adicionar o produto.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchProducts]);

  const updateProduct = useCallback(async (id: string, productData: ProductInput) => {
    setLoading(true);
    setError(null);
    try {
      // Remover campos que não devem ser enviados ou são opcionais e vazios
      const { name, image, id: inputId, created_at, updated_at, ...restData } = productData;
      const payload: any = { ...restData };
      if (!payload.discount_price) delete payload.discount_price;
      if (!payload.platform) delete payload.platform;
      if (!payload.condition) delete payload.condition;
      if (!payload.tags) delete payload.tags;
      if (!payload.rating) delete payload.rating;
      if (!payload.pro_discount) delete payload.pro_discount;
      if (!payload.additional_images) delete payload.additional_images;
      if (!payload.sizes) delete payload.sizes;
      if (!payload.colors) delete payload.colors;

      const { data, error: updateError } = await supabase
        .from('products')
        .update(payload)
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

<<<<<<< HEAD
      // Atualiza a lista local
      await fetchProducts(); 
      toast({ title: 'Sucesso', description: 'Produto atualizado com sucesso.' });
      return data;

    } catch (err: any) {
      console.error('Error updating product:', err);
      setError('Falha ao atualizar produto.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível atualizar o produto.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
    }
  }, [toast, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    try {
=======
    try {
      // First delete related tags
      await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', id);

      // Then delete the product
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

<<<<<<< HEAD
      // Atualiza a lista local
      await fetchProducts(); 
      toast({ title: 'Sucesso', description: 'Produto excluído com sucesso.' });
      return true;

    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('Falha ao excluir produto.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível excluir o produto.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchProducts]);
  // --- Fim Funções CRUD Restauradas ---

  // Initial fetch with forced delay to ensure proper loading
=======
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

>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

<<<<<<< HEAD
  // Retorna todas as funções, incluindo as CRUD
  return { products, loading, error, fetchProducts, fetchProductById, addProduct, updateProduct, deleteProduct };};
=======
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
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
