
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user favorites
  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Erro ao carregar lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  // Add product to favorites
  const addToFavorites = async (productId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar aos favoritos');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) throw error;
      
      toast.success('Produto adicionado aos favoritos!');
      loadFavorites(); // Reload favorites
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Erro ao adicionar aos favoritos');
    }
  };

  // Remove product from favorites
  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      toast.success('Produto removido dos favoritos!');
      loadFavorites(); // Reload favorites
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Erro ao remover dos favoritos');
    }
  };

  // Check if product is in favorites
  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId);
  };

  // Toggle favorite status
  const toggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites
  };
};
