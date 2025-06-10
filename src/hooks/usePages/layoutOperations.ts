
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
<<<<<<< HEAD
      console.log("Fetching layout for pageId:", pageId);
      const { data, error } = await supabase
        .from("page_layout_items")
        .select("*")
        .eq("page_id", pageId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      console.log("Fetched data:", data);

      setPageLayouts((prev) => ({ ...prev, [pageId]: data || [] }));
=======
      const { data, error } = await supabase
        .from('page_layout_items')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const layout: PageLayoutItem[] = (data || []).map(section => ({
        id: section.id,
        page_id: section.page_id,
        section_key: section.section_key,
        title: section.title || '',
        display_order: section.display_order,
        is_visible: section.is_visible,
        section_type: section.section_type as 'banner' | 'products' | 'featured' | 'custom',
        section_config: section.section_config || {}
      }));

      setPageLayouts(prev => ({ ...prev, [pageId]: layout }));
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
      setError(null);
      return data || [];
    } catch (err) {
      setError(`Erro ao carregar layout da página ${pageId}`);
      console.error(err);
      return [];
    }
  };

  // Atualizar layout de uma página
  const updatePageLayout = async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    try {
<<<<<<< HEAD
      // Atualiza os itens existentes e insere novos
      const updates = layoutItems.map(item => {
        const { id, pageId, sectionKey, displayOrder, isVisible, sectionType, sectionConfig } = item;
        return {
          id,
          page_id: pageId,
          section_key: sectionKey,
          display_order: displayOrder,
          is_visible: isVisible,
          section_type: sectionType,
          section_config: sectionConfig,
        };
      });

      const { error } = await supabase
        .from("page_layout_items")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      setPageLayouts(prev => ({ ...prev, [pageId]: layoutItems as PageLayoutItem[] }));
      return layoutItems;
=======
      // Update each section
      const updatePromises = layoutItems.map(async (item) => {
        if (!item.id) return null;

        const { data, error } = await supabase
          .from('page_layout_items')
          .update({
            title: item.title,
            display_order: item.display_order,
            is_visible: item.is_visible,
            section_type: item.section_type,
            section_config: item.section_config
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
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
    } catch (err) {
      setError(`Erro ao atualizar layout da página ${pageId}`);
      console.error(err);
      throw err;
    }
  };

  // Adicionar uma nova seção ao layout
  const addPageSection = async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    try {
<<<<<<< HEAD
      const newId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newSection: PageLayoutItem = {
        ...section,
        id: newId,
        page_id: pageId,
        section_key: section.sectionKey,
        display_order: section.displayOrder,
        is_visible: section.isVisible,
        section_type: section.sectionType,
        section_config: section.sectionConfig,
      };

      console.log("Attempting to add new section:", newSection);
      const { data, error } = await supabase
        .from("page_layout_items")
        .insert(newSection)
        .select();

      console.log("Supabase insert data:", data);
      console.log("Supabase insert error:", error);

      if (error) throw error;

      if (data && data.length > 0) {
        setPageLayouts((prev) => ({
          ...prev,
          [pageId]: [...(prev[pageId] || []), data[0]],
        }));
        return data[0];
      } else {
        throw new Error("Erro ao adicionar seção: Nenhum dado retornado após a inserção.");
      }
=======
      const { data, error } = await supabase
        .from('page_layout_items')
        .insert([{
          page_id: pageId,
          section_type: section.section_type,
          section_key: section.section_key,
          title: section.title,
          display_order: section.display_order,
          is_visible: section.is_visible,
          section_config: section.section_config
        }])
        .select()
        .single();

      if (error) throw error;

      const newSection: PageLayoutItem = {
        id: data.id,
        page_id: data.page_id,
        section_key: data.section_key,
        title: data.title || '',
        display_order: data.display_order,
        is_visible: data.is_visible,
        section_type: data.section_type as 'banner' | 'products' | 'featured' | 'custom',
        section_config: data.section_config || {}
      };
      
      const currentLayout = pageLayouts[pageId] || [];
      const updatedLayout = [...currentLayout, newSection];
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      
      return newSection;
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
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
<<<<<<< HEAD
        .from("page_layout_items")
        .delete()
        .eq("id", sectionId)
        .eq("page_id", pageId);

      if (error) throw error;

      setPageLayouts((prev) => ({
        ...prev,
        [pageId]: prev[pageId]?.filter((item) => item.id !== sectionId) || [],
      }));
=======
        .from('page_layout_items')
        .delete()
        .eq('id', sectionId)
        .eq('page_id', pageId);

      if (error) throw error;
      
      const currentLayout = pageLayouts[pageId] || [];
      const updatedLayout = currentLayout.filter(item => item.id !== sectionId);
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      
>>>>>>> 2a7be71a14c09c0620955a61b86c872ec27417c8
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
