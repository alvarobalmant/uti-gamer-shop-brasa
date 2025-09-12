
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  category?: string | null;
  weight?: number | null;
  created_at: string;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      setLoading(true);
      console.log('Buscando tags...');
      
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('category', { ascending: true })
        .order('weight', { ascending: false, nullsFirst: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tags:', error);
        throw error;
      }

      console.log('Tags encontradas:', data);
      setTags(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar tags:', error);
      toast({
        title: "Erro ao carregar tags",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (name: string, category: string = 'generic', weight: number = 1) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name, category, weight }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => {
        const updated = [...prev, data as Tag];
        return updated.sort((a, b) => {
          const catA = (a.category || '').localeCompare(b.category || '');
          if (catA !== 0) return catA;
          const wA = (b.weight || 0) - (a.weight || 0);
          if (wA !== 0) return wA;
          return a.name.localeCompare(b.name);
        });
      });

      toast({
        title: "Tag adicionada com sucesso!",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar tag",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTag = async (id: string, updates: Partial<Pick<Tag, 'name' | 'category' | 'weight'>>) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTags(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      toast({ title: 'Tag atualizada com sucesso!' });
      return data;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar tag', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTags(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Tag removida com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover tag",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    addTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
};
