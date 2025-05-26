
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartItemDB {
  id: string;
  user_id: string;
  product_id: string;
  size?: string;
  color?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar carrinho na inicialização
  useEffect(() => {
    if (!initialized) {
      loadCart();
    }
  }, [user]);

  // Salvar carrinho quando mudar (apenas se já foi inicializado e não estiver carregando)
  useEffect(() => {
    if (initialized && !loading) {
      saveCart();
    }
  }, [cart, user, initialized, loading]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (user) {
        await loadCartFromDatabase();
      } else {
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (cartItems) {
        const formattedCart: CartItem[] = cartItems.map((item: any) => ({
          product: item.products,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }));
        setCart(formattedCart);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do banco:', error);
      loadCartFromLocalStorage();
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('uti-games-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
      setCart([]);
    }
  };

  const saveCart = useCallback(async () => {
    if (user) {
      await saveCartToDatabase();
    } else {
      saveCartToLocalStorage();
    }
  }, [user, cart]);

  const saveCartToDatabase = async () => {
    if (!user || loading) return;

    try {
      // Primeiro, limpar carrinho existente
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Depois, inserir novos itens
      if (cart.length > 0) {
        const cartItemsToInsert = cart.map(item => ({
          user_id: user.id,
          product_id: item.product.id,
          size: item.size || null,
          color: item.color || null,
          quantity: item.quantity,
        }));

        const { error } = await supabase
          .from('cart_items')
          .insert(cartItemsToInsert);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao salvar carrinho no banco:', error);
      saveCartToLocalStorage();
    }
  };

  const saveCartToLocalStorage = () => {
    try {
      localStorage.setItem('uti-games-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  };

  const addToCart = async (product: Product, size?: string, color?: string) => {
    const existingItem = cart.find(
      item => 
        item.product.id === product.id && 
        item.size === size && 
        item.color === color
    );

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      const newCart = [...cart, { product, size, color, quantity: 1 }];
      setCart(newCart);
    }

    toast({
      title: "✅ Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 2000,
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const updatedCart = cart.filter(item => 
      !(item.product.id === productId && item.size === size && item.color === color)
    );
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const updatedCart = cart.map(item =>
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Erro ao limpar carrinho no banco:', error);
      }
    } else {
      localStorage.removeItem('uti-games-cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Migrar carrinho do localStorage para o banco quando usuário fizer login
  const migrateCartToDatabase = useCallback(async () => {
    if (!user || !initialized || loading) return;

    try {
      const localCart = localStorage.getItem('uti-games-cart');
      if (localCart) {
        const parsedCart: CartItem[] = JSON.parse(localCart);
        if (parsedCart.length > 0) {
          // Carregar carrinho existente do banco
          const { data: existingItems } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
          
          // Se não há itens no banco, migrar do localStorage
          if (!existingItems || existingItems.length === 0) {
            setCart(parsedCart);
          }
          
          // Limpar localStorage após migração
          localStorage.removeItem('uti-games-cart');
        }
      }
    } catch (error) {
      console.error('Erro ao migrar carrinho para o banco:', error);
    }
  }, [user, initialized, loading]);

  // Chamar migração quando usuário logar e estiver inicializado
  useEffect(() => {
    if (user && initialized && !loading) {
      migrateCartToDatabase();
    }
  }, [user, initialized, loading, migrateCartToDatabase]);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
};
