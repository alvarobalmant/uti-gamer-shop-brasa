import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  NavigationItem, 
  CreateNavigationItemData, 
  UpdateNavigationItemData,
  NavigationItemsResponse,
  NavigationItemResponse 
} from '@/types/navigation';

export const useNavigationItems = () => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os itens de navegação
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar itens de navegação:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar apenas itens visíveis (para o frontend público)
  const fetchVisibleItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('is_visible', true)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar itens visíveis:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo item
  const createItem = async (itemData: CreateNavigationItemData): Promise<NavigationItemResponse> => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      await fetchItems();
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Erro ao criar item:', err);
      return { data: null, error: err };
    }
  };

  // Atualizar item existente
  const updateItem = async (itemData: UpdateNavigationItemData): Promise<NavigationItemResponse> => {
    try {
      const { id, ...updateData } = itemData;
      
      const { data, error } = await supabase
        .from('navigation_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      await fetchItems();
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Erro ao atualizar item:', err);
      return { data: null, error: err };
    }
  };

  // Deletar item
  const deleteItem = async (id: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar lista local
      await fetchItems();
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Erro ao deletar item:', err);
      return { success: false, error: err };
    }
  };

  // Reordenar itens
  const reorderItems = async (reorderedItems: { id: string; display_order: number }[]): Promise<{ success: boolean; error: any }> => {
    try {
      // Atualizar ordem de cada item
      const updates = reorderedItems.map(item => 
        supabase
          .from('navigation_items')
          .update({ display_order: item.display_order })
          .eq('id', item.id)
      );

      await Promise.all(updates);

      // Atualizar lista local
      await fetchItems();
      
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Erro ao reordenar itens:', err);
      return { success: false, error: err };
    }
  };

  // Toggle visibilidade
  const toggleVisibility = async (id: string, isVisible: boolean): Promise<NavigationItemResponse> => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .update({ is_visible: isVisible })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      await fetchItems();
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Erro ao alterar visibilidade:', err);
      return { data: null, error: err };
    }
  };

  // Carregar itens na inicialização
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    fetchVisibleItems,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    toggleVisibility,
    refresh: fetchItems
  };
};

