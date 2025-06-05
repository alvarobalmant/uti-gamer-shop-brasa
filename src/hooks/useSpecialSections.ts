<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast'; // Corrected import path
import { supabase } from '@/integrations/supabase/client';
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';

export const useSpecialSections = () => {
  const [specialSections, setSpecialSections] = useState<SpecialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSpecialSections = useCallback(async () => {
    setLoading(true);
=======

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SpecialSection {
  id: string;
  title: string;
  description?: string;
  background_type: string;
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  padding_top?: number;
  padding_bottom?: number;
  padding_left?: number;
  padding_right?: number;
  margin_top?: number;
  margin_bottom?: number;
  border_radius?: number;
  display_order?: number;
  is_active?: boolean;
  content_config?: any;
  mobile_settings?: any;
  created_at?: string;
  updated_at?: string;
}

interface SpecialSectionElement {
  id: string;
  special_section_id: string;
  element_type: string;
  title?: string;
  subtitle?: string;
  content_type?: string;
  content_ids?: any;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  background_type?: string;
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  width_percentage?: number;
  height_desktop?: number;
  height_mobile?: number;
  padding?: number;
  margin_bottom?: number;
  border_radius?: number;
  grid_position?: string;
  grid_size?: string;
  visible_items_desktop?: number;
  visible_items_tablet?: number;
  visible_items_mobile?: number;
  display_order?: number;
  is_active?: boolean;
  mobile_settings?: any;
  created_at?: string;
  updated_at?: string;
}

export const useSpecialSections = () => {
  const [sections, setSections] = useState<SpecialSection[]>([]);
  const [elements, setElements] = useState<SpecialSectionElement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .select('*')
<<<<<<< HEAD
        .order('title', { ascending: true }); // Order by title for consistency in admin list

      if (error) throw error;
      setSpecialSections(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar seções especiais',
        description: error.message,
        variant: 'destructive',
      });
      setSpecialSections([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Function to add the section to homepage_layout
  const addSectionToLayout = async (sectionId: string) => {
    try {
      // Get the current max display_order
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from('homepage_layout')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single();

      if (maxOrderError && maxOrderError.code !== 'PGRST116') { // Ignore 'range not found' error if table is empty
          throw maxOrderError;
      }
      
      const nextOrder = maxOrderData ? maxOrderData.display_order + 1 : 0;

      // Verificar se a seção já existe no layout para evitar duplicação
      const { data: existingSection, error: checkError } = await supabase
        .from('homepage_layout')
        .select('id')
        .eq('section_key', `special_section_${sectionId}`)
        .maybeSingle();

      if (checkError) throw checkError;

      // Se a seção já existe, não insira novamente
      if (existingSection) {
        console.log(`Special section ${sectionId} already exists in homepage_layout`);
        return;
      }

      const { error: layoutInsertError } = await supabase
        .from('homepage_layout')
        .insert({
          section_key: `special_section_${sectionId}`,
          display_order: nextOrder,
          is_visible: true, // Default to visible when created
        });

      if (layoutInsertError) throw layoutInsertError;

      console.log(`Special section ${sectionId} added to homepage_layout`);

    } catch (error: any) {
      console.error('Failed to add special section to layout:', error);
      // Don't block the main operation, but log the error
      toast({
        title: 'Aviso: Falha ao adicionar seção ao layout da home',
        description: `A seção foi criada, mas pode não aparecer na organização da página inicial. Erro: ${error.message}`,
        variant: 'default', // Use default or warning variant
        duration: 7000, 
      });
    }
  };

  const addSpecialSection = async (sectionData: SpecialSectionCreateInput) => {
    // Remove display_order if it exists in the input, as it's managed by homepage_layout
    const { display_order, ...dataToInsert } = sectionData as any; 

    try {
      const { data: newSection, error } = await supabase
=======
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching special sections:', error);
      toast.error('Erro ao carregar seções especiais');
    }
  };

  const fetchElements = async () => {
    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setElements(data || []);
    } catch (error) {
      console.error('Error fetching special section elements:', error);
      toast.error('Erro ao carregar elementos das seções');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSections(), fetchElements()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createSection = async (sectionData: Partial<SpecialSection>) => {
    try {
      // Ensure required fields are present
      const dataToInsert = {
        title: sectionData.title || '',
        description: sectionData.description,
        background_type: sectionData.background_type || 'color',
        background_color: sectionData.background_color,
        background_gradient: sectionData.background_gradient,
        background_image_url: sectionData.background_image_url,
        padding_top: sectionData.padding_top,
        padding_bottom: sectionData.padding_bottom,
        padding_left: sectionData.padding_left,
        padding_right: sectionData.padding_right,
        margin_top: sectionData.margin_top,
        margin_bottom: sectionData.margin_bottom,
        border_radius: sectionData.border_radius,
        display_order: sectionData.display_order,
        is_active: sectionData.is_active,
        content_config: sectionData.content_config,
        mobile_settings: sectionData.mobile_settings,
      };

      const { data, error } = await supabase
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
        .from('special_sections')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
<<<<<<< HEAD
      if (!newSection) throw new Error('Failed to create special section, no data returned.');

      // **Add to homepage_layout after successful creation**
      await addSectionToLayout(newSection.id);

      await fetchSpecialSections(); // Refetch to update the list

      toast({
        title: 'Seção especial criada com sucesso!',
      });
      return newSection;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar seção especial',
        description: error.message,
        variant: 'destructive',
      });
=======

      setSections(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating special section:', error);
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
      throw error;
    }
  };

<<<<<<< HEAD
  const updateSpecialSection = async (id: string, updates: SpecialSectionUpdateInput) => {
     // Remove display_order if it exists in the input
    const { display_order, ...dataToUpdate } = updates as any;
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .update(dataToUpdate)
=======
  const updateSection = async (id: string, sectionData: Partial<SpecialSection>) => {
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .update(sectionData)
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

<<<<<<< HEAD
      await fetchSpecialSections();

      toast({
        title: 'Seção especial atualizada com sucesso!',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar seção especial',
        description: error.message,
        variant: 'destructive',
      });
=======
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...data } : section
      ));
      return data;
    } catch (error) {
      console.error('Error updating special section:', error);
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
      throw error;
    }
  };

<<<<<<< HEAD
  // Function to remove the section from homepage_layout
  const removeSectionFromLayout = async (sectionId: string) => {
      try {
          const { error: layoutDeleteError } = await supabase
              .from('homepage_layout')
              .delete()
              .eq('section_key', `special_section_${sectionId}`);
          
          if (layoutDeleteError) throw layoutDeleteError;
          console.log(`Special section ${sectionId} removed from homepage_layout`);
      } catch (error: any) {
          console.error('Failed to remove special section from layout:', error);
          // Log error but don't block deletion of the section itself
          toast({
              title: 'Aviso: Falha ao remover seção do layout da home',
              description: `A seção foi excluída, mas pode ainda aparecer temporariamente na organização da página inicial. Erro: ${error.message}`,
              variant: 'default',
              duration: 7000,
          });
      }
  };

  const deleteSpecialSection = async (id: string) => {
    try {
      // First, remove from layout to avoid foreign key issues if any (or just dangling refs)
      await removeSectionFromLayout(id);

      // Then, delete the section itself
=======
  const deleteSection = async (id: string) => {
    try {
      // First delete all elements in this section
      const { error: elementsError } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('special_section_id', id);

      if (elementsError) throw elementsError;

      // Then delete the section
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
      const { error } = await supabase
        .from('special_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

<<<<<<< HEAD
      await fetchSpecialSections();

      toast({
        title: 'Seção especial removida com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover seção especial',
        description: error.message,
        variant: 'destructive',
      });
=======
      setSections(prev => prev.filter(section => section.id !== id));
      setElements(prev => prev.filter(element => element.special_section_id !== id));
    } catch (error) {
      console.error('Error deleting special section:', error);
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
      throw error;
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchSpecialSections();
  }, [fetchSpecialSections]);

  return {
    specialSections,
    loading,
    refetch: fetchSpecialSections,
    addSpecialSection,
    updateSpecialSection,
    deleteSpecialSection,
  };
};

=======
  const createElement = async (elementData: Partial<SpecialSectionElement>) => {
    try {
      // Ensure required fields are present
      const dataToInsert = {
        special_section_id: elementData.special_section_id || '',
        element_type: elementData.element_type || 'banner',
        title: elementData.title,
        subtitle: elementData.subtitle,
        content_type: elementData.content_type,
        content_ids: elementData.content_ids,
        image_url: elementData.image_url,
        link_url: elementData.link_url,
        link_text: elementData.link_text,
        background_type: elementData.background_type,
        background_color: elementData.background_color,
        background_gradient: elementData.background_gradient,
        background_image_url: elementData.background_image_url,
        text_color: elementData.text_color,
        button_color: elementData.button_color,
        button_text_color: elementData.button_text_color,
        width_percentage: elementData.width_percentage,
        height_desktop: elementData.height_desktop,
        height_mobile: elementData.height_mobile,
        padding: elementData.padding,
        margin_bottom: elementData.margin_bottom,
        border_radius: elementData.border_radius,
        grid_position: elementData.grid_position,
        grid_size: elementData.grid_size,
        visible_items_desktop: elementData.visible_items_desktop,
        visible_items_tablet: elementData.visible_items_tablet,
        visible_items_mobile: elementData.visible_items_mobile,
        display_order: elementData.display_order,
        is_active: elementData.is_active,
        mobile_settings: elementData.mobile_settings,
      };

      const { data, error } = await supabase
        .from('special_section_elements')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      setElements(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating special section element:', error);
      throw error;
    }
  };

  const updateElement = async (id: string, elementData: Partial<SpecialSectionElement>) => {
    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .update(elementData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setElements(prev => prev.map(element => 
        element.id === id ? { ...element, ...data } : element
      ));
      return data;
    } catch (error) {
      console.error('Error updating special section element:', error);
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

      setElements(prev => prev.filter(element => element.id !== id));
    } catch (error) {
      console.error('Error deleting special section element:', error);
      throw error;
    }
  };

  return {
    sections,
    elements,
    loading,
    fetchData,
    createSection,
    updateSection,
    deleteSection,
    createElement,
    updateElement,
    deleteElement,
  };
};
>>>>>>> bd49f3b49065df2bbc5b430822c2d2a5b13e95b5
