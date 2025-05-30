# Merged version of CartContext.tsx
# Using the structure from the GitHub version (based on useNewCart hook)
# Ensuring the exported CartContextType includes all necessary functions/properties used by components.

import React, { createContext, useContext, ReactNode } from 'react';
import { useNewCart } from '@/hooks/useNewCart'; // Assuming this hook provides the core cart logic
import { Product } from '@/hooks/useProducts'; // Keep Product type if needed for addToCart
import { CartItem } from '@/types/cart'; // Import CartItem type if used by useNewCart or needed

// Define the context type based on what components expect and what useNewCart provides
export interface CartContextType {
  items: CartItem[]; // Use CartItem type for better type safety
  itemCount: number;
  total: number;
  loading: boolean;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => Promise<void>; // Keep detailed signature if needed by components
  removeFromCart: (itemId: string) => Promise<void>; // Use Promise based on useNewCart return type
  updateQuantity: (itemId: string, quantity: number) => Promise<void>; // Use itemId signature based on useNewCart
  clearCart: () => Promise<void>; // Use Promise based on useNewCart return type
  // Add helper functions derived from core data
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  sendToWhatsApp: () => void;
  isLoading?: boolean; // Keep for backwards compatibility if needed
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Use the hook from the GitHub version
  const cartData = useNewCart();

  // Create wrapper functions and derive properties to match the expected CartContextType
  const contextValue: CartContextType = {
    items: cartData.items, // Pass items directly
    itemCount: cartData.itemCount,
    total: cartData.total,
    loading: cartData.loading,
    addToCart: cartData.addToCart, // Pass hook functions directly
    removeFromCart: cartData.removeFromCart,
    updateQuantity: cartData.updateQuantity,
    clearCart: cartData.clearCart,
    // Derive helper functions
    getCartTotal: () => cartData.total,
    getCartItemsCount: () => cartData.itemCount,
    // Implement sendToWhatsApp based on available data
    sendToWhatsApp: () => {
      if (cartData.items.length === 0) return;
      // Reconstruct message similar to the local version, using cartData.items
      const itemsList = cartData.items.map(item => 
        `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n');
      const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${cartData.total.toFixed(2)}*`;
      const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`; // Use the correct phone number
      window.open(whatsappUrl, '_blank');
    },
    isLoading: cartData.loading, // Map loading to isLoading
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

