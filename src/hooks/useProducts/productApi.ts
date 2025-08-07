import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { CarouselConfig } from '@/types/specialSections';
import { handleSupabaseRetry, invalidateSupabaseCache, startErrorMonitoring } from '@/utils/supabaseErrorHandler';

const mapRowToProduct = (row: any): Product => ({
  id: row.product_id,
  name: row.product_name || '',
  brand: row.brand || '',
  category: row.category || '',
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
  
  // Campos UTI PRO
  uti_pro_enabled: row.uti_pro_enabled || false,
  uti_pro_value: row.uti_pro_value ? Number(row.uti_pro_value) : undefined,
  uti_pro_custom_price: row.uti_pro_custom_price ? Number(row.uti_pro_custom_price) : undefined,
  uti_pro_type: row.uti_pro_type || 'percentage',
  
  // Campos do sistema de SKUs
  parent_product_id: row.parent_product_id || undefined,
  is_master_product: row.is_master_product || false,
  product_type: row.product_type || 'simple',
  sku_code: row.sku_code || undefined,
  variant_attributes: row.variant_attributes || {},
  sort_order: row.sort_order || 0,
  available_variants: row.available_variants || {},
  master_slug: row.master_slug || undefined,
  inherit_from_master: row.inherit_from_master || {},
  
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
  
  tags: [],
  created_at: row.created_at || new Date().toISOString(),
  updated_at: row.updated_at || new Date().toISOString()
});

export const fetchProductsFromDatabase = async (includeAdmin: boolean = false): Promise<Product[]> => {
  // Iniciar monitoramento de erros na primeira chamada
  if (typeof window !== 'undefined' && !(window as any).__errorMonitoringStarted) {
    startErrorMonitoring();
    (window as any).__errorMonitoringStarted = true;
  }

  return handleSupabaseRetry(async () => {
    console.log(`[fetchProductsFromDatabase] Fetching ALL products (includeAdmin: ${includeAdmin})`);
    
    let query = supabase
      .from('view_product_with_tags')
      .select('*');
    
    // REMOVE LIMIT: Don't filter anything - fetch ALL products including admin
    // Only exclude master products if specifically requested (not by default)
    if (!includeAdmin) {
      query = query.neq('product_type', 'master');
    }

    // NO PAGINATION - fetch ALL products at once
    const { data, error } = await query;

    if (error) {
      console.error('[fetchProductsFromDatabase] Database error:', error);
      // Se for o erro específico de coluna, invalidar cache e tentar fallback
      if (error.message?.includes('idasproduct_id') || error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.warn('🔧 Column error detected - invalidating cache and using fallback...');
        invalidateSupabaseCache();
        
        // Fallback: query products table directly
    try {
      console.log('[fetchProductsFromDatabase] Using enhanced fallback with tags...');
      
      // Fallback melhorado que inclui tags via JOIN
      const { data: fallbackData, error: fallbackError } = await supabase
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
        
      if (fallbackError) {
        // Se mesmo o fallback with JOIN falhar, usar query simples
        console.warn('[fetchProductsFromDatabase] JOIN fallback failed, using simple query...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('products')
          .select('*');
          
        if (simpleError) {
          throw simpleError;
        }
        
        console.log(`[fetchProductsFromDatabase] Simple fallback successful: ${simpleData?.length || 0} products`);
        return simpleData?.map(row => mapRowToProduct({
          product_id: row.id,
          product_name: row.name,
          product_description: row.description,
          product_price: row.price,
          product_image: row.image,
          product_stock: row.stock,
          ...row
        })) || [];
      }
      
      console.log(`[fetchProductsFromDatabase] Enhanced fallback successful: ${fallbackData?.length || 0} products`);
      
      // Processar dados com tags do fallback
      const productsMap = new Map<string, Product>();
      
      fallbackData?.forEach((row: any) => {
        const productId = row.id;
        
        if (!productsMap.has(productId)) {
          productsMap.set(productId, mapRowToProduct({
            product_id: row.id,
            product_name: row.name,
            product_description: row.description,
            product_price: row.price,
            product_image: row.image,
            product_stock: row.stock,
            ...row
          }));
        }
        
        // Adicionar tags do JOIN
        if (row.product_tags && row.product_tags.length > 0) {
          const product = productsMap.get(productId)!;
          row.product_tags.forEach((pt: any) => {
            if (pt.tags) {
              const tagExists = product.tags?.some(tag => tag.id === pt.tags.id);
              if (!tagExists) {
                product.tags = product.tags || [];
                product.tags.push({
                  id: pt.tags.id,
                  name: pt.tags.name
                });
              }
            }
          });
        }
      });
      
      return Array.from(productsMap.values());
    } catch (fallbackError) {
      console.error('[fetchProductsFromDatabase] All fallback attempts failed:', fallbackError);
      throw fallbackError;
    }
      }
      throw error;
    }

    // Agrupar produtos por ID para evitar duplicatas devido às tags
    const productsMap = new Map<string, Product>();
    
    data?.forEach((row: any) => {
      const productId = row.product_id;
      
      if (!productId) {
        console.warn('[fetchProductsFromDatabase] Row without product_id:', row);
        return;
      }
      
      if (!productsMap.has(productId)) {
        productsMap.set(productId, mapRowToProduct(row));
      }
      
      // Adicionar tag se existir e não for duplicata
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

    console.log(`[fetchProductsFromDatabase] Successfully loaded ${productsMap.size} unique products from ${data?.length || 0} rows`);
    return Array.from(productsMap.values());
  }, 'fetchProductsFromDatabase', 3);
};

export const fetchProductsByCriteria = async (config: CarouselConfig, includeAdmin: boolean = false): Promise<Product[]> => {
  try {
    let query = supabase.from('view_product_with_tags')
      .select('*');
    
    // Só filtrar produtos master se não for para admin
    if (!includeAdmin) {
      query = query.neq('product_type', 'master');
    }
    
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
      
      // Add tag if exists and not duplicate
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

    console.log(`[fetchProductsByCriteria] Carregados ${productsMap.size} produtos únicos por critério`);
    return Array.from(productsMap.values());
  } catch (error) {
    console.error('Error in fetchProductsByCriteria:', error);
    throw error;
  }
};

export const fetchSingleProductFromDatabase = async (id: string): Promise<Product | null> => {
  try {
    // Primeiro tentar buscar na view (para produtos normais)
    let { data, error } = await supabase
      .from('view_product_with_tags')
      .select('*')
      .eq('product_id', id);

    // Se não encontrar na view, buscar diretamente na tabela products (para produtos SKUs)
    if (!data || data.length === 0) {
      const { data: directData, error: directError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (directError) {
        console.error('Error fetching single product from products table:', directError);
        return null;
      }

      if (!directData) {
        return null;
      }

      // Mapear dados diretos da tabela products
      const product = mapRowToProduct({
        product_id: directData.id,
        product_name: directData.name,
        brand: directData.brand,
        category: directData.category,
        product_description: directData.description,
        product_price: directData.price,
        pro_price: directData.pro_price,
        list_price: directData.list_price,
        product_image: directData.image,
        additional_images: directData.additional_images,
        sizes: directData.sizes,
        colors: directData.colors,
        product_stock: directData.stock,
        badge_text: directData.badge_text,
        badge_color: directData.badge_color,
        badge_visible: directData.badge_visible,
        specifications: directData.specifications,
        technical_specs: directData.technical_specs,
        product_features: directData.product_features,
        shipping_weight: directData.shipping_weight,
        free_shipping: directData.free_shipping,
        meta_title: directData.meta_title,
        meta_description: directData.meta_description,
        slug: directData.slug,
        is_active: directData.is_active,
        is_featured: directData.is_featured,
        
        // Campos UTI PRO
        uti_pro_enabled: directData.uti_pro_enabled,
        uti_pro_value: directData.uti_pro_value,
        uti_pro_custom_price: directData.uti_pro_custom_price,
        uti_pro_type: directData.uti_pro_type,
        
        parent_product_id: directData.parent_product_id,
        is_master_product: directData.is_master_product,
        product_type: directData.product_type,
        sku_code: directData.sku_code,
        variant_attributes: directData.variant_attributes,
        sort_order: directData.sort_order,
        available_variants: directData.available_variants,
        master_slug: directData.master_slug,
        inherit_from_master: directData.inherit_from_master,
        product_videos: directData.product_videos,
        product_faqs: directData.product_faqs,
        product_highlights: directData.product_highlights,
        reviews_config: directData.reviews_config,
        trust_indicators: directData.trust_indicators,
        manual_related_products: directData.manual_related_products,
        breadcrumb_config: directData.breadcrumb_config,
        product_descriptions: directData.product_descriptions,
        delivery_config: directData.delivery_config,
        display_config: directData.display_config,
        created_at: directData.created_at,
        updated_at: directData.updated_at
      });

      return product;
    }

    if (error) {
      console.error('Error fetching single product:', error);
      throw error;
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

