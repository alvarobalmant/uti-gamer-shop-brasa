
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  icon_url?: string;
  icon_type: 'image' | 'emoji' | 'icon';
  background_color: string;
  text_color: string;
  hover_background_color?: string;
  hover_text_color?: string;
  link_url: string;
  link_type: 'internal' | 'external';
  display_order: number;
  is_visible: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ['navigation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as NavigationItem[];
    },
  });
};

export const useNavigationItemsAdmin = () => {
  return useQuery({
    queryKey: ['navigation-items-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as NavigationItem[];
    },
  });
};

export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<NavigationItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('navigation_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      queryClient.invalidateQueries({ queryKey: ['navigation-items-admin'] });
    },
  });
};

export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NavigationItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('navigation_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      queryClient.invalidateQueries({ queryKey: ['navigation-items-admin'] });
    },
  });
};

export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation-items'] });
      queryClient.invalidateQueries({ queryKey: ['navigation-items-admin'] });
    },
  });
};
