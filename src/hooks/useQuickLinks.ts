
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QuickLink {
  id: string;
  label: string;
  path: string;
  icon_url: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useQuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActiveQuickLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (error) throw error;
      
      setQuickLinks(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar quick links:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar links rápidos",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQuickLinksForAdmin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      setQuickLinks(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar todos quick links:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar links rápidos",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuickLink = async (quickLinkData: Omit<QuickLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .insert([{
          label: quickLinkData.label,
          path: quickLinkData.path,
          icon_url: quickLinkData.icon_url,
          position: quickLinkData.position,
          is_active: quickLinkData.is_active
        }])
        .select()
        .single();

      if (error) throw error;

      setQuickLinks(prev => [...prev, data].sort((a, b) => a.position - b.position));
      toast({
        title: "Link rápido adicionado com sucesso!",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao adicionar link rápido",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateQuickLink = async (id: string, quickLinkData: Partial<QuickLink>) => {
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .update(quickLinkData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setQuickLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...data } : link
      ).sort((a, b) => a.position - b.position));
      
      toast({
        title: "Link rápido atualizado com sucesso!",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar link rápido",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteQuickLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuickLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Link rápido removido com sucesso!",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao remover link rápido",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchActiveQuickLinks();
  }, []);

  return {
    quickLinks,
    loading,
    error,
    fetchActiveQuickLinks,
    fetchAllQuickLinksForAdmin,
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,
    refetch: fetchActiveQuickLinks,
  };
};
