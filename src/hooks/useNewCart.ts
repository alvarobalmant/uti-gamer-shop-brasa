import { useState, useCallback } from 'react';
import { Product } from '@/hooks/useProducts';
import { CartItem } from '@/types/cart';

export const useNewCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCallback(async (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const newItem: CartItem = {
      id: `${product.id}-${size || 'default'}-${color || 'default'}`,
      product,
      size,
      color,
      quantity,
      addedAt: new Date()
    };
    setCart(prev => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback(async (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(async (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getCartItemsCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const sendToWhatsApp = useCallback(() => {
    // Stub implementation
    console.log('Send to WhatsApp called');
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    sendToWhatsApp
  };
};