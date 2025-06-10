
import { PageLayoutItem } from './types';
import { supabase } from '@/integrations/supabase/client';

// Utility functions for page layout operations
export const createLayoutOperations = (
  pageLayouts: Record<string, PageLayoutItem[]>,
  setPageLayouts: React.Dispatch<React.SetStateAction<Record<string, PageLayoutItem[]>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  // Carregar layout de uma página específica
  const fetchPageLayout = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const layout: PageLayoutItem[] = (data || []).map(section => ({
        id: parseInt(section.id), // Convert UUID to number for compatibility
        pageId: section.page_id,
        sectionKey: `section_${section.id}`,
        title: section.title || '',
        displayOrder: section.display_order,
        isVisible: section.is_visible,
        sectionType: section.type as 'banner' | 'products' | 'featured' | 'custom',
        sectionConfig: section.config || {}
      }));

      setPageLayouts(prev => ({ ...prev, [pageId]: layout }));
      setError(null);
      return layout;
    } catch (err) {
      setError(`Erro ao carregar layout da página ${pageId}`);
      console.error(err);
      return [];
    }
  };

  // Atualizar layout de uma página
  const updatePageLayout = async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    try {
      // First, get existing sections
      const { data: existingSections, error: fetchError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId);

      if (fetchError) throw fetchError;

      // Update each section
      const updatePromises = layoutItems.map(async (item) => {
        if (!item.id) return null;

        const { data, error } = await supabase
          .from('page_sections')
          .update({
            title: item.title,
            display_order: item.displayOrder,
            is_visible: item.isVisible,
            type: item.sectionType,
            config: item.sectionConfig
          })
          .eq('id', item.id.toString())
          .eq('page_id', pageId)
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      await Promise.all(updatePromises);
      
      // Refresh the layout
      const updatedLayout = await fetchPageLayout(pageId);
      return updatedLayout;
    } catch (err) {
      setError(`Erro ao atualizar layout da página ${pageId}`);
      console.error(err);
      throw err;
    }
  };

  // Adicionar uma nova seção ao layout
  const addPageSection = async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .insert([{
          page_id: pageId,
          type: section.sectionType,
          title: section.title,
          display_order: section.displayOrder,
          is_visible: section.isVisible,
          config: section.sectionConfig
        }])
        .select()
        .single();

      if (error) throw error;

      const newSection: PageLayoutItem = {
        id: parseInt(data.id),
        pageId: data.page_id,
        sectionKey: `section_${data.id}`,
        title: data.title || '',
        displayOrder: data.display_order,
        isVisible: data.is_visible,
        sectionType: data.type as 'banner' | 'products' | 'featured' | 'custom',
        sectionConfig: data.config || {}
      };
      
      const currentLayout = pageLayouts[pageId] || [];
      const updatedLayout = [...currentLayout, newSection];
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      
      return newSection;
    } catch (err) {
      setError(`Erro ao adicionar seção à página ${pageId}`);
      console.error(err);
      throw err;
    }
  };

  // Remover uma seção do layout
  const removePageSection = async (pageId: string, sectionId: number) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId.toString())
        .eq('page_id', pageId);

      if (error) throw error;
      
      const currentLayout = pageLayouts[pageId] || [];
      const updatedLayout = currentLayout.filter(item => item.id !== sectionId);
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      
      return true;
    } catch (err) {
      setError(`Erro ao remover seção ${sectionId} da página ${pageId}`);
      console.error(err);
      throw err;
    }
  };

  return {
    fetchPageLayout,
    updatePageLayout,
    addPageSection,
    removePageSection
  };
};
