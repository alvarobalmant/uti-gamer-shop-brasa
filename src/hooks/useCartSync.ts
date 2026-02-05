// Cart sync using localStorage only (cart_items table removed)
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { Product } from './useProducts';

export interface CartItem {
  id: string;
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
  addedAt: Date;
}

export const useCartSync = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadLocalCart = () => {
      try {
        const saved = localStorage.getItem('uti-games-cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('Carregando carrinho local:', parsed.length, 'items');
          setCart(Array.isArray(parsed) ? parsed.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) : []);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho local:', error);
        setCart([]);
      }
    };
    loadLocalCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('uti-games-cart', JSON.stringify(cart));
      console.log('Carrinho salvo localmente:', cart.length, 'items');
    } catch (error) {
      console.error('Erro ao salvar carrinho local:', error);
    }
  }, [cart]);

  const generateItemId = useCallback((product: Product, size?: string, color?: string): string => {
    return `${product.id}-${size || 'default'}-${color || 'default'}`;
  }, []);

  const addToCart = useCallback(async (product: Product, size?: string, color?: string, quantity = 1) => {
    console.log('addToCart chamado:', product.name, 'size:', size, 'color:', color, 'qty:', quantity);
    const itemId = generateItemId(product, size, color);
    
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === itemId);
      let newCart: CartItem[];
      if (existingItemIndex >= 0) {
        newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
      } else {
        const newItem: CartItem = { id: itemId, product, size, color, quantity, addedAt: new Date() };
        newCart = [...prev, newItem];
      }
      return newCart;
    });

    toast({
      title: "✅ Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 2000,
      className: "bg-green-50 border-green-200 text-green-800",
    });
  }, [generateItemId, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    console.log('removeFromCart chamado:', itemId);
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(async (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const itemId = `${productId}-${size || 'default'}-${color || 'default'}`;
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    console.log('clearCart chamado');
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getCartItemsCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const sendToWhatsApp = useCallback(async () => {
    if (cart.length === 0) return;
    try {
      const { sendToWhatsApp: sendToWhatsAppDetailed } = await import('@/utils/whatsapp');
      await sendToWhatsAppDetailed(cart, '5527999771112', (context) => console.log('📊 Tracking context:', context));
    } catch (error) {
      console.error('❌ Error in sendToWhatsApp:', error);
      const itemsList = cart.map(item => 
        `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n');
      const total = getCartTotal();
      const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
      window.open(`https://wa.me/5527999771112?text=${encodeURIComponent(message)}`, '_blank');
    }
  }, [cart, getCartTotal]);

  return {
    cart,
    loading: loading || syncing,
    error: null,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    sendToWhatsApp,
    syncing
  };
};