// Cart persistence using localStorage only (cart_items table removed)
import { useEffect, useCallback } from 'react';
import { CartItem } from '@/types/cart';

interface UseCartPersistenceProps {
  items: CartItem[];
  isLoading: boolean;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useCartPersistence = ({ items, isLoading, setItems, setLoading }: UseCartPersistenceProps) => {
  const loadFromLocalStorage = useCallback((): CartItem[] => {
    try {
      const saved = localStorage.getItem('uti-games-cart');
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

  const saveToLocalStorage = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem('uti-games-cart', JSON.stringify(cartItems));
      console.log('Carrinho salvo no localStorage:', cartItems.length, 'items');
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }, []);

  // Stub: Database sync removed - using localStorage only
  const loadFromDatabase = useCallback(async (): Promise<CartItem[]> => {
    return [];
  }, []);

  // Stub: Database sync removed - using localStorage only
  const saveToDatabase = useCallback(async (cartItems: CartItem[]) => {
    saveToLocalStorage(cartItems);
  }, [saveToLocalStorage]);

  // Load cart on initialization - localStorage only
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const localItems = loadFromLocalStorage();
        console.log('Carregando carrinho do localStorage:', localItems.length, 'items');
        setItems(localItems);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [loadFromLocalStorage, setItems, setLoading]);

  // Save changes automatically with debounce - localStorage only
  useEffect(() => {
    if (!isLoading && items.length >= 0) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(items);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [items, isLoading, saveToLocalStorage]);

  return {
    loadFromLocalStorage,
    saveToLocalStorage,
    loadFromDatabase,
    saveToDatabase,
  };
};