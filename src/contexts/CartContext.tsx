
import React, { createContext, useContext, ReactNode } from 'react';
import { useNewCart } from '@/hooks/useNewCart';
import { Product } from '@/hooks/useProducts';

export interface CartContextType {
  items: any[];
  itemCount: number;
  total: number;
  loading: boolean;
  addToCart: (product: Product, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  // Add missing properties that components are trying to use
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  sendToWhatsApp: () => void;
  isLoading?: boolean; // For backwards compatibility
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartData = useNewCart();
  
  // Create wrapper functions to match the expected interface
  const contextValue: CartContextType = {
    ...cartData,
    getCartTotal: () => cartData.total,
    getCartItemsCount: () => cartData.itemCount,
    sendToWhatsApp: () => {
      // Basic WhatsApp implementation
      const message = `Olá! Gostaria de finalizar minha compra:\n\nItens: ${cartData.itemCount}\nTotal: R$ ${cartData.total.toFixed(2)}`;
      const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    },
    isLoading: cartData.loading, // Map loading to isLoading for backwards compatibility
  };

  return (
    <CartContext.Provider value={contextValue}>
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
