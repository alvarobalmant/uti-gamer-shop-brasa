# Merged version of useNewCart.ts
# Prioritizing the GitHub version's logic (Supabase integration)
# Ensuring function signatures match the merged CartContext.tsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product, useProducts } from '@/hooks/useProducts'; // Keep useProducts dependency
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@/types/cart'; // Use the type defined in types/cart.ts

// Keep the hook structure from the GitHub version
export const useNewCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  // Keep products dependency if needed for mapping fetched items
  const { products } = useProducts(); 

  // Fetch cart items logic from GitHub version
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user && products.length > 0) { // Only fetch if user is logged in and products are loaded
        setLoading(true);
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
            setItems([]); // Clear items on error
          } else {
            // Map database items to CartItem interface
            const cartItems: CartItem[] = (data || []).map(dbItem => {
              const product = products.find(p => p.id === dbItem.product_id);
              if (!product) {
                console.warn('Product not found for cart item:', dbItem.product_id);
                return null; // Skip items with missing products
              }
              return {
                id: dbItem.id, // Use the database ID as the CartItem ID
                product: product,
                quantity: dbItem.quantity,
                size: dbItem.size || undefined,
                color: dbItem.color || undefined,
                addedAt: new Date(dbItem.created_at), // Convert timestamp
              };
            }).filter((item): item is CartItem => item !== null); // Type guard to filter out nulls
            
            setItems(cartItems);
          }
        } catch (error: any) {
          console.error('Unexpected error fetching cart items:', error);
          toast({
            title: "Erro inesperado ao carregar carrinho",
            description: error.message,
            variant: "destructive",
          });
           setItems([]); // Clear items on error
        } finally {
          setLoading(false);
        }
      } else if (!user) {
         // Clear cart if user logs out
         setItems([]);
      }
    };

    fetchCartItems();
  }, [user, toast, products]); // Depend on products loading

  // addToCart logic from GitHub version
  const addToCart = useCallback(async (product: Product, size?: string, color?: string, quantity: number = 1) => {
    if (!user) {
      toast({ title: "Login necessário", description: "Faça login para adicionar itens ao carrinho.", variant: "default" });
      return;
    }
    setLoading(true);
    try {
      // Check if item with same product, size, and color already exists
      const existingItem = items.find(item => 
        item.product.id === product.id && 
        item.size === (size || undefined) && 
        item.color === (color || undefined)
      );

      if (existingItem) {
        // Update quantity of existing item
        const newQuantity = existingItem.quantity + quantity;
        await updateQuantity(existingItem.id, newQuantity); // Use existing item ID
      } else {
        // Insert new item
        const newItemDb = {
          id: uuidv4(), // Generate new UUID for the database row
          product_id: product.id,
          user_id: user.id,
          quantity: quantity,
          size: size || null,
          color: color || null,
        };

        const { data, error } = await supabase
          .from('cart_items')
          .insert([newItemDb])
          .select('*')
          .single();

        if (error) throw error;

        // Add to local state
        setItems(prevItems => [...prevItems, {
          id: data.id, // Use the returned database ID
          product: product,
          quantity: data.quantity,
          size: data.size || undefined,
          color: data.color || undefined,
          addedAt: new Date(data.created_at),
        }]);
        toast({ title: "✅ Produto adicionado!", description: `${product.name} adicionado.` });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({ title: "❌ Erro", description: "Não foi possível adicionar ao carrinho.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast, items, updateQuantity]); // Added items and updateQuantity dependency

  // removeFromCart logic from GitHub version
  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return; // Should not happen if item exists, but good practice
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id); // Ensure user owns the item

      if (error) throw error;

      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      // Optional: Add success toast
      // toast({ title: "Produto removido" }); 
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({ title: "❌ Erro", description: "Não foi possível remover o item.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // updateQuantity logic from GitHub version (matches expected signature)
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(itemId); // Remove if quantity is zero or less
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id) // Ensure user owns the item
        .select('*')
        .single();

      if (error) throw error;

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: data.quantity } : item
        )
      );
      // Optional: Add success toast
      // toast({ title: "Quantidade atualizada" });
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      toast({ title: "❌ Erro", description: "Não foi possível atualizar a quantidade.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast, removeFromCart]); // Added removeFromCart dependency

  // clearCart logic from GitHub version
  const clearCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      toast({ title: "🗑️ Carrinho limpo!" });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({ title: "❌ Erro", description: "Não foi possível limpar o carrinho.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Return the state and functions matching CartContextType
  return {
    items,
    itemCount,
    total,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};

