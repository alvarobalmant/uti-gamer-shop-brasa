
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
  specifications?: Array<{
    label: string;
    value: string;
  }>;
  rating?: number;
  is_featured?: boolean;
  condition?: string;
  platform?: string;
  category?: string;
  
  // Computed properties for compatibility
  get imageUrl(): string;
  get isNew(): boolean;
  get isOnSale(): boolean;
  get isFeatured(): boolean;
  get originalPrice(): number | undefined;
  get badge(): { text: string; color: string } | undefined;
  get badgeColor(): string | undefined;
  get proPrice(): number | undefined;
  get categoryId(): string | undefined;
}
