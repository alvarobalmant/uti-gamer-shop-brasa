<<<<<<< HEAD

=======
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
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

    // Group products by ID to avoid duplicates due to tags
    const productsMap = new Map<string, Product>();
    
    data?.forEach((row: any) => {
      const productId = row.product_id;
      
      if (!productsMap.has(productId)) {
        // Parse specifications if it exists
        let specifications;
        try {
          specifications = row.product_specifications ? JSON.parse(row.product_specifications) : undefined;
        } catch (e) {
          console.warn('Failed to parse specifications for product', productId, e);
          specifications = undefined;
        }

        productsMap.set(productId, {
          id: productId,
          name: row.product_name || '',
          description: row.product_description || '',
          price: Number(row.product_price) || 0,
          image: row.product_image || '',
          images: row.product_images || [], // New images field
          stock: row.product_stock || 0,
          badge_text: row.badge_text || '',
          badge_color: row.badge_color || '#22c55e',
          badge_visible: row.badge_visible || false,
<<<<<<< HEAD
          specifications: row.product_specifications || [],
          images: row.product_images || [],
=======
          specifications: specifications, // New specifications field
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
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
        // Parse specifications if it exists
        let specifications;
        try {
          specifications = row.product_specifications ? JSON.parse(row.product_specifications) : undefined;
        } catch (e) {
          console.warn('Failed to parse specifications for product', productId, e);
          specifications = undefined;
        }

        productsMap.set(productId, {
          id: productId,
          name: row.product_name || '',
          description: row.product_description || '',
          price: Number(row.product_price) || 0,
          image: row.product_image || '',
          images: row.product_images || [], // New images field
          stock: row.product_stock || 0,
          badge_text: row.badge_text || '',
          badge_color: row.badge_color || '#22c55e',
          badge_visible: row.badge_visible || false,
<<<<<<< HEAD
          specifications: row.product_specifications || [],
          images: row.product_images || [],
=======
          specifications: specifications, // New specifications field
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
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
    const { tagIds, specifications, images, ...productInfo } = productData;
    
    // Prepare the product data for insertion
    const insertData = {
      ...productInfo,
      specifications: specifications ? JSON.stringify(specifications) : null,
      images: images || []
    };
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([insertData])
      .select()
      .single();

    if (productError) throw productError;

    // Add tags if provided
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
    const { tagIds, tags, specifications, images, ...productUpdates } = updates;
    
    // Prepare the update data
    const updateData = {
      ...productUpdates,
      specifications: specifications ? JSON.stringify(specifications) : undefined,
      images: images
    };
    
    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (productError) throw productError;

    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      const { error: deleteError } = await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', id);

      if (deleteError) throw deleteError;

      // Add new tags
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
    // First, remove tag associations
    const { error: tagError } = await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', id);

    if (tagError) throw tagError;

    // Then, remove the product
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
