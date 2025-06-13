<<<<<<< HEAD

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
=======

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SpecialSectionElement } from '@/types/specialSections';

export const useSpecialSectionElements = (specialSectionId?: string) => {
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElements = async () => {
    if (!specialSectionId) {
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
      setElements([]);
      setLoading(false);
      return;
    }

<<<<<<< HEAD
    setLoading(true);
    setError(null);
    try {
=======
    try {
      setLoading(true);
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
      const { data, error: fetchError } = await supabase
        .from('special_section_elements')
        .select('*')
        .eq('special_section_id', specialSectionId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
<<<<<<< HEAD
      
      // Transform the data to handle content_ids as string array
      const transformedData = (data || []).map(element => ({
        ...element,
        content_ids: Array.isArray(element.content_ids) 
          ? element.content_ids 
          : element.content_ids 
            ? [element.content_ids as string] 
            : []
      }));
      
      setElements(transformedData);
    } catch (err: any) {
      console.error('Error fetching special section elements:', err);
      setError('Falha ao carregar os elementos da seção.');
      toast({ title: 'Erro', description: 'Não foi possível carregar os elementos.', variant: 'destructive' });
=======

      // Map the database data to frontend format
      const mappedElements: SpecialSectionElement[] = (data || []).map(item => ({
        id: item.id,
        special_section_id: item.special_section_id,
        element_type: item.element_type as SpecialSectionElement['element_type'],
        title: item.title || undefined,
        subtitle: item.subtitle || undefined,
        image_url: item.image_url || undefined,
        link_url: item.link_url || undefined,
        link_text: item.link_text || undefined,
        display_order: item.display_order || 0,
        is_active: item.is_active ?? true,
        background_type: (item.background_type as SpecialSectionElement['background_type']) || 'transparent',
        background_color: item.background_color || '#FFFFFF',
        background_image_url: item.background_image_url || undefined,
        background_gradient: item.background_gradient || undefined,
        text_color: item.text_color || '#000000',
        button_color: item.button_color || undefined,
        button_text_color: item.button_text_color || undefined,
        content_type: item.content_type || undefined,
        content_ids: Array.isArray(item.content_ids) ? item.content_ids.filter(id => typeof id === 'string') as string[] : [],
        grid_position: item.grid_position || undefined,
        grid_size: item.grid_size || undefined,
        width_percentage: item.width_percentage || undefined,
        height_desktop: item.height_desktop || undefined,
        height_mobile: item.height_mobile || undefined,
        visible_items_desktop: item.visible_items_desktop || 4,
        visible_items_tablet: item.visible_items_tablet || 3,
        visible_items_mobile: item.visible_items_mobile || 1,
        padding: item.padding || 20,
        margin_bottom: item.margin_bottom || 30,
        border_radius: item.border_radius || 0,
        mobile_settings: item.mobile_settings || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setElements(mappedElements);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching special section elements:', err);
      setError(err.message || 'Erro ao carregar elementos da seção especial');
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
    } finally {
      setLoading(false);
    }
  }, [sectionId, toast]);

<<<<<<< HEAD
  const addElement = useCallback(async (elementData: SpecialSectionElementCreateInput) => {
    if (!sectionId) return; // Should not happen if called correctly
    setLoading(true);
    try {
      const elementWithType = {
        ...elementData,
        special_section_id: sectionId,
        element_type: elementData.element_type || 'banner' // Ensure element_type is provided
      };

      const { data, error: insertError } = await supabase
        .from('special_section_elements')
        .insert([elementWithType])
        .select();

      if (insertError) throw insertError;
      if (data) {
        await fetchElements(); // Refetch for simplicity and consistency
        toast({ title: 'Sucesso', description: 'Elemento adicionado à seção.' });
      }
    } catch (err: any) {
      console.error('Error adding special section element:', err);
      setError('Falha ao adicionar o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível adicionar o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
=======
  const addElement = async (elementData: Omit<SpecialSectionElement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('special_section_elements')
        .insert({
          special_section_id: elementData.special_section_id,
          element_type: elementData.element_type,
          title: elementData.title,
          subtitle: elementData.subtitle,
          image_url: elementData.image_url,
          link_url: elementData.link_url,
          link_text: elementData.link_text,
          display_order: elementData.display_order,
          is_active: elementData.is_active,
          background_type: elementData.background_type,
          background_color: elementData.background_color,
          background_image_url: elementData.background_image_url,
          background_gradient: elementData.background_gradient,
          text_color: elementData.text_color,
          button_color: elementData.button_color,
          button_text_color: elementData.button_text_color,
          content_type: elementData.content_type,
          content_ids: elementData.content_ids || [],
          grid_position: elementData.grid_position,
          grid_size: elementData.grid_size,
          width_percentage: elementData.width_percentage,
          height_desktop: elementData.height_desktop,
          height_mobile: elementData.height_mobile,
          visible_items_desktop: elementData.visible_items_desktop,
          visible_items_tablet: elementData.visible_items_tablet,
          visible_items_mobile: elementData.visible_items_mobile,
          padding: elementData.padding,
          margin_bottom: elementData.margin_bottom,
          border_radius: elementData.border_radius,
          mobile_settings: elementData.mobile_settings
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchElements();
      return data;
    } catch (err: any) {
      console.error('Error creating special section element:', err);
      setError(err.message || 'Erro ao criar elemento da seção especial');
      throw err;
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
    }
  }, [sectionId, toast, fetchElements]);

<<<<<<< HEAD
  const updateElement = useCallback(async (elementId: string, elementData: SpecialSectionElementUpdateInput) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('special_section_elements')
        .update(elementData)
        .eq('id', elementId);

      if (updateError) throw updateError;

      await fetchElements(); // Refetch for simplicity
      toast({ title: 'Sucesso', description: 'Elemento atualizado.' });
    } catch (err: any) {
      console.error('Error updating special section element:', err);
      setError('Falha ao atualizar o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível atualizar o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
=======
  const updateElement = async (id: string, elementData: Partial<SpecialSectionElement>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('special_section_elements')
        .update({
          element_type: elementData.element_type,
          title: elementData.title,
          subtitle: elementData.subtitle,
          image_url: elementData.image_url,
          link_url: elementData.link_url,
          link_text: elementData.link_text,
          display_order: elementData.display_order,
          is_active: elementData.is_active,
          background_type: elementData.background_type,
          background_color: elementData.background_color,
          background_image_url: elementData.background_image_url,
          background_gradient: elementData.background_gradient,
          text_color: elementData.text_color,
          button_color: elementData.button_color,
          button_text_color: elementData.button_text_color,
          content_type: elementData.content_type,
          content_ids: elementData.content_ids || [],
          grid_position: elementData.grid_position,
          grid_size: elementData.grid_size,
          width_percentage: elementData.width_percentage,
          height_desktop: elementData.height_desktop,
          height_mobile: elementData.height_mobile,
          visible_items_desktop: elementData.visible_items_desktop,
          visible_items_tablet: elementData.visible_items_tablet,
          visible_items_mobile: elementData.visible_items_mobile,
          padding: elementData.padding,
          margin_bottom: elementData.margin_bottom,
          border_radius: elementData.border_radius,
          mobile_settings: elementData.mobile_settings
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchElements();
      return data;
    } catch (err: any) {
      console.error('Error updating special section element:', err);
      setError(err.message || 'Erro ao atualizar elemento da seção especial');
      throw err;
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
    }
  }, [toast, fetchElements]);

<<<<<<< HEAD
  const deleteElement = useCallback(async (elementId: string) => {
    setLoading(true);
=======
  const deleteElement = async (id: string) => {
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
    try {
      const { error: deleteError } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', elementId);

      if (deleteError) throw deleteError;

<<<<<<< HEAD
      await fetchElements(); // Refetch for simplicity
      toast({ title: 'Sucesso', description: 'Elemento excluído.' });
    } catch (err: any) {
      console.error('Error deleting special section element:', err);
      setError('Falha ao excluir o elemento.');
      toast({ title: 'Erro', description: 'Não foi possível excluir o elemento.', variant: 'destructive' });
    } finally {
      setLoading(false);
=======
      await fetchElements();
      return true;
    } catch (err: any) {
      console.error('Error deleting special section element:', err);
      setError(err.message || 'Erro ao excluir elemento da seção especial');
      throw err;
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
    }
  }, [toast, fetchElements]);

  // Initial fetch when sectionId is available
  useEffect(() => {
    fetchElements();
<<<<<<< HEAD
  }, [fetchElements]);

  return { elements, setElements, loading, error, fetchElements, addElement, updateElement, deleteElement };
=======
  }, [specialSectionId]);

  return {
    elements,
    loading,
    error,
    fetchElements,
    addElement,
    updateElement,
    deleteElement
  };
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
};
