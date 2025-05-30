
import React, { createContext, useContext, ReactNode } from 'react';
import { useNewCart } from '@/hooks/useNewCart';
import { Product } from '@/hooks/useProducts';

export interface CartContextType {
  items: any[];
  itemCount: number;
  total: number;
  loading: boolean; // Added missing loading property
  addToCart: (product: Product, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartData = useNewCart();

  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
