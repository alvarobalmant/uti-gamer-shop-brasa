
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/hooks/useProducts';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  sendToWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'uti-games-cart';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Gerar ID único para item do carrinho
  const generateItemId = useCallback((product: Product, size?: string, color?: string): string => {
    return `${product.id}-${size || 'default'}-${color || 'default'}`;
  }, []);

  // Carregar do localStorage
  const loadFromLocalStorage = useCallback((): CartItem[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(item => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })) : [];
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
    return [];
  }, []);

  // Salvar no localStorage
  const saveToLocalStorage = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      console.log('Carrinho salvo no localStorage:', cartItems.length, 'items');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }, []);

  // Carregar do banco de dados
  const loadFromDatabase = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];

    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          size,
          color,
          quantity,
          created_at,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (cartItems) {
        return cartItems.map((item: any): CartItem => ({
          id: `${item.product_id}-${item.size || 'default'}-${item.color || 'default'}`,
          product: item.products,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          addedAt: new Date(item.created_at)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar do banco:', error);
    }
    return [];
  }, [user]);

  // Salvar no banco de dados
  const saveToDatabase = useCallback(async (cartItems: CartItem[]) => {
    if (!user) return;

    try {
      // Limpar carrinho existente
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Inserir novos itens
      if (cartItems.length > 0) {
        const itemsToInsert = cartItems.map(item => ({
          user_id: user.id,
          product_id: item.product.id,
          size: item.size || null,
          color: item.color || null,
          quantity: item.quantity,
        }));

        const { error } = await supabase
          .from('cart_items')
          .insert(itemsToInsert);

        if (error) throw error;
      }
      console.log('Carrinho salvo no banco:', cartItems.length, 'items');
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
    }
  }, [user]);

  // Mesclar carrinho local com o do banco
  const mergeLocalWithDatabase = useCallback(async (localItems: CartItem[], dbItems: CartItem[]): Promise<CartItem[]> => {
    const merged = [...dbItems];
    
    localItems.forEach(localItem => {
      const existingIndex = merged.findIndex(item => item.id === localItem.id);
      if (existingIndex >= 0) {
        // Se item já existe, somar quantidades
        merged[existingIndex].quantity += localItem.quantity;
      } else {
        // Se não existe, adicionar
        merged.push(localItem);
      }
    });

    return merged;
  }, []);

  // Carregar carrinho inicial
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Usuário logado: carregar do banco e mesclar com localStorage
          const [dbItems, localItems] = await Promise.all([
            loadFromDatabase(),
            Promise.resolve(loadFromLocalStorage())
          ]);

          if (localItems.length > 0) {
            // Mesclar carrinho local com o do banco
            const mergedItems = await mergeLocalWithDatabase(localItems, dbItems);
            setItems(mergedItems);
            
            // Salvar no banco e limpar localStorage
            await saveToDatabase(mergedItems);
            localStorage.removeItem(STORAGE_KEY);
            
            console.log('Carrinho mesclado:', mergedItems.length, 'items');
          } else {
            setItems(dbItems);
            console.log('Carregado do banco:', dbItems.length, 'items');
          }
        } else {
          // Usuário não logado: carregar apenas do localStorage
          const localItems = loadFromLocalStorage();
          setItems(localItems);
          console.log('Carregado do localStorage:', localItems.length, 'items');
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, loadFromDatabase, loadFromLocalStorage, mergeLocalWithDatabase, saveToDatabase]);

  // Salvar automaticamente quando items mudam
  useEffect(() => {
    if (!isLoading && items.length >= 0) {
      const timeoutId = setTimeout(() => {
        if (user) {
          saveToDatabase(items);
        } else {
          saveToLocalStorage(items);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [items, user, isLoading, saveToDatabase, saveToLocalStorage]);

  const addToCart = useCallback(async (product: Product, size?: string, color?: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const itemId = generateItemId(product, size, color);
      
      setItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...prev];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          return updatedItems;
        } else {
          const newItem: CartItem = {
            id: itemId,
            product,
            size,
            color,
            quantity,
            addedAt: new Date()
          };
          return [...prev, newItem];
        }
      });

      toast({
        title: "✅ Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
        duration: 2000,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "❌ Erro",
        description: "Erro ao adicionar item ao carrinho",
        duration: 3000,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  }, [generateItemId, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Erro ao remover item:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    try {
      setIsLoading(true);
      const itemId = `${productId}-${size || 'default'}-${color || 'default'}`;
      
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setIsLoading(false);
    }
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setItems([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [items]);

  const getCartItemsCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const sendToWhatsApp = useCallback(() => {
    if (items.length === 0) return;

    const itemsList = items.map(item => 
      `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getCartTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [items, getCartTotal]);

  const value: CartContextType = {
    items,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    sendToWhatsApp,
  };

  return (
    <CartContext.Provider value={value}>
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
