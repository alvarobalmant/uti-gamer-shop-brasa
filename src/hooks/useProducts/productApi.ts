import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { CarouselConfig } from '@/types/specialSections';

export const fetchProductsFromDatabase = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('view_product_with_tags')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Agrupar produtos por ID para evitar duplicatas devido às tags
    const productsMap = new Map<string, Product>();
    
    data?.forEach((row: any) => {
      const productId = row.product_id;
      
      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          id: productId,
          name: row.product_name || '',
          description: row.product_description || '',
          price: Number(row.product_price) || 0,
          image: row.product_image || '',
          stock: row.product_stock || 0,
          badge_text: row.badge_text || undefined,
          badge_color: row.badge_color || undefined,
          badge_visible: row.badge_visible || false,
          tags: []
        });
      }
      
      // Adicionar tag se existir
      if (row.tag_id && row.tag_name) {
        const product = productsMap.get(productId)!;
        const tagExists = product.tags?.some(tag => tag.id === row.tag_id);
        
        if (!tagExists) {
          product.tags = product.tags || [];
          product.tags.push({
            id: row.tag_id,
            name: row.tag_name
          });
        }
      }
    });

    return Array.from(productsMap.values());
  } catch (error) {
    console.error('Error in fetchProductsFromDatabase:', error);
    throw error;
  }
};

export const fetchProductsByCriteria = async (config: CarouselConfig): Promise<Product[]> => {
  try {
    let query = supabase.from('view_product_with_tags').select('*');
    
    // Filter by product IDs if specified
    if (config.product_ids && config.product_ids.length > 0) {
      query = query.in('product_id', config.product_ids);
    }
    
    // Filter by tag IDs if specified
    if (config.tag_ids && config.tag_ids.length > 0) {
      query = query.in('tag_id', config.tag_ids);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products by criteria:', error);
      throw error;
    }

    // Group products by ID to avoid duplicates due to tags
    const productsMap = new Map<string, Product>();
    
    data?.forEach((row: any) => {
      const productId = row.product_id;
      
      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          id: productId,
          name: row.product_name || '',
          description: row.product_description || '',
          price: Number(row.product_price) || 0,
          image: row.product_image || '',
          stock: row.product_stock || 0,
          badge_text: row.badge_text || undefined,
          badge_color: row.badge_color || undefined,
          badge_visible: row.badge_visible || false,
          tags: []
        });
      }
      
      // Add tag if exists
      if (row.tag_id && row.tag_name) {
        const product = productsMap.get(productId)!;
        const tagExists = product.tags?.some(tag => tag.id === row.tag_id);
        
        if (!tagExists) {
          product.tags = product.tags || [];
          product.tags.push({
            id: row.tag_id,
            name: row.tag_name
          });
        }
      }
    });

    return Array.from(productsMap.values());
  } catch (error) {
    console.error('Error in fetchProductsByCriteria:', error);
    throw error;
  }
};

export const addProductToDatabase = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
  try {
    const { tagIds, ...productInfo } = productData;
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productInfo])
      .select()
      .single();

    if (productError) throw productError;

    // Adicionar tags se fornecidas
    if (tagIds && tagIds.length > 0) {
      const tagInserts = tagIds.map(tagId => ({
        product_id: product.id,
        tag_id: tagId
      }));

      const { error: tagError } = await supabase
        .from('product_tags')
        .insert(tagInserts);

      if (tagError) throw tagError;
    }

    return product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProductInDatabase = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
  try {
    const { tagIds, tags, ...productUpdates } = updates;
    
    // Atualizar produto
    const { error: productError } = await supabase
      .from('products')
      .update(productUpdates)
      .eq('id', id);

    if (productError) throw productError;

    // Atualizar tags se fornecidas
    if (tagIds !== undefined) {
      // Remover tags existentes
      const { error: deleteError } = await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', id);

      if (deleteError) throw deleteError;

      // Adicionar novas tags
      if (tagIds.length > 0) {
        const tagInserts = tagIds.map(tagId => ({
          product_id: id,
          tag_id: tagId
        }));

        const { error: insertError } = await supabase
          .from('product_tags')
          .insert(tagInserts);

        if (insertError) throw insertError;
      }
    }

    return { id, ...productUpdates };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductFromDatabase = async (id: string) => {
  try {
    // Primeiro, remover as associações de tags
    const { error: tagError } = await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', id);

    if (tagError) throw tagError;

    // Depois, remover o produto
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (productError) throw productError;

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
