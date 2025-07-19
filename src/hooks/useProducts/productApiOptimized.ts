import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { CarouselConfig } from '@/types/specialSections';

// Versão simplificada do produto para listagens
export interface ProductLight {
  id: string;
  name: string;
  price: number;
  pro_price?: number;
  list_price?: number;
  image: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  uti_pro_enabled: boolean;
  uti_pro_value?: number;
  uti_pro_custom_price?: number;
  uti_pro_type: string;
}

// Cache simples em memória
const productCache = new Map<string, { data: Product[], timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const mapRowToProductLight = (row: any): ProductLight => ({
  id: row.product_id,
  name: row.product_name || '',
  price: Number(row.product_price) || 0,
  pro_price: row.pro_price ? Number(row.pro_price) : undefined,
  list_price: row.list_price ? Number(row.list_price) : undefined,
  image: row.product_image || '',
  badge_text: row.badge_text || '',
  badge_color: row.badge_color || '#22c55e',
  badge_visible: row.badge_visible || false,
  slug: row.slug || '',
  is_active: row.is_active !== false,
  is_featured: row.is_featured || false,
  uti_pro_enabled: row.uti_pro_enabled || false,
  uti_pro_value: row.uti_pro_value ? Number(row.uti_pro_value) : undefined,
  uti_pro_custom_price: row.uti_pro_custom_price ? Number(row.uti_pro_custom_price) : undefined,
  uti_pro_type: row.uti_pro_type || 'percentage',
});

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

// Função otimizada para carregar produtos com paginação
export const fetchProductsLightPaginated = async (
  page: number = 0, 
  limit: number = 20
): Promise<{ products: ProductLight[], hasMore: boolean, total: number }> => {
  try {
    const offset = page * limit;
    
    // Consulta otimizada com apenas campos essenciais
    const { data, error, count } = await supabase
      .from('products')
      .select(`
        product_id,
        product_name,
        product_price,
        pro_price,
        list_price,
        product_image,
        badge_text,
        badge_color,
        badge_visible,
        slug,
        is_active,
        is_featured,
        uti_pro_enabled,
        uti_pro_value,
        uti_pro_custom_price,
        uti_pro_type
      `, { count: 'exact' })
      .eq('is_active', true)
      .neq('product_type', 'master')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products light:', error);
      throw error;
    }

    const products = data?.map(mapRowToProductLight) || [];
    const total = count || 0;
    const hasMore = offset + limit < total;

    console.log(`[fetchProductsLightPaginated] Página ${page}: ${products.length} produtos, total: ${total}`);
    
    return { products, hasMore, total };
  } catch (error) {
    console.error('Error in fetchProductsLightPaginated:', error);
    throw error;
  }
};

// Função para carregar detalhes completos de um produto específico
export const fetchProductDetails = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('view_product_with_tags')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return mapRowToProduct(data);
  } catch (error) {
    console.error('Error in fetchProductDetails:', error);
    return null;
  }
};

// Função otimizada para seções específicas (carrosséis)
export const fetchProductsByCriteriaOptimized = async (
  config: CarouselConfig,
  limit: number = 12
): Promise<ProductLight[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        product_id,
        product_name,
        product_price,
        pro_price,
        list_price,
        product_image,
        badge_text,
        badge_color,
        badge_visible,
        slug,
        is_active,
        is_featured,
        uti_pro_enabled,
        uti_pro_value,
        uti_pro_custom_price,
        uti_pro_type
      `)
      .eq('is_active', true)
      .neq('product_type', 'master')
      .limit(limit);
    
    // Filter by product IDs if specified
    if (config.product_ids && config.product_ids.length > 0) {
      query = query.in('product_id', config.product_ids);
    }
    
    // Filter by featured if specified
    if (config.filter_featured) {
      query = query.eq('is_featured', true);
    }
    
    // Apply sorting
    if (config.sort_by) {
      const ascending = config.sort_order === 'asc';
      switch (config.sort_by) {
        case 'name':
          query = query.order('product_name', { ascending });
          break;
        case 'price':
          query = query.order('product_price', { ascending });
          break;
        case 'created_at':
          query = query.order('created_at', { ascending });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products by criteria:', error);
      throw error;
    }

    const products = data?.map(mapRowToProductLight) || [];
    console.log(`[fetchProductsByCriteriaOptimized] Carregados ${products.length} produtos para seção`);
    
    return products;
  } catch (error) {
    console.error('Error in fetchProductsByCriteriaOptimized:', error);
    throw error;
  }
};

// Função com cache para produtos frequentemente acessados
export const fetchProductsFromDatabaseCached = async (): Promise<Product[]> => {
  const cacheKey = 'all_products';
  const cached = productCache.get(cacheKey);
  
  // Verificar se o cache é válido
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('[fetchProductsFromDatabaseCached] Retornando dados do cache');
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from('view_product_with_tags')
      .select('*')
      .neq('product_type', 'master');

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

    const products = Array.from(productsMap.values());
    
    // Salvar no cache
    productCache.set(cacheKey, {
      data: products,
      timestamp: Date.now()
    });

    console.log(`[fetchProductsFromDatabaseCached] Carregados ${products.length} produtos únicos (cached)`);
    return products;
  } catch (error) {
    console.error('Error in fetchProductsFromDatabaseCached:', error);
    throw error;
  }
};

// Função para invalidar cache
export const invalidateProductCache = () => {
  productCache.clear();
  console.log('[invalidateProductCache] Cache de produtos invalidado');
};

// Função para pré-carregar imagens críticas
export const preloadCriticalImages = (products: ProductLight[], count: number = 6) => {
  const criticalProducts = products.slice(0, count);
  
  criticalProducts.forEach(product => {
    if (product.image) {
      const img = new Image();
      img.src = product.image;
    }
  });
  
  console.log(`[preloadCriticalImages] Pré-carregando ${criticalProducts.length} imagens críticas`);
};

