
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define tag interface
export interface ProductTag {
  id: string;
  name: string;
}

// Interface restaurada para incluir campos usados no frontend/admin
export interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  image?: string;
  category: string;
  platform?: string;
  condition?: 'new' | 'used' | 'refurbished';
  stock: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: ProductTag[]; // Changed to ProductTag[]
  rating?: number;
  pro_discount?: number;
  // Campos adicionados para compatibilidade com Admin/Form
  additional_images?: string[]; 
  sizes?: string[];
  colors?: string[];
}

// Tipo para dados de entrada ao criar/atualizar produto
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string };

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        query = query.limit(options.limit);
        console.log(`[useProducts] Limite adicionado: ${options.limit}`);
      }

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
        throw fetchError;
      }

      // Garantir que os dados não sejam nulos e fazer o mapeamento correto
      if (data && data.length > 0) {
        console.log(`[useProducts] ${data.length} produtos recebidos. Mapeando...`);
        const mappedData = data.map(p => {
          const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
          // Convert string tags to proper tag objects if needed
          const tags = Array.isArray(p.tags) ? p.tags.map((tag: any) => 
            typeof tag === 'string' ? { id: tag, name: tag } : tag
          ) : [];
          
          return {
            ...p,
            name: p.title || p.name || 'Produto sem título',
            title: p.title || p.name || 'Produto sem título',
            image: images[0] || '',
            images: images,
            tags: tags,
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
      setProducts([]);
      toast({ title: 'Erro', description: 'Não foi possível buscar os produtos.', variant: 'destructive' });
    } finally {
      console.log('[useProducts] Finalizando fetchProducts (finally). Loading set to false.');
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
      
      // Mapear 'title' para 'name' se necessário e tratar tags
      const mappedData = data ? { 
        ...data, 
        name: data.title, 
        image: data.images?.[0],
        tags: Array.isArray(data.tags) ? data.tags.map((tag: any) => 
          typeof tag === 'string' ? { id: tag, name: tag } : tag
        ) : []
      } : null;
      return mappedData;

    } catch (err: any) {
      console.error(`Error fetching product with ID ${id}:`, err);
      setError(`Falha ao carregar produto com ID ${id}.`);
      toast({ title: 'Erro', description: `Não foi possível buscar o produto ${id}.`, variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
        .select()
        .single();

      if (insertError) throw insertError;

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
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

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
    }
  }, [toast, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

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

  // Initial fetch with forced delay to ensure proper loading
  useEffect(() => {
    console.log('[useProducts] Iniciando efeito de carregamento inicial');
    
    // Forçar um pequeno delay para garantir que outros hooks tenham tempo de inicializar
    const timer = setTimeout(() => {
      console.log('[useProducts] Executando fetchProducts após delay');
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Retorna todas as funções, incluindo as CRUD
  return { products, loading, error, fetchProducts, fetchProductById, addProduct, updateProduct, deleteProduct };
};
