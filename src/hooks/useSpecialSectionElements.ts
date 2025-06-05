import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SpecialSectionElement, SpecialSectionElementCreateInput, SpecialSectionElementUpdateInput } from '@/types/specialSections';

export const useSpecialSectionElements = (sectionId: string | null) => {
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchElements = useCallback(async () => {
    if (!sectionId) {
      setElements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('special_section_elements')
        .select('*')
        .eq('special_section_id', sectionId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setElements(data || []);
    } catch (err: any) {
      console.error('Error fetching special section elements:', err);
      setError('Falha ao carregar os elementos da seção.');
      toast({ title: 'Erro', description: 'Não foi possível carregar os elementos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [sectionId, toast]);

  const addElement = useCallback(async (elementData: SpecialSectionElementCreateInput) => {
    if (!sectionId) return; // Should not happen if called correctly
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('special_section_elements')
        .insert([{ ...elementData, special_section_id: sectionId }])
        .select();

      if (insertError) throw insertError;
      if (data) {
        // Add to local state optimistically or refetch
        // setElements(prev => [...prev, ...data].sort((a, b) => a.display_order - b.display_order));
        await fetchElements(); // Refetch for simplicity and consistency
        toast({ title: 'Sucesso', description: 'Elemento adicionado à seção.' });
      }
    } catch (err: any) {
      console.error('Error adding special section element:', err);
      setError('Falha ao adicionar o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível adicionar o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [sectionId, toast, fetchElements]);

  const updateElement = useCallback(async (elementId: string, elementData: SpecialSectionElementUpdateInput) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('special_section_elements')
        .update(elementData)
        .eq('id', elementId);

      if (updateError) throw updateError;

      // Update local state optimistically or refetch
      // setElements(prev => prev.map(el => el.id === elementId ? { ...el, ...elementData } : el).sort((a, b) => a.display_order - b.display_order));
      await fetchElements(); // Refetch for simplicity
      toast({ title: 'Sucesso', description: 'Elemento atualizado.' });
    } catch (err: any) {
      console.error('Error updating special section element:', err);
      setError('Falha ao atualizar o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível atualizar o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchElements]);

  const deleteElement = useCallback(async (elementId: string) => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', elementId);

      if (deleteError) throw deleteError;

      // Remove from local state optimistically or refetch
      // setElements(prev => prev.filter(el => el.id !== elementId));
      await fetchElements(); // Refetch for simplicity
      toast({ title: 'Sucesso', description: 'Elemento excluído.' });
    } catch (err: any) {
      console.error('Error deleting special section element:', err);
      setError('Falha ao excluir o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível excluir o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchElements]);

  // Initial fetch when sectionId is available
  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return { elements, setElements, loading, error, fetchElements, addElement, updateElement, deleteElement };
};

