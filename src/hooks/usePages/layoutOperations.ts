
import { PageLayoutItem } from './types';
import { initialPageLayouts } from './mockData';

// Utility functions for page layout operations
export const createLayoutOperations = (
  pageLayouts: Record<string, PageLayoutItem[]>,
  setPageLayouts: React.Dispatch<React.SetStateAction<Record<string, PageLayoutItem[]>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  // Carregar layout de uma página específica
  const fetchPageLayout = async (pageId: string) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 300));
      const layout = initialPageLayouts[pageId] || [];
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
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentLayout = pageLayouts[pageId] || [];
      
      const updatedLayout = layoutItems.map(item => {
        const existingItem = currentLayout.find(i => i.id === item.id);
        if (existingItem) {
          return { ...existingItem, ...item };
        }
        return item as PageLayoutItem;
      });
      
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout as PageLayoutItem[] }));
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
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentLayout = pageLayouts[pageId] || [];
      const newId = Math.max(0, ...currentLayout.map(item => item.id)) + 1;
      
      const newSection: PageLayoutItem = {
        ...section,
        id: newId,
        pageId
      };
      
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
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
