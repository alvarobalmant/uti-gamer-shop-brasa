
import { supabase } from '@/integrations/supabase/client';
import { Product, createProduct } from './types';
import { CarouselConfig } from '@/types/specialSections';

// Convert database product to Product interface
const mapDatabaseProductToProduct = (dbProduct: any): Product => {
  return createProduct({
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: Number(dbProduct.price),
    list_price: dbProduct.list_price ? Number(dbProduct.list_price) : undefined,
    pro_price: dbProduct.pro_price ? Number(dbProduct.pro_price) : undefined,
    pro_discount_percent: dbProduct.pro_discount_percent,
    new_price: dbProduct.new_price ? Number(dbProduct.new_price) : undefined,
    digital_price: dbProduct.digital_price ? Number(dbProduct.digital_price) : undefined,
    image: dbProduct.image,
    images: dbProduct.images || [],
    additional_images: dbProduct.additional_images || [],
    sizes: dbProduct.sizes || [],
    colors: dbProduct.colors || [],
    stock: dbProduct.stock,
    category_id: dbProduct.category,
    sku: dbProduct.id,
    badge_text: dbProduct.badge_text,
    badge_color: dbProduct.badge_color,
    badge_visible: dbProduct.badge_visible,
    specifications: dbProduct.specifications,
    rating: dbProduct.rating ? Number(dbProduct.rating) : undefined,
    is_featured: dbProduct.is_featured,
    condition: dbProduct.condition,
    platform: dbProduct.platform,
    category: dbProduct.category,
    tags: dbProduct.product_tags?.map((pt: any) => ({
      id: pt.tags.id,
      name: pt.tags.name
    })) || []
  });
};

export const fetchProductsFromDatabase = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data?.map(mapDatabaseProductToProduct) || [];
};

// New function to fetch products based on carousel config
export const fetchProductsByCriteria = async (config: CarouselConfig): Promise<Product[]> => {
  if (!config || !config.filter) {
    return fetchProductsFromDatabase(); // Return all products if no config
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('is_active', true);

  // Apply filters
  const { featured, newReleases, onSale, tagIds, categoryIds, limit } = config.filter;

  if (featured) {
    query = query.eq('is_featured', true);
  }

  if (newReleases) {
    query = query.ilike('badge_text', '%novo%');
  }

  if (onSale) {
    query = query.not('list_price', 'is', null);
  }

  // For tag and category filtering, we'll do it after fetching
  // since Supabase doesn't easily support complex joins with filtering

  query = query.order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products by criteria:', error);
    throw error;
  }

  let products = data?.map(mapDatabaseProductToProduct) || [];

  // Apply tag filtering on the client side
  if (tagIds && tagIds.length > 0) {
    products = products.filter(product => 
      product.tags?.some(tag => 
        tagIds.includes(tag.id) || tagIds.includes(tag.name.toLowerCase())
      )
    );
  }

  // Apply category filtering on the client side
  if (categoryIds && categoryIds.length > 0) {
    products = products.filter(product => 
      product.category_id && categoryIds.includes(product.category_id)
    );
  }

  return products;
};

export const addProductToDatabase = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
  const { tagIds, ...productFields } = productData;
  
  // Insert product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([{
      name: productFields.name,
      description: productFields.description,
      price: productFields.price,
      list_price: productFields.list_price,
      pro_price: productFields.pro_price,
      pro_discount_percent: productFields.pro_discount_percent,
      new_price: productFields.new_price,
      digital_price: productFields.digital_price,
      image: productFields.image,
      images: productFields.images,
      additional_images: productFields.additional_images,
      sizes: productFields.sizes,
      colors: productFields.colors,
      stock: productFields.stock,
      category: productFields.category_id,
      badge_text: productFields.badge_text,
      badge_color: productFields.badge_color,
      badge_visible: productFields.badge_visible,
      specifications: productFields.specifications,
      rating: productFields.rating,
      is_featured: productFields.is_featured,
      condition: productFields.condition,
      platform: productFields.platform,
    }])
    .select()
    .single();

  if (productError) throw productError;

  // Insert product tags
  if (tagIds && tagIds.length > 0 && product) {
    const productTagsData = tagIds.map(tagId => ({
      product_id: product.id,
      tag_id: tagId
    }));

    const { error: tagError } = await supabase
      .from('product_tags')
      .insert(productTagsData);

    if (tagError) throw tagError;
  }

  return product;
};

export const updateProductInDatabase = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
  const { tagIds, ...productUpdates } = updates;
  
  // Update product
  const { data: product, error: productError } = await supabase
    .from('products')
    .update({
      name: productUpdates.name,
      description: productUpdates.description,
      price: productUpdates.price,
      list_price: productUpdates.list_price,
      pro_price: productUpdates.pro_price,
      pro_discount_percent: productUpdates.pro_discount_percent,
      new_price: productUpdates.new_price,
      digital_price: productUpdates.digital_price,
      image: productUpdates.image,
      images: productUpdates.images,
      additional_images: productUpdates.additional_images,
      sizes: productUpdates.sizes,
      colors: productUpdates.colors,
      stock: productUpdates.stock,
      category: productUpdates.category_id,
      badge_text: productUpdates.badge_text,
      badge_color: productUpdates.badge_color,
      badge_visible: productUpdates.badge_visible,
      specifications: productUpdates.specifications,
      rating: productUpdates.rating,
      is_featured: productUpdates.is_featured,
      condition: productUpdates.condition,
      platform: productUpdates.platform,
    })
    .eq('id', id)
    .select()
    .single();

  if (productError) throw productError;

  // Update product tags if provided
  if (tagIds !== undefined && product) {
    // Delete existing tags
    await supabase
      .from('product_tags')
      .delete()
      .eq('product_id', id);

    // Insert new tags
    if (tagIds.length > 0) {
      const productTagsData = tagIds.map(tagId => ({
        product_id: id,
        tag_id: tagId
      }));

      const { error: tagError } = await supabase
        .from('product_tags')
        .insert(productTagsData);

      if (tagError) throw tagError;
    }
  }

  return product;
};

export const deleteProductFromDatabase = async (id: string) => {
  // Delete product tags first
  await supabase
    .from('product_tags')
    .delete()
    .eq('product_id', id);

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
