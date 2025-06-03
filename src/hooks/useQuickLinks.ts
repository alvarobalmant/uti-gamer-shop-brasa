
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface QuickLink {
  id: string;
  label: string;
  icon_url?: string;
  path: string;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useQuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuickLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('quick_links')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      setQuickLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching quick links:', err);
      setError('Falha ao carregar links rápidos.');
      setQuickLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllQuickLinksForAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('quick_links')
        .select('*')
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      setQuickLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching all quick links:', err);
      setError('Falha ao carregar todos os links rápidos.');
      setQuickLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuickLink = useCallback(async (linkData: Omit<QuickLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('quick_links')
<<<<<<< HEAD
        .insert([linkData])
=======
        .insert([{
          ...linkData,
          icon_url: linkData.icon_url || ''
        }])
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Link rápido adicionado com sucesso.' 
      });

      await fetchAllQuickLinksForAdmin();
      return data;
    } catch (err: any) {
      console.error('Error adding quick link:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao adicionar link rápido.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchAllQuickLinksForAdmin]);

  const updateQuickLink = useCallback(async (id: string, linkData: Partial<Omit<QuickLink, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('quick_links')
        .update(linkData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Link rápido atualizado com sucesso.' 
      });

      await fetchAllQuickLinksForAdmin();
      return data;
    } catch (err: any) {
      console.error('Error updating quick link:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar link rápido.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchAllQuickLinksForAdmin]);

  const deleteQuickLink = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Link rápido removido com sucesso.' 
      });

      await fetchAllQuickLinksForAdmin();
    } catch (err: any) {
      console.error('Error deleting quick link:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover link rápido.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchAllQuickLinksForAdmin]);

  useEffect(() => {
    fetchQuickLinks();
  }, [fetchQuickLinks]);

  return { 
    quickLinks, 
    loading, 
    error, 
    fetchQuickLinks, 
    fetchAllQuickLinksForAdmin,
    addQuickLink,
    updateQuickLink,
    deleteQuickLink
  };
};
