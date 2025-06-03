import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  tags?: Array<{ id: string; name: string }>; // Estrutura corrigida para tags
  rating?: number;
  pro_discount?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  list_price?: number;
  // Campos adicionados para compatibilidade com Admin/Form
  additional_images?: string[]; 
  sizes?: string[];
  colors?: string[];
}

// Tipo para dados de entrada ao criar/atualizar produto
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string };

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]); // Inicializa vazio, busca no useEffect
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
    console.log(`[useProducts] 🚀 Iniciando busca de produtos com opções:`, options);
    setLoading(true);
    setError(null);
    
    try {
      console.log('[useProducts] 📡 Criando query base para produtos...');
      let query = supabase.from('products').select(`
        *,
        product_tags!inner(
          tag_id,
          tags!inner(
            id,
            name
          )
        )
      `);
      
      console.log('[useProducts] ✅ Query base criada com join para tags');

      // Apply filters based on options
      if (options?.category) {
        query = query.eq('category', options.category);
        console.log(`[useProducts] 🔍 Filtro adicionado: category = ${options.category}`);
      }
      if (options?.platform) {
        query = query.eq('platform', options.platform);
        console.log(`[useProducts] 🔍 Filtro adicionado: platform = ${options.platform}`);
      }
      if (options?.condition) {
        query = query.eq('condition', options.condition);
        console.log(`[useProducts] 🔍 Filtro adicionado: condition = ${options.condition}`);
      }
      if (options?.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
        console.log(`[useProducts] 🔍 Filtro adicionado: is_featured = ${options.featured}`);
      }
      if (options?.search) {
        query = query.ilike('name', `%${options.search}%`); 
        console.log(`[useProducts] 🔍 Filtro adicionado: name ilike %${options.search}%`);
      }
      if (options?.sortBy) {
        query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
        console.log(`[useProducts] 📊 Ordenação adicionada: ${options.sortBy} ${options.sortOrder}`);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
        console.log(`[useProducts] 📏 Limite adicionado: ${options.limit}`);
      }

      console.log('[useProducts] 🔄 Executando query Supabase...');
      const { data, error: fetchError } = await query;
      
      // Log raw response immediately
      console.log('[useProducts] 📦 Resposta RAW da busca de produtos:', { 
        data: data, 
        error: fetchError,
        count: data?.length || 0
      });

      if (fetchError) {
        console.error('[useProducts] ❌ Erro DETALHADO retornado pelo Supabase:', fetchError);
        throw fetchError;
      }

      // Garantir que os dados não sejam nulos e fazer o mapeamento correto
      if (data && data.length > 0) {
        console.log(`[useProducts] 🎯 ${data.length} produtos recebidos. Processando...`);
        
        const mappedData = data.map(p => {
          // Processar imagens
          const images = Array.isArray(p.additional_images) && p.additional_images.length > 0 
            ? p.additional_images 
            : (p.image ? [p.image] : []);
          
          // Processar tags
          const tags = Array.isArray(p.product_tags) 
            ? p.product_tags.map((pt: any) => ({
                id: pt.tags?.id || pt.tag_id,
                name: pt.tags?.name || 'Tag sem nome'
              }))
            : [];

          // Calcular preço pro (exemplo: 10% de desconto)
          const proDiscountPercent = p.pro_discount_percent || 0.10;
          const proPrice = p.price * (1 - proDiscountPercent);

          return {
            ...p,
            // Manter compatibilidade com ambos os campos
            name: p.name || p.title || 'Produto sem nome',
            title: p.title || p.name || 'Produto sem título',
            // Processar imagens
            image: images[0] || '',
            images: images,
            additional_images: images,
            // Garantir campos obrigatórios
            description: p.description || '',
            price: typeof p.price === 'number' ? p.price : 0,
            stock: typeof p.stock === 'number' ? p.stock : 0,
            category: p.category || 'Sem categoria',
            // Processar tags
            tags: tags,
            // Calcular preços especiais
            pro_price: proPrice,
            pro_discount_percent: proDiscountPercent,
            list_price: p.list_price || p.price * 1.2 // Preço de lista simulado se não existir
          };
        });
        
        console.log('[useProducts] ✅ Dados mapeados e normalizados:', mappedData.length, 'produtos');
        console.log('[useProducts] 🏷️ Exemplo de produto processado:', mappedData[0]);
        setProducts(mappedData);
      } else {
        console.log('[useProducts] ⚠️ Nenhum produto encontrado ou array vazio retornado.');
        setProducts([]);
      }

    } catch (err: any) {
      console.error('[useProducts] 💥 Erro GERAL no bloco catch:', err);
      
      // Log more specific details
      if (err?.message) console.error('[useProducts] 📝 Mensagem:', err.message);
      if (err?.details) console.error('[useProducts] 🔍 Detalhes:', err.details);
      if (err?.hint) console.error('[useProducts] 💡 Hint:', err.hint);
      if (err?.code) console.error('[useProducts] 🔢 Código:', err.code);
      
      setError('Falha ao carregar produtos.');
      setProducts([]); // Limpa produtos em caso de erro
      
      toast({ 
        title: 'Erro ao carregar produtos', 
        description: err.message || 'Não foi possível buscar os produtos.', 
        variant: 'destructive' 
      });
    } finally {
      console.log('[useProducts] 🏁 Finalizando fetchProducts. Loading = false');
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
      
      // Mapear 'title' para 'name' se necessário
      const mappedData = data ? { ...data, name: data.title, image: data.images?.[0] } : null;
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
  // --- Fim Funções CRUD Restauradas ---

  // Initial fetch with forced delay to ensure proper loading
  useEffect(() => {
    console.log('[useProducts] 🎬 Iniciando efeito de carregamento inicial');
    
    const timer = setTimeout(() => {
      console.log('[useProducts] ⏰ Executando fetchProducts após delay');
      fetchProducts();
    }, 100); // Reduced delay since RLS policies are now in place
    
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Retorna todas as funções, incluindo as CRUD
  return { products, loading, error, fetchProducts, fetchProductById, addProduct, updateProduct, deleteProduct };
};
