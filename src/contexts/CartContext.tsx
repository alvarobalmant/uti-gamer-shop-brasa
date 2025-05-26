
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product: Product;
  size?: string;
  color?: string;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  sendToWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'uti-games-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Carregar carrinho do localStorage na inicialização
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validatedCart = parsed.map(item => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          setCart(validatedCart);
          console.log('Carrinho carregado:', validatedCart.length, 'items');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log('Carrinho salvo:', cart.length, 'items');
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [cart]);

  const generateItemId = (product: Product, size?: string, color?: string): string => {
    return `${product.id}-${size || 'default'}-${color || 'default'}`;
  };

  const addToCart = (product: Product, size?: string, color?: string) => {
    const itemId = generateItemId(product, size, color);
    
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        return newCart;
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          size,
          color,
          quantity: 1,
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
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const itemId = generateItemId({ id: productId } as Product, size, color);
    
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prev => 
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const sendToWhatsApp = () => {
    if (cart.length === 0) return;

    const itemsList = cart.map(item => 
      `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getCartTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      sendToWhatsApp,
    }}>
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
