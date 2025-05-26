
import { useCallback } from 'react';
import { useCartState } from './useCartState';
import { useCartPersistence } from './useCartPersistence';
import { Product } from './useProducts';

export const useNewCart = () => {
  const { state, actions } = useCartState();
  
  // Setup persistence
  const setItems = useCallback((items: any[]) => {
    // This will be handled by the cart state
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    // This will be handled by the cart state
  }, []);

  useCartPersistence({
    items: state.items,
    isLoading: state.isLoading,
    setItems,
    setLoading,
  });

  const sendToWhatsApp = useCallback(() => {
    if (state.items.length === 0) return;

    const itemsList = state.items.map(item => 
      `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = actions.getTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [state.items, actions]);

  // Legacy compatibility methods
  const addToCart = useCallback((product: Product, size?: string, color?: string) => {
    return actions.addItem(product, size, color, 1);
  }, [actions]);

  const updateQuantity = useCallback((productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const itemId = `${productId}-${size || 'default'}-${color || 'default'}`;
    return actions.updateQuantity(itemId, quantity);
  }, [actions]);

  const getCartTotal = useCallback(() => {
    return actions.getTotal();
  }, [actions]);

  const getCartItemsCount = useCallback(() => {
    return actions.getItemsCount();
  }, [actions]);

  return {
    cart: state.items,
    loading: state.isLoading,
    error: state.error,
    addToCart,
    removeFromCart: actions.removeItem,
    updateQuantity,
    clearCart: actions.clearCart,
    getCartTotal,
    getCartItemsCount,
    sendToWhatsApp,
    // New methods
    actions,
  };
};
