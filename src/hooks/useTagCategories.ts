import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TagCategoryEnum = 
  | 'platform' 
  | 'product_type' 
  | 'game_title' 
  | 'console_model' 
  | 'brand' 
  | 'accessory_type' 
  | 'collectible' 
  | 'clothing' 
  | 'genre' 
  | 'feature' 
  | 'edition' 
  | 'condition' 
  | 'physical_attribute' 
  | 'generic';

export interface TagCategory {
  id: string;
  name: string;
  category_enum: TagCategoryEnum;
  default_weight: number;
  description?: string;
  color: string;
  icon_emoji: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useTagCategories = () => {
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('Buscando categorias de tags...');
      
      const { data, error } = await supabase
        .from('tag_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }

      console.log('Categorias encontradas:', data);
      setCategories(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Omit<TagCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tag_categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data as TagCategory].sort((a, b) => a.display_order - b.display_order));

      toast({
        title: "Categoria adicionada com sucesso!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar categoria",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<TagCategory>) => {
    try {
      const { data, error } = await supabase
        .from('tag_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      toast({ title: 'Categoria atualizada com sucesso!' });
      return data;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar categoria', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tag_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Categoria removida com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover categoria",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};