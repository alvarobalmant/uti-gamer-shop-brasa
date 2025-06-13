
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  list_price?: number;
  originalPrice?: number; // Added for Xbox4 components
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  discount_price?: number;
  discount?: number; // Added for Xbox4 components  
  image: string;
  images?: string[];
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
  sku?: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  is_featured?: boolean;
  isNew?: boolean; // Added for Xbox4 components
  is_active?: boolean;
  rating?: number;
  created_at: string;
  updated_at: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
}
