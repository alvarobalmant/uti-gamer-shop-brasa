
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductSection {
  id: string;
  title: string;
  view_all_link?: string;
  created_at?: string;
  updated_at?: string;
  items?: ProductSectionItem[];
}

export interface ProductSectionItem {
  id: number;
  item_id: string;
  item_type: 'product' | 'tag';
  display_order?: number;
  section_id: string;
}

export interface ProductSectionInput {
  title: string;
  view_all_link?: string;
}

export type SectionItemType = 'product' | 'tag';

export const useProductSections = () => {
  const [productSections, setProductSections] = useState<ProductSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select(`
          *,
          product_section_items(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const sectionsWithItems = data?.map(section => ({
        ...section,
        items: section.product_section_items || []
      })) || [];

      setProductSections(sectionsWithItems);
    } catch (err: any) {
      console.error('Error fetching product sections:', err);
      setError('Falha ao carregar seções de produtos.');
      setProductSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductSectionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select(`
          *,
          product_section_items(*)
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return {
        ...data,
        items: data.product_section_items || []
      };
    } catch (err: any) {
      console.error(`Error fetching product section with ID ${id}:`, err);
      setError(`Falha ao carregar seção de produtos com ID ${id}.`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (sectionData: ProductSectionInput) => {
    try {
      const { data, error: insertError } = await supabase
        .from('product_sections')
        .insert([sectionData])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção criada com sucesso.' 
      });

      await fetchProductSections();
      return data;
    } catch (err: any) {
      console.error('Error creating section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao criar seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  const updateSection = useCallback(async (id: string, sectionData: Partial<ProductSectionInput>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('product_sections')
        .update(sectionData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção atualizada com sucesso.' 
      });

      await fetchProductSections();
      return data;
    } catch (err: any) {
      console.error('Error updating section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  const deleteSection = useCallback(async (id: string) => {
    try {
      // First delete related items
      await supabase
        .from('product_section_items')
        .delete()
        .eq('section_id', id);

      // Then delete the section
      const { error: deleteError } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Seção removida com sucesso.' 
      });

      await fetchProductSections();
    } catch (err: any) {
      console.error('Error deleting section:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover seção.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProductSections]);

  useEffect(() => {
    fetchProductSections();
  }, [fetchProductSections]);

  return { 
    productSections,
    sections: productSections, // Alias for compatibility
    loading, 
    error, 
    fetchProductSections,
    fetchSections: fetchProductSections, // Alias for compatibility
    fetchProductSectionById,
    createSection,
    updateSection,
    deleteSection
  };
};
