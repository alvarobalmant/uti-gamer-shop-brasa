
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    promotional_price?: number;
    uti_pro_price?: number;
    description?: string;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar favoritos do usuário
  const {
    data: favorites = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      console.log('🔍 Buscando favoritos para usuário:', user?.id);
      
      if (!user?.id) {
        console.log('❌ Usuário não autenticado, retornando array vazio');
        return [];
      }

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

      console.log('📥 Favoritos encontrados:', { data, error, count: data?.length });

      if (error) {
        console.error('Erro ao buscar favoritos:', error);
        throw error;
      }

       // Mapear para o formato esperado
       const mapped = data?.map((item: any) => ({
         id: item.id,
         user_id: item.user_id,
         product_id: item.product_id,
         created_at: item.created_at,
         product: item.product ? {
           id: item.product.id,
           name: item.product.name || '',
           price: Number(item.product.price) || 0,
           image: item.product.image || '',
           slug: item.product.slug || '',
           promotional_price: item.product.promotional_price ? Number(item.product.promotional_price) : undefined,
           uti_pro_price: item.product.uti_pro_price ? Number(item.product.uti_pro_price) : undefined,
         } : null
       })) || [];
       return mapped as UserFavorite[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Adicionar produto aos favoritos
  const addToFavoritesMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('🔄 addToFavoritesMutation iniciado:', { productId, userId: user?.id });
      
      if (!user?.id) {
        console.log('❌ Usuário não autenticado na mutation');
        throw new Error('Usuário não autenticado');
      }

      console.log('📤 Enviando para Supabase...');
      
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        })
        .select()
        .single();

      console.log('📥 Resposta do Supabase:', { data, error });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('Produto já está nos favoritos');
        }
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Favorito adicionado com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Produto adicionado aos favoritos!');
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao adicionar favorito:', error);
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
      console.log('🔄 removeFromFavoritesMutation iniciado:', { productId, userId: user?.id });
      
      if (!user?.id) {
        console.log('❌ Usuário não autenticado na mutation de remoção');
        throw new Error('Usuário não autenticado');
      }

      console.log('📤 Removendo do Supabase...');

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      console.log('📥 Resposta do Supabase (remoção):', { error });

      if (error) throw error;
    },
    onSuccess: () => {
      console.log('✅ Favorito removido com sucesso');
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Produto removido dos favoritos');
    },
    onError: (error) => {
      console.error('❌ Erro ao remover favorito:', error);
      toast.error('Erro ao remover dos favoritos');
    }
  });

  // Verificar se produto está nos favoritos
  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId);
  };

  // Toggle favorito (adicionar se não existe, remover se existe)
  const toggleFavorite = async (productId: string) => {
    console.log('🔄 toggleFavorite chamado:', { productId, user: user?.id });
    
    if (!user) {
      console.log('❌ Usuário não autenticado');
      toast.error('Faça login para adicionar aos favoritos');
      return;
    }

    const isCurrentlyFavorite = isFavorite(productId);
    console.log('💖 Status atual:', { isCurrentlyFavorite, favoritesCount: favorites.length });

    if (isCurrentlyFavorite) {
      console.log('🗑️ Removendo dos favoritos');
      removeFromFavoritesMutation.mutate(productId);
    } else {
      console.log('➕ Adicionando aos favoritos');
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
