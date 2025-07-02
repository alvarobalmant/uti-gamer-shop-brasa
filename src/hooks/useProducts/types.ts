
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
  
<<<<<<< HEAD
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
=======
  // Novos campos configuráveis
  product_videos?: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    duration: string;
    type: 'youtube' | 'vimeo' | 'mp4';
    order: number;
    is_featured: boolean;
  }>;
  
  product_faqs?: Array<{
    id: string;
    question: string;
    answer: string;
    order: number;
    is_visible: boolean;
    category: string;
  }>;
  
  product_highlights?: Array<{
    id: string;
    text: string;
    icon: string;
    order: number;
    is_featured: boolean;
  }>;
  
  reviews_config?: {
    enabled: boolean;
    show_rating: boolean;
    show_count: boolean;
    allow_reviews: boolean;
    custom_rating?: {
      value: number;
      count: number;
      use_custom: boolean;
    };
  };
  
  trust_indicators?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    is_visible: boolean;
  }>;
  
  manual_related_products?: Array<{
    product_id: string;
    relationship_type: string;
    order: number;
    custom_title: string;
  }>;
  
  breadcrumb_config?: {
    custom_path: Array<{
      label: string;
      url: string;
    }>;
    use_custom: boolean;
    show_breadcrumb: boolean;
  };
  
  product_descriptions?: {
    short?: string;
    detailed?: string;
    technical?: string;
    marketing?: string;
  };
  
  delivery_config?: {
    custom_shipping_time?: string;
    shipping_regions?: string[];
    express_available?: boolean;
    pickup_locations?: Array<{
      name: string;
      address: string;
      hours: string;
    }>;
  };
  
  display_config?: {
    show_stock_counter?: boolean;
    show_view_counter?: boolean;
    custom_view_count?: number;
    show_urgency_banner?: boolean;
    urgency_text?: string;
    show_social_proof?: boolean;
    social_proof_text?: string;
  };
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
}
