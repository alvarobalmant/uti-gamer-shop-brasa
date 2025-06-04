
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';

export const fetchProductsFromDatabase = async (): Promise<Product[]> => {
  console.log('Buscando produtos...');
  
  // Primeiro, vamos verificar se a sessão está válida
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Erro na sessão:', sessionError);
    // Se houver erro de JWT, vamos tentar renovar a sessão
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Erro ao renovar sessão:', refreshError);
    }
  }
  
  // Buscar todos os produtos - removendo filtros de autenticação se houver
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true) // Só produtos ativos
    .order('created_at', { ascending: false });

  if (productsError) {
    console.error('Erro ao buscar produtos:', productsError);
    throw productsError;
  }

  console.log('Produtos encontrados:', productsData?.length || 0);

  if (!productsData || productsData.length === 0) {
    console.log('Nenhum produto encontrado, usando array vazio');
    return [];
  }

  // Buscar as tags para cada produto usando a view otimizada
  const productsWithTags = await Promise.all(
    productsData.map(async (product) => {
      console.log('Buscando tags para produto:', product.name);
      
      try {
        const { data: productTagsData, error: tagsError } = await supabase
          .from('view_product_with_tags')
          .select('tag_id, tag_name')
          .eq('product_id', product.id);

        if (tagsError) {
          console.error('Erro ao buscar tags do produto:', product.name, tagsError);
          // Se houver erro nas tags, continuar sem elas
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
      } catch (error) {
        console.error('Erro inesperado ao buscar tags para:', product.name, error);
        return {
          ...product,
          tags: []
        };
      }
    })
  );

  console.log('Produtos com tags carregados:', productsWithTags.length);
  return productsWithTags;
};

export const addProductToDatabase = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
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

  return productResult;
};

export const updateProductInDatabase = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
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

  return data;
};

export const deleteProductFromDatabase = async (id: string) => {
  console.log('Deletando produto:', id);
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }

  console.log('Produto deletado com sucesso');
};
