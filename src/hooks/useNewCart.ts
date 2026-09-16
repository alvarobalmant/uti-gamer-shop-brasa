
import { useState, useCallback, useEffect } from 'react';
import { Product } from './useProducts';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/contexts/AnalyticsContext';

export const useNewCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { trackAddToCart, trackRemoveFromCart } = useAnalytics();

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem('uti-games-cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('Carregando carrinho do localStorage:', parsed.length, 'items');
          setCart(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        setCart([]);
      }
    };
    
    loadCart();
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (cart.length >= 0) {
      try {
        localStorage.setItem('uti-games-cart', JSON.stringify(cart));
        console.log('Carrinho salvo no localStorage:', cart.length, 'items');
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
      }
    }
  }, [cart]);

  const generateItemId = useCallback((product: Product, size?: string, color?: string): string => {
    return `${product.id}-${size || 'default'}-${color || 'default'}`;
  }, []);

  const addToCart = useCallback((product: Product, size?: string, color?: string, quantity: number = 1): boolean => {
    console.log('addToCart chamado para:', product.name, 'size:', size, 'color:', color, 'quantity:', quantity);

    // Validação de quantidade
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      toast({
        title: "Quantidade inválida",
        description: "Selecione uma quantidade válida antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return false;
    }

    const itemId = generateItemId(product, size, color);
    const existingItem = cart.find(item => item.id === itemId);
    const resultingQuantity = (existingItem?.quantity || 0) + qty;

    // Validação de estoque: não adicionar se exceder o disponível
    const stock = typeof product.stock === 'number' ? product.stock : undefined;
    if (stock !== undefined) {
      if (stock <= 0) {
        toast({
          title: "Produto esgotado",
          description: `${product.name} está fora de estoque no momento.`,
          variant: "destructive",
        });
        return false;
      }
      if (resultingQuantity > stock) {
        toast({
          title: "Estoque insuficiente",
          description: `Temos apenas ${stock} unidade(s) de ${product.name} disponíveis${existingItem ? ` e seu carrinho já contém ${existingItem.quantity}` : ''}.`,
          variant: "destructive",
        });
        return false;
      }
    }

    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === itemId);

      if (existingItemIndex >= 0) {
        // Atualizar item existente acumulando a quantidade (sem duplicar item)
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + qty
        };
        console.log('Item existente atualizado. Nova quantidade:', newCart[existingItemIndex].quantity);
        return newCart;
      } else {
        // Adicionar novo item com a quantidade selecionada
        const newItem: CartItem = {
          id: itemId,
          product,
          size,
          color,
          quantity: qty,
          addedAt: new Date()
        };
        console.log('Novo item adicionado:', newItem);
        return [...prev, newItem];
      }
    });

    // Track analytics with differentiation
    trackAddToCart(product.id, qty, product.price);

    toast({
      title: "✅ Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 2000,
      className: "bg-green-50 border-green-200 text-green-800",
    });
    return true;
  }, [cart, generateItemId, toast, trackAddToCart]);

  const removeFromCart = useCallback((itemId: string) => {
    console.log('removeFromCart chamado para:', itemId);
    setCart(prev => {
      // Find the item being removed for analytics
      const removedItem = prev.find(item => item.id === itemId);
      if (removedItem) {
        trackRemoveFromCart(removedItem.product.id, removedItem.quantity, removedItem.product.price);
      }
      
      const newCart = prev.filter(item => item.id !== itemId);
      console.log('Item removido. Carrinho agora tem:', newCart.length, 'items');
      return newCart;
    });
  }, [trackRemoveFromCart]);

  const updateQuantity = useCallback((productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const itemId = `${productId}-${size || 'default'}-${color || 'default'}`;
    console.log('updateQuantity chamado para:', itemId, 'nova quantidade:', quantity);
    
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev => {
      const newCart = prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      console.log('Quantidade atualizada para item:', itemId, 'nova quantidade:', quantity);
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    console.log('clearCart chamado');
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    const total = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    console.log('getCartTotal:', total);
    return total;
  }, [cart]);

  const getCartItemsCount = useCallback(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('getCartItemsCount:', count);
    return count;
  }, [cart]);

  const sendToWhatsApp = useCallback(async () => {
    console.log('🛒 sendToWhatsApp called, cart:', cart);
    if (cart.length === 0) {
      console.log('❌ Cart is empty');
      return;
    }

    try {
      // Importar e usar a função detalhada do utils que inclui código de verificação e informações completas
      const { sendToWhatsApp: sendToWhatsAppDetailed } = await import('@/utils/whatsapp');
      console.log('✅ WhatsApp function imported');
      
      const result = await sendToWhatsAppDetailed(
        cart, 
        '5527999771112', 
        (context) => {
          console.log('📊 Tracking context:', context);
        },
        undefined, // onLoadingStart
        undefined, // cartTotals - será calculado internamente na função
        false, // utiCoinsUsed - valor padrão
        undefined // userCoinsBalance - será obtido internamente na função
      );
      
      console.log('✅ WhatsApp result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in sendToWhatsApp:', error);
      throw error;
    }
  }, [cart]);

  return {
    cart,
    loading,
    error: null,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    sendToWhatsApp,
  };
};
