
import { Product } from '@/hooks/useProducts';

export interface CartItem {
  id: string;
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

export interface CartActions {
  addItem: (product: Product, size?: string, color?: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemsCount: () => number;
}
