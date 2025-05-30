
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  list_price?: number; // Added for strikethrough pricing
  pro_price?: number; // Added for Pro member pricing
  pro_discount_percent?: number; // Added for Pro discount calculation
  new_price?: number; // Added for new condition pricing
  digital_price?: number; // Added for digital version pricing
  image?: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string; // Added for category-based filtering
  tags?: Array<{
    id: string;
    name: string;
  }>;
}
