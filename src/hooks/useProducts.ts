import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Product, ProductSKU, MasterProduct, SKUNavigation, Platform, PlatformInfo } from './useProducts/types';

// Export the Product type from the types file
export type { Product, ProductSKU, MasterProduct, SKUNavigation, Platform, PlatformInfo } from './useProducts/types';

// Type mapper to convert database rows to Product interface
const mapDatabaseToProduct = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    brand: data.brand,
    price: data.price,
    list_price: data.list_price,
    pro_price: data.pro_price,
    pro_discount_percent: data.pro_discount_percent,
    new_price: data.new_price,
    digital_price: data.digital_price,
    discount_price: data.discount_price,
    promotional_price: data.promotional_price,
    discount_percentage: data.discount_percentage,
    pix_discount_percentage: data.pix_discount_percentage,
    uti_pro_price: data.uti_pro_price,
    installment_options: data.installment_options,
    image: data.image || data.image_url || '',
    image_url: data.image_url || data.image,
    images: data.images || data.additional_images || [],
    additional_images: data.additional_images || [],
    sizes: data.sizes,
    colors: data.colors,
    stock: data.stock,
    category_id: data.category_id,
    category: data.category,
    tags: data.tags,
    tagIds: data.tagIds,
    sku: data.sku,
    badge_text: data.badge_text,
    badge_color: data.badge_color,
    badge_visible: data.badge_visible,
    is_featured: data.is_featured,
    is_active: data.is_active,
    rating: data.rating,
    rating_average: data.rating_average,
    rating_count: data.rating_count,
    reviews_enabled: data.reviews_enabled,
    show_stock: data.show_stock,
    show_rating: data.show_rating,
    created_at: data.created_at,
    updated_at: data.updated_at,
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    technical_specs: data.technical_specs,
    product_features: data.product_features,
    shipping_weight: data.shipping_weight,
    shipping_dimensions: data.shipping_dimensions,
    free_shipping: data.free_shipping,
    shipping_time_min: data.shipping_time_min,
    shipping_time_max: data.shipping_time_max,
    store_pickup_available: data.store_pickup_available,
    related_products: data.related_products,
    related_products_auto: data.related_products_auto,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    slug: data.slug,
    platform: data.platform,
    is_on_sale: data.is_on_sale,
    condition: data.condition,
    title: data.title || data.name,
    genre: data.genre,
    developer: data.developer,
    product_videos: data.product_videos,
    product_faqs: data.product_faqs,
    product_highlights: data.product_highlights,
    features: data.features || data.product_features,
    reviews_config: data.reviews_config,
    trust_indicators: data.trust_indicators,
    manual_related_products: data.manual_related_products,
    breadcrumb_config: data.breadcrumb_config,
    product_descriptions: data.product_descriptions,
    delivery_config: data.delivery_config,
    display_config: data.display_config,
    parent_product_id: data.parent_product_id,
    is_master_product: data.is_master_product,
    product_type: data.product_type,
    sku_code: data.sku_code,
    variant_attributes: data.variant_attributes,
    sort_order: data.sort_order,
    available_variants: data.available_variants,
    master_slug: data.master_slug,
    inherit_from_master: data.inherit_from_master,
    uti_pro_enabled: data.uti_pro_enabled,
    uti_pro_type: data.uti_pro_type,
    uti_pro_value: data.uti_pro_value,
    uti_pro_custom_price: data.uti_pro_custom_price,
  };
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const mappedProducts = (data || []).map(mapDatabaseToProduct);
      setProducts(mappedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast({
        title: "Error loading products",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchSingleProduct = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return mapDatabaseToProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      toast({
        title: "Error loading product",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const fetchProductsByConfig = useCallback(async (config: any) => {
    try {
      let query = supabase.from('products').select('*').eq('is_active', true);
      
      if (config.category) {
        query = query.eq('category', config.category);
      }
      
      if (config.limit) {
        query = query.limit(config.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      return (data || []).map(mapDatabaseToProduct);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products by config';
      toast({
        title: "Error loading products",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const addProduct = useCallback(async (productData: Partial<Product>) => {
    try {
      // Convert Product interface to database format
      const dbData = {
        name: productData.name,
        description: productData.description,
        brand: productData.brand,
        price: productData.price,
        image: productData.image,
        // Add other required fields as needed
        ...productData
      };

      const { data, error: addError } = await supabase
        .from('products')
        .insert([dbData as any]) // Use any to bypass strict typing for now
        .select()
        .single();

      if (addError) {
        throw addError;
      }

      const mappedProduct = mapDatabaseToProduct(data);
      setProducts(prev => [mappedProduct, ...prev]);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });

      return mappedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      toast({
        title: "Error adding product",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates as any) // Use any to bypass strict typing for now
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const mappedProduct = mapDatabaseToProduct(data);
      setProducts(prev => prev.map(product => 
        product.id === id ? mappedProduct : product
      ));

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      return mappedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      toast({
        title: "Error updating product",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setProducts(prev => prev.filter(product => product.id !== id));

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      toast({
        title: "Error deleting product",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    refetch: fetchProducts,
    fetchSingleProduct,
    fetchProductsByConfig,
  };
};

export { useProducts };
export default useProducts;