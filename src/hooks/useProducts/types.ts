
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
  images?: string[]; // Add this for compatibility
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
  sku?: string; // Add the missing sku property
<<<<<<< HEAD
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
=======
  badge_text?: string; // New badge text
  badge_color?: string; // New badge color
  badge_visible?: boolean; // New badge visibility flag
>>>>>>> 5a443887cf3fbab70105dd954c113ef55db70b7a
}
