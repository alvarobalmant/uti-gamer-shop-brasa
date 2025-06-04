
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

<<<<<<< HEAD
// Interface para Tags (assumindo que existe uma tabela 'tags' com id e name)
export interface ProductTag {
  id: string; // ou number, dependendo do schema
  name: string;
}

// Interface Product atualizada para refletir o schema e erros
export interface Product {
  id: string;
  title: string; // Campo principal
  description: string;
  price: number;
  discount_price?: number; // Preço com desconto padrão
  images: string[]; // Array de URLs de imagem
  category: string; // ID ou nome da categoria
  platform?: string; // ID ou nome da plataforma
=======
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
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  condition?: 'new' | 'used' | 'refurbished';
  stock: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
<<<<<<< HEAD
  tags?: ProductTag[]; // Usar a interface ProductTag
=======
  tags?: ProductTag[]; // Changed to ProductTag[]
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  rating?: number;
  // Campos relacionados a UTI PRO (precisam existir na tabela 'products')
  pro_discount_percent?: number; // Percentual de desconto PRO
  pro_price?: number; // Preço calculado para PRO (pode ser calculado no frontend ou backend)
  // Campos que parecem ser de versões anteriores ou nomes diferentes
  list_price?: number; // Pode ser o mesmo que 'price'? Verificar schema.
  new_price?: number; // Pode ser o mesmo que 'price' ou 'discount_price'? Verificar.
  digital_price?: number; // Preço para versão digital?
  // Campos adicionais para formulário/admin
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  // Campos opcionais que podem ter sido usados antes
  name?: string; // Manter opcional, mas priorizar 'title'
  image?: string; // Manter opcional, mas priorizar 'images[0]'
}

// Tipo para dados de entrada ao criar/atualizar produto
// Omitir campos gerados e ajustar conforme a necessidade do insert/update
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'pro_price' | 'tags'> & {
  id?: string;
  tags?: string[]; // Para input, podemos aceitar IDs ou nomes de tags como strings
};

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
    tag?: string; // Adicionar filtro por tag
  }) => {
    console.log(`[useProducts] Iniciando busca de produtos com opções: ${JSON.stringify(options)}`);
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      // Incluir busca de tags relacionadas
      let query = supabase.from('products').select('*'); // TESTE: Simplificado para depuração
      console.log('[useProducts] Query base criada: supabase.from("products").select("*, tags(*)")');
=======
      console.log(`[useProducts] Iniciando busca de produtos com opções: ${JSON.stringify(options)}`);
      
      let query = supabase.from('products').select('*');
      console.log('[useProducts] Query base criada: supabase.from("products").select("*")');
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df

      // Aplicar filtros
      if (options?.category) query = query.eq('category', options.category);
      if (options?.platform) query = query.eq('platform', options.platform);
      if (options?.condition) query = query.eq('condition', options.condition);
      if (options?.featured !== undefined) query = query.eq('is_featured', options.featured);
      if (options?.search) query = query.ilike('title', `%${options.search}%`);
      // Filtro por tag (assumindo que 'tags' é uma tabela relacionada e queremos produtos que TENHAM a tag)
      // Esta forma de filtrar por relação pode precisar de ajuste dependendo da estrutura exata
      // Uma abordagem mais simples seria buscar todos e filtrar no frontend, ou usar uma função RPC no Supabase
      // if (options?.tag) query = query.contains('tags', [{ name: options.tag }]); // Exemplo, pode não funcionar diretamente

      // Ordenação e Limite
      if (options?.sortBy) query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
      if (options?.limit) query = query.limit(options.limit);

      console.log('[useProducts] Executando query Supabase...');
      const { data, error: fetchError } = await query;
      console.log('[useProducts] Query Supabase concluída.');
      console.log('[useProducts] Resposta RAW da busca de produtos:', { data, fetchError, count: data?.length || 0 });

<<<<<<< HEAD
      if (fetchError) throw fetchError;
=======
      if (fetchError) {
        console.error('[useProducts] Erro DETALHADO retornado pelo Supabase:', fetchError);
        throw fetchError;
      }
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df

      if (data && data.length > 0) {
        console.log(`[useProducts] ${data.length} produtos recebidos. Mapeando...`);
        const mappedData = data.map(p => {
          const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
<<<<<<< HEAD
          // Calcular pro_price se necessário e pro_discount_percent existir
          let calculatedProPrice = p.pro_price;
          if (p.pro_discount_percent && typeof p.price === 'number') {
            calculatedProPrice = p.price * (1 - p.pro_discount_percent / 100);
          }

=======
          // Convert string tags to proper tag objects if needed
          const tags = Array.isArray(p.tags) ? p.tags.map((tag: any) => 
            typeof tag === 'string' ? { id: tag, name: tag } : tag
          ) : [];
          
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
          return {
            ...p,
            title: p.title || p.name || 'Produto sem título',
            name: p.title || p.name || 'Produto sem título', // Manter name sincronizado com title
            image: images[0] || '', // Usar a primeira imagem como 'image' principal
            images: images,
            tags: tags,
            description: p.description || '',
            price: typeof p.price === 'number' ? p.price : 0,
            stock: typeof p.stock === 'number' ? p.stock : 0,
            category: p.category || 'Sem categoria',
            tags: Array.isArray(p.tags) ? p.tags : [], // Garantir que tags seja um array
            pro_price: calculatedProPrice, // Usar preço calculado se disponível
            // Mapear outros campos garantindo tipos corretos
            discount_price: p.discount_price,
            platform: p.platform,
            condition: p.condition,
            is_featured: p.is_featured,
            is_active: p.is_active,
            rating: p.rating,
            pro_discount_percent: p.pro_discount_percent,
            list_price: p.list_price ?? p.price, // Usar price como fallback para list_price
            new_price: p.new_price ?? p.discount_price ?? p.price, // Tentar discount_price ou price como fallback
            digital_price: p.digital_price,
            additional_images: p.additional_images,
            sizes: p.sizes,
            colors: p.colors,
          } as Product; // Forçar o tipo após mapeamento
        });
        console.log('[useProducts] Dados mapeados e normalizados:', mappedData.length);
        setProducts(mappedData);
      } else {
        console.log('[useProducts] Nenhum produto encontrado ou array vazio retornado pelo Supabase.');
        setProducts([]);
      }

    } catch (err: any) {
      console.error('[useProducts] Erro GERAL no bloco catch ao buscar produtos:', err);
<<<<<<< HEAD
=======
      if (err && err.message) {
        console.error('[useProducts] Mensagem de erro:', err.message);
      }
      if (err && err.details) {
        console.error('[useProducts] Detalhes do erro:', err.details);
      }
      if (err && err.hint) {
        console.error('[useProducts] Hint do erro:', err.hint);
      }
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
      setError('Falha ao carregar produtos.');
      setProducts([]);
      toast({ title: 'Erro', description: 'Não foi possível buscar os produtos.', variant: 'destructive' });
    } finally {
      console.log('[useProducts] Finalizando fetchProducts (finally). Loading set to false.');
      setLoading(false);
    }
  }, [toast]);

  const fetchProductById = useCallback(async (id: string): Promise<Product | null> => {
    console.log(`[useProducts] Buscando produto por ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, tags(*)') // Incluir tags
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
<<<<<<< HEAD
      if (!data) return null;

      // Mapear dados como em fetchProducts
      const images = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []);
      let calculatedProPrice = data.pro_price;
      if (data.pro_discount_percent && typeof data.price === 'number') {
        calculatedProPrice = data.price * (1 - data.pro_discount_percent / 100);
      }

      const mappedData: Product = {
        ...data,
        title: data.title || data.name || 'Produto sem título',
        name: data.title || data.name || 'Produto sem título',
        image: images[0] || '',
        images: images,
        description: data.description || '',
        price: typeof data.price === 'number' ? data.price : 0,
        stock: typeof data.stock === 'number' ? data.stock : 0,
        category: data.category || 'Sem categoria',
        tags: Array.isArray(data.tags) ? data.tags : [],
        pro_price: calculatedProPrice,
        discount_price: data.discount_price,
        platform: data.platform,
        condition: data.condition,
        is_featured: data.is_featured,
        is_active: data.is_active,
        rating: data.rating,
        pro_discount_percent: data.pro_discount_percent,
        list_price: data.list_price ?? data.price,
        new_price: data.new_price ?? data.discount_price ?? data.price,
        digital_price: data.digital_price,
        additional_images: data.additional_images,
        sizes: data.sizes,
        colors: data.colors,
      };
      console.log(`[useProducts] Produto ID ${id} encontrado e mapeado.`);
=======
      
      // Mapear 'title' para 'name' se necessário e tratar tags
      const mappedData = data ? { 
        ...data, 
        name: data.title, 
        image: data.images?.[0],
        tags: Array.isArray(data.tags) ? data.tags.map((tag: any) => 
          typeof tag === 'string' ? { id: tag, name: tag } : tag
        ) : []
      } : null;
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
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

  // --- Funções CRUD --- 
  // (Manter as funções add, update, delete como estavam, mas garantir que usem a interface ProductInput e tratem 'tags' se necessário)
  // Exemplo: A função addProduct/updateProduct pode precisar converter o array de IDs/nomes de tags do input para o formato esperado pelo Supabase (ex: many-to-many relation)

  const addProduct = useCallback(async (productData: ProductInput) => {
    console.log('[useProducts] Adicionando produto:', productData);
    setLoading(true);
    setError(null);
    try {
      // Separar tags se forem relacionais
      const { tags, ...restData } = productData;
      const payload: Omit<ProductInput, 'tags'> = { ...restData };

      // Limpar campos opcionais vazios antes de enviar
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined || payload[key as keyof typeof payload] === null || payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload];
        }
      });

      // 1. Inserir o produto principal
      const { data: insertedProduct, error: insertError } = await supabase
        .from('products')
        .insert(payload as any)
        .select()
        .single();

      if (insertError) throw insertError;
      if (!insertedProduct) throw new Error('Falha ao retornar dados do produto inserido.');

      console.log('[useProducts] Produto base inserido:', insertedProduct.id);

      // 2. Lidar com tags (se for uma relação many-to-many)
      // Isso assume uma tabela de junção como 'product_tags' com 'product_id' e 'tag_id'
      if (tags && tags.length > 0) {
        console.log('[useProducts] Associando tags:', tags);
        // Aqui você precisaria buscar os IDs das tags se o input for nomes, ou usar os IDs diretamente
        // Exemplo simplificado assumindo que 'tags' no input são IDs:
        const tagRelations = tags.map(tagId => ({ product_id: insertedProduct.id, tag_id: tagId }));
        const { error: tagError } = await supabase.from('product_tags').insert(tagRelations);
        if (tagError) {
          console.warn('[useProducts] Erro ao associar tags:', tagError);
          // Não lançar erro fatal, mas avisar
          toast({ title: 'Aviso', description: 'Produto criado, mas houve um erro ao associar tags.', variant: 'default' });
        } else {
          console.log('[useProducts] Tags associadas com sucesso.');
        }
      }

      await fetchProducts();
      toast({ title: 'Sucesso', description: 'Produto adicionado com sucesso.' });
      return insertedProduct;

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
    console.log(`[useProducts] Atualizando produto ID: ${id}`, productData);
    setLoading(true);
    setError(null);
    try {
      const { tags, id: inputId, ...restData } = productData;
      const payload: Omit<ProductInput, 'tags' | 'id'> = { ...restData };

      // Limpar campos opcionais vazios
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined || payload[key as keyof typeof payload] === null) {
           delete payload[key as keyof typeof payload];
        }
      });

      // 1. Atualizar produto principal
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update(payload as any)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!updatedProduct) throw new Error('Falha ao retornar dados do produto atualizado.');

      console.log('[useProducts] Produto base atualizado:', updatedProduct.id);

      // 2. Lidar com tags (exemplo: remover todas as antigas e adicionar as novas)
      if (tags !== undefined) { // Permitir atualizar tags mesmo se for um array vazio
        console.log('[useProducts] Atualizando associações de tags:', tags);
        // Remover associações antigas
        const { error: deleteTagsError } = await supabase.from('product_tags').delete().eq('product_id', id);
        if (deleteTagsError) console.warn('[useProducts] Erro ao remover tags antigas:', deleteTagsError);

        // Adicionar novas associações
        if (tags.length > 0) {
          const tagRelations = tags.map(tagId => ({ product_id: id, tag_id: tagId }));
          const { error: tagError } = await supabase.from('product_tags').insert(tagRelations);
          if (tagError) {
            console.warn('[useProducts] Erro ao associar novas tags:', tagError);
            toast({ title: 'Aviso', description: 'Produto atualizado, mas houve um erro ao atualizar tags.', variant: 'default' });
          } else {
            console.log('[useProducts] Tags atualizadas com sucesso.');
          }
        }
      }

      await fetchProducts();
      toast({ title: 'Sucesso', description: 'Produto atualizado com sucesso.' });
      return updatedProduct;

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
    console.log(`[useProducts] Deletando produto ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      // Considerar deletar relações (ex: product_tags) primeiro se houver constraints
      const { error: deleteTagsError } = await supabase.from('product_tags').delete().eq('product_id', id);
      if (deleteTagsError) console.warn('[useProducts] Erro ao deletar associações de tags:', deleteTagsError);

      // Deletar o produto
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

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

  // Initial fetch
  useEffect(() => {
    console.log('[useProducts] useEffect inicial: Chamando fetchProducts()');
    fetchProducts();
  }, [fetchProducts]);

<<<<<<< HEAD
=======
  // Retorna todas as funções, incluindo as CRUD
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  return { products, loading, error, fetchProducts, fetchProductById, addProduct, updateProduct, deleteProduct };
};
