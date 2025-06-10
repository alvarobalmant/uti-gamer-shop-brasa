
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
        .from('page_layout_items')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const layout: PageLayoutItem[] = (data || []).map(section => ({
        id: section.id,
        pageId: section.page_id,
        sectionKey: section.section_key,
        title: section.title || '',
        displayOrder: section.display_order,
        isVisible: section.is_visible,
        sectionType: section.section_type as 'banner' | 'products' | 'featured' | 'custom',
        sectionConfig: section.section_config || {}
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
      // Update each section
      const updatePromises = layoutItems.map(async (item) => {
        if (!item.id) return null;

        const { data, error } = await supabase
          .from('page_layout_items')
          .update({
            title: item.title,
            display_order: item.displayOrder,
            is_visible: item.isVisible,
            section_type: item.sectionType,
            section_config: item.sectionConfig
          })
          .eq('id', item.id)
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
        .from('page_layout_items')
        .insert([{
          page_id: pageId,
          section_type: section.sectionType,
          section_key: section.sectionKey,
          title: section.title,
          display_order: section.displayOrder,
          is_visible: section.isVisible,
          section_config: section.sectionConfig
        }])
        .select()
        .single();

      if (error) throw error;

      const newSection: PageLayoutItem = {
        id: data.id,
        pageId: data.page_id,
        sectionKey: data.section_key,
        title: data.title || '',
        displayOrder: data.display_order,
        isVisible: data.is_visible,
        sectionType: data.section_type as 'banner' | 'products' | 'featured' | 'custom',
        sectionConfig: data.section_config || {}
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
  const removePageSection = async (pageId: string, sectionId: string) => {
    try {
      const { error } = await supabase
        .from('page_layout_items')
        .delete()
        .eq('id', sectionId)
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
