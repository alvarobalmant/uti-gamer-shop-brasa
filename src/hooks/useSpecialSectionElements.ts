import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SpecialSectionElement } from '@/types/specialSections';
import { useToast } from '@/components/ui/use-toast';

export const useSpecialSectionElements = (sectionId?: string) => {
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to safely convert content_ids from Json to string[]
  const convertContentIds = (contentIds: any): string[] => {
    if (!contentIds) return [];
    if (Array.isArray(contentIds)) {
      return contentIds.filter(id => typeof id === 'string');
    }
    if (typeof contentIds === 'string') {
      try {
        const parsed = JSON.parse(contentIds);
        return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Helper function to convert database element to frontend format
  const convertElement = (dbElement: any): SpecialSectionElement => ({
    id: dbElement.id,
    special_section_id: dbElement.special_section_id,
    element_type: dbElement.element_type,
    title: dbElement.title,
    subtitle: dbElement.subtitle,
    image_url: dbElement.image_url,
    link_url: dbElement.link_url,
    link_text: dbElement.link_text,
    background_type: (dbElement.background_type as any) || 'color',
    background_color: dbElement.background_color,
    background_image_url: dbElement.background_image_url,
    background_gradient: dbElement.background_gradient,
    text_color: dbElement.text_color,
    button_color: dbElement.button_color,
    button_text_color: dbElement.button_text_color,
    content_type: dbElement.content_type,
    content_ids: convertContentIds(dbElement.content_ids),
    grid_position: dbElement.grid_position,
    grid_size: dbElement.grid_size,
    width_percentage: dbElement.width_percentage,
    height_desktop: dbElement.height_desktop,
    height_mobile: dbElement.height_mobile,
    padding: dbElement.padding,
    margin_bottom: dbElement.margin_bottom,
    border_radius: dbElement.border_radius,
    visible_items_desktop: dbElement.visible_items_desktop,
    visible_items_tablet: dbElement.visible_items_tablet,
    visible_items_mobile: dbElement.visible_items_mobile,
    display_order: dbElement.display_order,
    is_active: dbElement.is_active,
    mobile_settings: dbElement.mobile_settings,
    created_at: dbElement.created_at,
    updated_at: dbElement.updated_at,
  });

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

      const convertedElements = (data || []).map(convertElement);
      setElements(convertedElements);
    } catch (err: any) {
      console.error('Error fetching elements:', err);
      setError(err.message);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os elementos da seção.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new element
  const addElement = async (element: Omit<SpecialSectionElement, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .insert([element])
        .select()
        .single();

      if (error) throw error;

      const newElement = convertElement(data);
      setElements(prev => [...prev, newElement]);
      toast({
        title: 'Sucesso',
        description: 'Elemento adicionado com sucesso.',
      });
    } catch (err: any) {
      console.error('Error adding element:', err);
      setError(err.message);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o elemento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing element
  const updateElement = async (id: string, updates: Partial<SpecialSectionElement>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedElement = convertElement(data);
      setElements(prev => prev.map(el => (el.id === id ? updatedElement : el)));
      toast({
        title: 'Sucesso',
        description: 'Elemento atualizado com sucesso.',
      });
    } catch (err: any) {
      console.error('Error updating element:', err);
      setError(err.message);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o elemento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an element
  const deleteElement = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setElements(prev => prev.filter(el => el.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Elemento removido com sucesso.',
      });
    } catch (err: any) {
      console.error('Error deleting element:', err);
      setError(err.message);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o elemento.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, [sectionId]);

  return {
    elements,
    loading,
    error,
    fetchElements,
    addElement,
    updateElement,
    deleteElement,
  };
};
