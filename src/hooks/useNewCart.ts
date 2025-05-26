
import { useCallback } from 'react';
import { useCartState } from './useCartState';
import { useCartPersistence } from './useCartPersistence';
import { Product } from './useProducts';

export const useNewCart = () => {
  const { state, actions, setState } = useCartState();
  
  // Setup persistence with proper callbacks
  const setItems = useCallback((items: any[]) => {
    console.log('setItems chamado com:', items.length, 'items');
    setState(prev => ({ ...prev, items }));
  }, [setState]);

  const setLoading = useCallback((loading: boolean) => {
    console.log('setLoading chamado com:', loading);
    setState(prev => ({ ...prev, isLoading: loading }));
  }, [setState]);

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
    console.log('addToCart chamado para:', product.name);
    return actions.addItem(product, size, color, 1);
  }, [actions]);

  const updateQuantity = useCallback((productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const itemId = `${productId}-${size || 'default'}-${color || 'default'}`;
    console.log('updateQuantity chamado para:', itemId, 'nova quantidade:', quantity);
    return actions.updateQuantity(itemId, quantity);
  }, [actions]);

  const getCartTotal = useCallback(() => {
    const total = actions.getTotal();
    console.log('getCartTotal:', total);
    return total;
  }, [actions]);

  const getCartItemsCount = useCallback(() => {
    const count = actions.getItemsCount();
    console.log('getCartItemsCount:', count);
    return count;
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
