<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
=======

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
import { toast } from 'sonner';

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
<<<<<<< HEAD
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    promotional_price?: number;
    uti_pro_price?: number;
  };
=======
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
}

export const useFavorites = () => {
  const { user } = useAuth();
<<<<<<< HEAD
  const queryClient = useQueryClient();

  // Buscar favoritos do usuário
  const {
    data: favorites = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          user_id,
          product_id,
          created_at,
          product:products (
            id,
            name,
            price,
            image,
            slug,
            promotional_price,
            uti_pro_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar favoritos:', error);
        throw error;
      }

      return data as UserFavorite[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Adicionar produto aos favoritos
  const addToFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
=======
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
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
        .from('user_favorites')
        .insert({
          user_id: user.id,
          product_id: productId
<<<<<<< HEAD
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Produto já está nos favoritos');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Produto adicionado aos favoritos!');
    },
    onError: (error: Error) => {
      console.error('Erro ao adicionar favorito:', error);
      if (error.message === 'Produto já está nos favoritos') {
        toast.info('Este produto já está na sua lista de desejos');
      } else {
        toast.error('Erro ao adicionar aos favoritos');
      }
    }
  });

  // Remover produto dos favoritos
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

=======
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
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
<<<<<<< HEAD
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Produto removido dos favoritos');
    },
    onError: (error) => {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover dos favoritos');
    }
  });

  // Verificar se produto está nos favoritos
  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  // Toggle favorito (adicionar se não existe, remover se existe)
  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Faça login para adicionar aos favoritos');
      return;
    }

    if (isFavorite(productId)) {
      removeFromFavoritesMutation.mutate(productId);
    } else {
      addToFavoritesMutation.mutate(productId);
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    isAddingToFavorites: addToFavoritesMutation.isPending,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    favoritesCount: favorites.length
  };
};

=======
      
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
>>>>>>> a08235d3a56d734c06d5e45b7a55a52a13c49cf3
