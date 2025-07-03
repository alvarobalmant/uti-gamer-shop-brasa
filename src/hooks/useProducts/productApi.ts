import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { CarouselConfig } from '@/types/specialSections';

const mapRowToProduct = (row: any): Product => ({
  id: row.product_id,
  name: row.product_name || '',
  description: row.product_description || '',
  price: Number(row.product_price) || 0,
  pro_price: row.pro_price ? Number(row.pro_price) : undefined,
  list_price: row.list_price ? Number(row.list_price) : undefined,
  image: row.product_image || '',
  additional_images: row.additional_images || [],
  sizes: row.sizes || [],
  colors: row.colors || [],
  stock: row.product_stock || 0,
  badge_text: row.badge_text || '',
  badge_color: row.badge_color || '#22c55e',
  badge_visible: row.badge_visible || false,
  specifications: row.specifications || [],
  technical_specs: row.technical_specs || {},
  product_features: row.product_features || {},
  shipping_weight: row.shipping_weight ? Number(row.shipping_weight) : undefined,
  free_shipping: row.free_shipping || false,
  meta_title: row.meta_title || '',
  meta_description: row.meta_description || '',
  slug: row.slug || '',
  is_active: row.is_active !== false,
  is_featured: row.is_featured || false,
  
  // Novos campos expandidos
  product_videos: row.product_videos || [],
  product_faqs: row.product_faqs || [],
  product_highlights: row.product_highlights || [],
  reviews_config: row.reviews_config || {
    enabled: true,
    show_rating: true,
    show_count: true,
    allow_reviews: true,
    custom_rating: { value: 0, count: 0, use_custom: false }
  },
  trust_indicators: row.trust_indicators || [],
  manual_related_products: row.manual_related_products || [],
  breadcrumb_config: row.breadcrumb_config || {
    custom_path: [],
    use_custom: false,
    show_breadcrumb: true
  },
  product_descriptions: row.product_descriptions || {
    short: '',
    detailed: '',
    technical: '',
    marketing: ''
  },
  delivery_config: row.delivery_config || {
    custom_shipping_time: '',
    shipping_regions: [],
    express_available: false,
    pickup_locations: [],
    shipping_notes: ''
  },
  display_config: row.display_config || {
    show_stock_counter: true,
    show_view_counter: false,
    custom_view_count: 0,
    show_urgency_banner: false,
    urgency_text: '',
    show_social_proof: false,
    social_proof_text: ''
  },
  
  // Sistema de SKUs
  parent_product_id: row.parent_product_id || undefined,
  is_master_product: row.is_master_product || false,
  product_type: row.product_type || 'simple',
  sku_code: row.sku_code || undefined,
  variant_attributes: row.variant_attributes || {},
  sort_order: row.sort_order || 0,
  available_variants: row.available_variants || [],
  master_slug: row.master_slug || undefined,
  inherit_from_master: row.inherit_from_master || {},
  
  tags: [],
  created_at: row.created_at || new Date().toISOString(),
  updated_at: row.updated_at || new Date().toISOString()
});

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
        productsMap.set(productId, mapRowToProduct(row));
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
        productsMap.set(productId, mapRowToProduct(row));
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

export const fetchSingleProductFromDatabase = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('view_product_with_tags')
      .select('*')
      .eq('product_id', id);

    if (error) {
      console.error('Error fetching single product:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Use the first row to create the product
    const product = mapRowToProduct(data[0]);
    
    // Add all tags for this product
    data.forEach((row: any) => {
      if (row.tag_id && row.tag_name) {
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

    return product;
  } catch (error) {
    console.error('Error in fetchSingleProductFromDatabase:', error);
    throw error;
  }
};

export const addProductToDatabase = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
  try {
    const { tagIds, ...productInfo } = productData;
    
    // Preparar dados do produto incluindo todos os novos campos
    const productToInsert = {
      ...productInfo,
      // Garantir que os novos campos JSONB sejam sempre incluídos
      product_videos: productInfo.product_videos || [],
      product_faqs: productInfo.product_faqs || [],
      product_highlights: productInfo.product_highlights || [],
      reviews_config: productInfo.reviews_config || {
        enabled: true,
        show_rating: true,
        show_count: true,
        allow_reviews: true,
        custom_rating: { value: 0, count: 0, use_custom: false }
      },
      trust_indicators: productInfo.trust_indicators || [],
      manual_related_products: productInfo.manual_related_products || [],
      breadcrumb_config: productInfo.breadcrumb_config || {
        custom_path: [],
        use_custom: false,
        show_breadcrumb: true
      },
      product_descriptions: productInfo.product_descriptions || {
        short: '',
        detailed: '',
        technical: '',
        marketing: ''
      },
      delivery_config: productInfo.delivery_config || {
        custom_shipping_time: '',
        shipping_regions: [],
        express_available: false,
        pickup_locations: [],
        shipping_notes: ''
      },
      display_config: productInfo.display_config || {
        show_stock_counter: true,
        show_view_counter: false,
        custom_view_count: 0,
        show_urgency_banner: false,
        urgency_text: '',
        show_social_proof: false,
        social_proof_text: ''
      }
    };
    
    console.log('[addProductToDatabase] Dados sendo enviados:', productToInsert);
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productToInsert])
      .select()
      .single();

    if (productError) {
      console.error('[addProductToDatabase] Erro ao inserir produto:', productError);
      throw productError;
    }

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

    console.log('[addProductToDatabase] Produto criado com sucesso:', product);
    return mapRowToProduct(product);
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProductInDatabase = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
  try {
    const { tagIds, tags, ...productUpdates } = updates;
    
    // Preparar dados de atualização incluindo todos os novos campos
    const updateData = {
      ...productUpdates,
      // Garantir que os novos campos JSONB sejam sempre incluídos
      product_videos: productUpdates.product_videos || [],
      product_faqs: productUpdates.product_faqs || [],
      product_highlights: productUpdates.product_highlights || [],
      reviews_config: productUpdates.reviews_config || {
        enabled: true,
        show_rating: true,
        show_count: true,
        allow_reviews: true,
        custom_rating: { value: 0, count: 0, use_custom: false }
      },
      trust_indicators: productUpdates.trust_indicators || [],
      manual_related_products: productUpdates.manual_related_products || [],
      breadcrumb_config: productUpdates.breadcrumb_config || {
        custom_path: [],
        use_custom: false,
        show_breadcrumb: true
      },
      product_descriptions: productUpdates.product_descriptions || {
        short: '',
        detailed: '',
        technical: '',
        marketing: ''
      },
      delivery_config: productUpdates.delivery_config || {
        custom_shipping_time: '',
        shipping_regions: [],
        express_available: false,
        pickup_locations: [],
        shipping_notes: ''
      },
      display_config: productUpdates.display_config || {
        show_stock_counter: true,
        show_view_counter: false,
        custom_view_count: 0,
        show_urgency_banner: false,
        urgency_text: '',
        show_social_proof: false,
        social_proof_text: ''
      }
    };
    
    console.log('[updateProductInDatabase] Dados sendo enviados:', updateData);
    
    // Atualizar produto
    const { data: updatedProduct, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (productError) {
      console.error('[updateProductInDatabase] Erro ao atualizar produto:', productError);
      throw productError;
    }

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

    console.log('[updateProductInDatabase] Produto atualizado com sucesso:', updatedProduct);
    return mapRowToProduct(updatedProduct);
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

