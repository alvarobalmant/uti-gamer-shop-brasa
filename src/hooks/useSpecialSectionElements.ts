
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SpecialSectionElement } from '@/types/specialSections';

export const useSpecialSectionElements = (sectionId?: string) => {
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchElements = async () => {
    if (!sectionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .select('*')
        .eq('special_section_id', sectionId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Transform the data to match our interface with proper type handling
      const transformedData = (data || []).map(item => ({
        ...item,
        content_ids: Array.isArray(item.content_ids) 
          ? item.content_ids.map(id => String(id))
          : [],
        background_type: (['transparent', 'color', 'gradient', 'image'].includes(item.background_type)) 
          ? item.background_type as SpecialSectionElement['background_type']
          : 'transparent',
        content_type: (['products', 'tags', 'manual'].includes(item.content_type))
          ? item.content_type as SpecialSectionElement['content_type']
          : undefined,
      })) as SpecialSectionElement[];

      setElements(transformedData);
    } catch (err: any) {
      console.error('Error fetching elements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, [sectionId]);

  const addElement = async (elementData: Omit<SpecialSectionElement, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .insert([elementData])
        .select('*')
        .single();

      if (error) throw error;

      // Transform the response data with proper typing
      const transformedElement = {
        ...data,
        content_ids: Array.isArray(data.content_ids) 
          ? data.content_ids.map(id => String(id))
          : [],
        background_type: (['transparent', 'color', 'gradient', 'image'].includes(data.background_type)) 
          ? data.background_type as SpecialSectionElement['background_type']
          : 'transparent',
        content_type: (['products', 'tags', 'manual'].includes(data.content_type))
          ? data.content_type as SpecialSectionElement['content_type']
          : undefined,
      } as SpecialSectionElement;

      setElements(prev => [...prev, transformedElement]);
      toast({
        title: "Elemento criado",
        description: "O elemento foi criado com sucesso."
      });
    } catch (err: any) {
      console.error('Error creating element:', err);
      setError(err.message);
      toast({
        title: "Erro ao criar elemento",
        description: "Ocorreu um erro ao criar o elemento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateElement = async (id: string, elementData: Partial<SpecialSectionElement>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .update(elementData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Transform the response data with proper typing
      const transformedElement = {
        ...data,
        content_ids: Array.isArray(data.content_ids) 
          ? data.content_ids.map(id => String(id))
          : [],
        background_type: (['transparent', 'color', 'gradient', 'image'].includes(data.background_type)) 
          ? data.background_type as SpecialSectionElement['background_type']
          : 'transparent',
        content_type: (['products', 'tags', 'manual'].includes(data.content_type))
          ? data.content_type as SpecialSectionElement['content_type']
          : undefined,
      } as SpecialSectionElement;

      setElements(prev =>
        prev.map(element => (element.id === id ? { ...element, ...transformedElement } : element))
      );
      toast({
        title: "Elemento atualizado",
        description: "O elemento foi atualizado com sucesso."
      });
    } catch (err: any) {
      console.error('Error updating element:', err);
      setError(err.message);
      toast({
        title: "Erro ao atualizar elemento",
        description: "Ocorreu um erro ao atualizar o elemento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteElement = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setElements(prev => prev.filter(element => element.id !== id));
      toast({
        title: "Elemento excluído",
        description: "O elemento foi excluído com sucesso."
      });
    } catch (err: any) {
      console.error('Error deleting element:', err);
      setError(err.message);
      toast({
        title: "Erro ao excluir elemento",
        description: "Ocorreu um erro ao excluir o elemento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    elements,
    loading,
    error,
    fetchElements,
    addElement, // Changed from createElement to addElement for consistency
    updateElement,
    deleteElement
  };
};
