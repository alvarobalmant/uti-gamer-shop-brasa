// Stub: product_section_items table removed - uses product_sections table only
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SectionItemType = 'product' | 'tag';

export interface ProductSectionItem { 
  id?: number; 
  section_id: string; 
  item_type: SectionItemType; 
  item_id: string; 
  display_order?: number; 
}

export interface ProductSection { 
  id: string; 
  title: string; 
  title_part1?: string;
  title_part2?: string;
  title_color1?: string;
  title_color2?: string;
  view_all_link?: string;
  items?: ProductSectionItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductSectionInput { 
  id?: string; 
  title: string; 
  title_part1?: string;
  title_part2?: string;
  title_color1?: string;
  title_color2?: string;
  view_all_link?: string;
  items?: { type: SectionItemType; id: string }[]; 
}

export interface HomepageLayoutItem { 
  id: number; 
  section_key: string; 
  display_order: number; 
  is_visible: boolean; 
}

export const useProductSections = () => {
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: ProductSection[] = (data || []).map(row => ({
        id: row.id,
        title: row.title,
        title_part1: row.title_part1 || undefined,
        title_part2: row.title_part2 || undefined,
        title_color1: row.title_color1 || undefined,
        title_color2: row.title_color2 || undefined,
        view_all_link: row.view_all_link || undefined,
        items: [], // Items are managed separately or via ERP
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      setSections(mapped);
      setError(null);
    } catch (err: any) {
      console.error('[useProductSections] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const createSection = async (input: ProductSectionInput): Promise<{ success: boolean; data?: ProductSection }> => {
    try {
      const { data, error: insertError } = await supabase
        .from('product_sections')
        .insert({
          title: input.title,
          title_part1: input.title_part1,
          title_part2: input.title_part2,
          title_color1: input.title_color1,
          title_color2: input.title_color2,
          view_all_link: input.view_all_link,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchSections();
      return { success: true, data: data as ProductSection };
    } catch (err: any) {
      console.error('[useProductSections] Create error:', err);
      return { success: false };
    }
  };

  const updateSection = async (idOrInput: string | Partial<ProductSectionInput>, input?: Partial<ProductSectionInput>): Promise<{ success: boolean }> => {
    // Handle legacy callers that pass (input) instead of (id, input)
    let sectionId: string;
    let updateData: Partial<ProductSectionInput>;
    
    if (typeof idOrInput === 'object') {
      // Legacy call: updateSection(input) where input has id
      sectionId = (idOrInput as any).id;
      updateData = idOrInput;
    } else {
      // Standard call: updateSection(id, input)
      sectionId = idOrInput;
      updateData = input || {};
    }
    
    if (!sectionId) {
      console.error('[useProductSections] Missing section ID');
      return { success: false };
    }
    try {
      const { error: updateError } = await supabase
        .from('product_sections')
        .update({
          title: updateData.title,
          title_part1: updateData.title_part1,
          title_part2: updateData.title_part2,
          title_color1: updateData.title_color1,
          title_color2: updateData.title_color2,
          view_all_link: updateData.view_all_link,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sectionId);

      if (updateError) throw updateError;

      await fetchSections();
      return { success: true };
    } catch (err: any) {
      console.error('[useProductSections] Update error:', err);
      return { success: false };
    }
  };

  const deleteSection = async (id: string): Promise<{ success: boolean }> => {
    try {
      const { error: deleteError } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchSections();
      return { success: true };
    } catch (err: any) {
      console.error('[useProductSections] Delete error:', err);
      return { success: false };
    }
  };

  return {
    sections,
    loading,
    error,
    fetchSections,
    createSection,
    addSection: createSection, // Alias
    updateSection,
    deleteSection,
    refreshSections: fetchSections,
  };
};