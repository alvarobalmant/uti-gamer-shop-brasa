
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  list_price?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  discount_price?: number;
  promotional_price?: number;
  discount_percentage?: number;
  pix_discount_percentage?: number;
  uti_pro_price?: number;
  installment_options?: number;
  image: string;
  images?: string[];
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
  tagIds?: string[];
  sku?: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  rating?: number;
  rating_average?: number;
  rating_count?: number;
  reviews_enabled?: boolean;
  show_stock?: boolean;
  show_rating?: boolean;
  created_at: string;
  updated_at: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
  technical_specs?: any;
  product_features?: any;
  shipping_weight?: number;
  shipping_dimensions?: any;
  free_shipping?: boolean;
  shipping_time_min?: number;
  shipping_time_max?: number;
  store_pickup_available?: boolean;
  related_products?: any;
  related_products_auto?: boolean;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  
  // Campos adicionais necessários
  platform?: string;
  is_on_sale?: boolean;
  category?: string;
  condition?: string;
  title?: string;
  
  // Novos campos expandidos
  product_videos?: any;
  product_faqs?: any;
  product_highlights?: any;
  reviews_config?: any;
  trust_indicators?: any;
  manual_related_products?: any;
  breadcrumb_config?: any;
  product_descriptions?: any;
  delivery_config?: any;
  display_config?: any;
}
