
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

// Helper function to create Product objects with computed properties
export function createProduct(data: any): Product {
  return {
    ...data,
    get imageUrl() { return this.image || '/placeholder.svg'; },
    get isNew() { return this.badge_text?.toLowerCase().includes('novo') || false; },
    get isOnSale() { return !!(this.list_price && this.price < this.list_price); },
    get isFeatured() { return this.is_featured || false; },
    get originalPrice() { return this.list_price; },
    get badge() { 
      return this.badge_visible && this.badge_text 
        ? { text: this.badge_text, color: this.badge_color || '#ef4444' }
        : undefined;
    },
    get badgeColor() { return this.badge_color; },
    get proPrice() { return this.pro_price; },
    get categoryId() { return this.category_id; }
  };
}
