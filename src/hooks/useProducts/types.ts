
export interface Product {
  id: string;
  name: string;
  title?: string; // Adding title property
  description?: string;
  price: number;
  list_price?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  discount_price?: number;
  image: string;
  images?: string[];
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  category?: string; // Adding category property
  platform?: string; // Adding platform property
  tags?: { id: string; name: string; }[];
  sku?: string;
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  rating?: number;
  created_at: string;
  updated_at: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
}
