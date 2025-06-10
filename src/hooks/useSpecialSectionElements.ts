
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SpecialSectionElement, SpecialSectionElementCreateInput, SpecialSectionElementUpdateInput } from '@/types/specialSections';

export const useSpecialSectionElements = (specialSectionId?: string) => {
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchElements = useCallback(async () => {
    if (!specialSectionId) {
      setElements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('special_section_elements')
        .select('*')
        .eq('special_section_id', specialSectionId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      
      // Transform the data to match our SpecialSectionElement type
      const transformedData = (data || []).map(element => ({
        ...element,
        content_ids: Array.isArray(element.content_ids) 
          ? element.content_ids.filter((id): id is string => typeof id === 'string')
          : [],
        background_type: element.background_type as 'color' | 'image' | 'gradient' | 'transparent' | undefined,
      }));
      
      setElements(transformedData);
    } catch (err: any) {
      console.error('Error fetching special section elements:', err);
      toast({ title: 'Erro', description: 'Não foi possível carregar os elementos da seção especial.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [specialSectionId, toast]);

  const addElement = async (elementData: SpecialSectionElementCreateInput) => {
    try {
      const { data: newElement, error } = await supabase
        .from('special_section_elements')
        .insert([{
          ...elementData,
          content_ids: elementData.content_ids || []
        }])
        .select()
        .single();

      if (error) throw error;
      if (!newElement) throw new Error('Failed to create special section element, no data returned.');

      await fetchElements(); // Refetch to update the list

      toast({
        title: 'Elemento criado com sucesso!',
      });
      return newElement;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar elemento',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateElement = async (id: string, updates: SpecialSectionElementUpdateInput) => {
    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .update({
          ...updates,
          content_ids: updates.content_ids || []
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchElements();

      toast({
        title: 'Elemento atualizado com sucesso!',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar elemento',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteElement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchElements();

      toast({
        title: 'Elemento removido com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover elemento',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return {
    elements,
    loading,
    refetch: fetchElements,
    addElement,
    updateElement,
    deleteElement,
  };
};
