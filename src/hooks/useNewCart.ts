import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  created_at: string;
}

export const useNewCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching cart items:', error);
            toast({
              title: "Erro ao carregar carrinho",
              description: error.message,
              variant: "destructive",
            });
          } else {
            setItems(data || []);
          }
        } catch (error: any) {
          console.error('Unexpected error fetching cart items:', error);
          toast({
            title: "Erro inesperado ao carregar carrinho",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setItems([]);
      }
    };

    fetchCartItems();
  }, [user, toast]);

  const addToCart = async (product: Product, size?: string, color?: string) => {
    setLoading(true);
    try {
      if (!user) {
        toast({
          title: "Você precisa estar logado para adicionar itens ao carrinho.",
        });
        return;
      }

      const newItem = {
        id: uuidv4(),
        product_id: product.id,
        user_id: user.id,
        quantity: 1,
        size: size || null,
        color: color || null,
      };

      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          id: newItem.id,
          product_id: newItem.product_id,
          user_id: newItem.user_id,
          quantity: newItem.quantity,
          size: newItem.size,
          color: newItem.color,
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Erro ao adicionar ao carrinho",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setItems(prevItems => [...prevItems, {
          id: data.id,
          product: product,
          quantity: data.quantity,
          size: data.size,
          color: data.color,
          created_at: data.created_at,
        }]);
        toast({
          title: "Produto adicionado ao carrinho!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Erro ao remover do carrinho",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast({
          title: "Produto removido do carrinho!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Erro ao atualizar quantidade",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: data.quantity } : item
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (!user) {
        toast({
          title: "Você precisa estar logado para limpar o carrinho.",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: "Erro ao limpar o carrinho",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setItems([]);
        toast({
          title: "Carrinho limpo com sucesso!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
