export interface Product {
  id: string;
  name: string;
  title?: string; // Add missing title property
  description?: string;
  price: number;
  list_price?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  image: string;
<<<<<<< HEAD
=======
  imageUrl?: string; // Add missing imageUrl property for compatibility
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
  images?: string[]; // Add this for compatibility
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
  sku?: string; // Add the missing sku property
  badge_text?: string;
  badge_color?: string;
  badge_visible?: boolean;
  badge?: { // Add missing badge property
    text: string;
    color: string;
  };
  specifications?: Array<{
    label: string;
    value: string;
  }>;
}
<<<<<<< HEAD

=======
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
