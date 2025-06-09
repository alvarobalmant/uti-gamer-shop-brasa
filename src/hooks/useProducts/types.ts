
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
  image: string;
  images?: string[]; // Main images array from database
  additional_images?: string[]; // Legacy compatibility field
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
  sku?: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  specifications?: Array<{ label: string; value: string; }>; // New specifications field
}
