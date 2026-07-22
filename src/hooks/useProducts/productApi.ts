import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { CarouselConfig } from '@/types/specialSections';

// Skip select-string type parsing (see performance guidance)
const sel = (s: string): string => s;

const PRODUCT_SELECT = sel(`
  *,
  product_tags!left(
    tag_id,
    integra_tags!left(id, name, category)
  )
`);

const mapRowToProduct = (row: any, tags: any[] = []): Product => {
  const price = Number(row.price) || 0;
  const promoPrice = row.promotional_price != null ? Number(row.promotional_price) : 0;
  const isOnSale = promoPrice > 0 && promoPrice < price;

  return {
    id: row.id,
    name: row.name || '',
    brand: row.brand || '',
    category: row.category || '',
    description: row.description || '',
    price: isOnSale ? promoPrice : price,
    list_price: isOnSale ? price : undefined,
    promotional_price: promoPrice || undefined,
    pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
    uti_pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
    uti_pro_enabled: row.uti_pro_enabled || false,
    image: row.image || '',
    additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
    sizes: [],
    colors: [],
    stock: Number(row.stock) || 0,
    badge_text: row.badge_text || '',
    badge_color: row.badge_color || '#22c55e',
    badge_visible: row.badge_visible || false,
    specifications: [],
    technical_specs: {},
    product_features: {},
    free_shipping: false,
    meta_title: row.meta_title || '',
    meta_description: row.meta_description || '',
    slug: row.slug || '',
    platform: row.platform || '',
    is_active: row.is_active !== false,
    is_featured: row.is_featured || false,
    is_on_sale: isOnSale,
    uti_coins_cashback_percentage: row.uti_coins_cashback_percentage
      ? Number(row.uti_coins_cashback_percentage) : 0,
    uti_coins_discount_percentage: row.uti_coins_discount_percentage
      ? Number(row.uti_coins_discount_percentage) : 0,
    sku: row.sku || '',
    sku_code: row.sku || undefined,
    product_type: 'simple',
    tags,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
};

const extractTags = (row: any): any[] => {
  const out: any[] = [];
  if (row?.product_tags && Array.isArray(row.product_tags)) {
    row.product_tags.forEach((pt: any) => {
      if (pt.integra_tags) {
        out.push({
          id: pt.integra_tags.id,
          name: pt.integra_tags.name,
          weight: 1,
          category: pt.integra_tags.category || 'generic',
        });
      }
    });
  }
  return out;
};

export const fetchProductsFromDatabase = async (
  includeAdmin: boolean = false
): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select(PRODUCT_SELECT);
    if (!includeAdmin) query = query.eq('is_active' as any, true as any);

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    return (data as any[]).map((row) => mapRowToProduct(row, extractTags(row)));
  } catch (error) {
    console.error('[fetchProductsFromDatabase] Error:', error);
    throw error;
  }
};

export const fetchProductsByCriteria = async (
  config: CarouselConfig,
  includeAdmin: boolean = false
): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select(PRODUCT_SELECT);
    if (!includeAdmin) query = query.eq('is_active' as any, true as any);
    if (config.product_ids && config.product_ids.length > 0) {
      query = query.in('id', config.product_ids);
    }
    if (config.limit) query = query.limit(config.limit);

    const { data, error } = await query;
    if (error) throw error;

    return (data as any[] | null)?.map((row) => mapRowToProduct(row, extractTags(row))) || [];
  } catch (error) {
    console.error('[fetchProductsByCriteria] Error:', error);
    throw error;
  }
};

export const fetchSingleProductFromDatabase = async (
  id: string
): Promise<Product | null> => {
  try {
    let { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      const res = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('slug' as any, id as any)
        .maybeSingle();
      if (res.error || !res.data) return null;
      data = res.data;
    }

    return mapRowToProduct(data as any, extractTags(data));
  } catch (error) {
    console.error('[fetchSingleProductFromDatabase] Error:', error);
    throw error;
  }
};

// ---------- Write operations ----------

const mapProductToRow = (p: any): any => {
  const row: any = {};
  const copy = [
    'name', 'slug', 'description', 'short_description', 'sku', 'barcode',
    'price', 'promotional_price', 'cost_price', 'stock', 'image',
    'additional_images', 'category', 'platform', 'brand',
    'is_active', 'is_featured', 'badge_text', 'badge_color', 'badge_visible',
    'uti_pro_enabled', 'uti_pro_price',
    'uti_coins_cashback_percentage', 'uti_coins_discount_percentage',
    'meta_title', 'meta_description', 'sort_order',
  ];
  copy.forEach((k) => {
    if (p[k] !== undefined) row[k] = p[k];
  });
  // Backward-compat: some callers may still send image_url
  if (p.image_url && !row.image) row.image = p.image_url;
  return row;
};

export const addProductToDatabase = async (productData: any): Promise<Product | null> => {
  const row = mapProductToRow(productData);
  if (!row.name) throw new Error('Nome é obrigatório');
  if (!row.slug) {
    row.slug = row.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  }
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return mapRowToProduct(data as any, extractTags(data));
};

export const updateProductInDatabase = async (
  id: string,
  updates: any
): Promise<Product | null> => {
  const row = mapProductToRow(updates);
  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw error;
  return mapRowToProduct(data as any, extractTags(data));
};

export const deleteProductFromDatabase = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Simple weighted-search stub for backward compatibility
export const searchProductsWithWeights = async (
  query: string
): Promise<{ products: Product[] }> => {
  const products = await fetchProductsFromDatabase(true);
  const filtered = query
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : products;
  return { products: filtered };
};
