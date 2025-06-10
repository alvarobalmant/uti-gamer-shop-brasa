
import { PageLayoutItem } from './types';
import { supabase } from '@/integrations/supabase/client';

// Utility functions for page layout operations
export const createLayoutOperations = (
  pageLayouts: Record<string, PageLayoutItem[]>,
  setPageLayouts: React.Dispatch<React.SetStateAction<Record<string, PageLayoutItem[]>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  // Convert database row to PageLayoutItem
  const convertToPageLayoutItem = (dbItem: any): PageLayoutItem => ({
    id: dbItem.id,
    page_id: dbItem.page_id,
    section_key: dbItem.section_key,
    title: dbItem.title,
    display_order: dbItem.display_order,
    is_visible: dbItem.is_visible,
    section_type: dbItem.section_type,
    section_config: dbItem.section_config,
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at,
  });

  // Carregar layout de uma página específica
  const fetchPageLayout = async (pageId: string) => {
    try {
      console.log("Fetching layout for pageId:", pageId);
      const { data, error } = await supabase
        .from("page_layout_items")
        .select("*")
        .eq("page_id", pageId)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched layout data:", data);

      const convertedData = (data || []).map(convertToPageLayoutItem);
      setPageLayouts((prev) => ({ ...prev, [pageId]: convertedData }));
      setError(null);
      return convertedData;
    } catch (err) {
      const errorMsg = `Erro ao carregar layout da página ${pageId}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
      setError(errorMsg);
      console.error(errorMsg, err);
      return [];
    }
  };

  // Atualizar layout de uma página
  const updatePageLayout = async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    try {
      console.log("Updating page layout for pageId:", pageId, "with items:", layoutItems);
      
      // Atualiza os itens existentes e insere novos
      const updates = layoutItems.map(item => ({
        id: item.id,
        page_id: pageId,
        section_key: item.section_key,
        title: item.title,
        display_order: item.display_order,
        is_visible: item.is_visible,
        section_type: item.section_type,
        section_config: item.section_config,
      }));

      console.log("Prepared updates:", updates);

      const { data, error } = await supabase
        .from("page_layout_items")
        .upsert(updates, { onConflict: "id" })
        .select();

      if (error) {
        console.error("Supabase upsert error:", error);
        throw error;
      }

      console.log("Upsert successful, returned data:", data);

      const convertedData = (data || []).map(convertToPageLayoutItem);
      setPageLayouts(prev => ({ ...prev, [pageId]: convertedData }));
      setError(null);
      return data;
    } catch (err) {
      const errorMsg = `Erro ao atualizar layout da página ${pageId}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
      setError(errorMsg);
      console.error(errorMsg, err);
      throw err;
    }
  };

  // Adicionar uma nova seção ao layout
  const addPageSection = async (pageId: string, section: Omit<PageLayoutItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newSection = {
        id: newId,
        page_id: pageId,
        section_key: section.section_key,
        title: section.title,
        display_order: section.display_order,
        is_visible: section.is_visible,
        section_type: section.section_type,
        section_config: section.section_config,
      };

      console.log("Attempting to add new section:", newSection);
      
      const { data, error } = await supabase
        .from("page_layout_items")
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Insert successful, returned data:", data);

      if (data) {
        const convertedItem = convertToPageLayoutItem(data);
        setPageLayouts((prev) => ({
          ...prev,
          [pageId]: [...(prev[pageId] || []), convertedItem],
        }));
        setError(null);
        return convertedItem;
      } else {
        throw new Error("Erro ao adicionar seção: Nenhum dado retornado após a inserção.");
      }
    } catch (err) {
      const errorMsg = `Erro ao adicionar seção à página ${pageId}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
      setError(errorMsg);
      console.error(errorMsg, err);
      throw err;
    }
  };

  // Remover uma seção do layout
  const removePageSection = async (pageId: string, sectionId: string) => {
    try {
      console.log("Removing section:", sectionId, "from page:", pageId);
      
      const { error } = await supabase
        .from("page_layout_items")
        .delete()
        .eq("id", sectionId)
        .eq("page_id", pageId);

      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }

      console.log("Delete successful");

      setPageLayouts((prev) => ({
        ...prev,
        [pageId]: prev[pageId]?.filter((item) => item.id !== sectionId) || [],
      }));
      setError(null);
      return true;
    } catch (err) {
      const errorMsg = `Erro ao remover seção ${sectionId} da página ${pageId}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
      setError(errorMsg);
      console.error(errorMsg, err);
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
