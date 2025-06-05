
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
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .select('*')
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
      const { data, error } = await supabase
        .from('special_sections')
        .insert([sectionData])
        .select()
        .single();

      if (error) throw error;

      setSections(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating special section:', error);
      throw error;
    }
  };

  const updateSection = async (id: string, sectionData: Partial<SpecialSection>) => {
    try {
      const { data, error } = await supabase
        .from('special_sections')
        .update(sectionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...data } : section
      ));
      return data;
    } catch (error) {
      console.error('Error updating special section:', error);
      throw error;
    }
  };

  const deleteSection = async (id: string) => {
    try {
      // First delete all elements in this section
      const { error: elementsError } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('special_section_id', id);

      if (elementsError) throw elementsError;

      // Then delete the section
      const { error } = await supabase
        .from('special_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSections(prev => prev.filter(section => section.id !== id));
      setElements(prev => prev.filter(element => element.special_section_id !== id));
    } catch (error) {
      console.error('Error deleting special section:', error);
      throw error;
    }
  };

  const createElement = async (elementData: Partial<SpecialSectionElement>) => {
    try {
      const { data, error } = await supabase
        .from('special_section_elements')
        .insert([elementData])
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
