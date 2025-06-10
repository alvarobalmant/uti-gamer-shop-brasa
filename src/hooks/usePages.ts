
import { useState, useEffect, useCallback } from 'react';
import { Page, PageLayoutItem } from './usePages/types';
import { createPageOperations } from './usePages/pageOperations';
import { createLayoutOperations } from './usePages/layoutOperations';

// Export types for backward compatibility
export type { Page, PageLayoutItem, PageTheme, PageFilter } from './usePages/types';

// Hook para gerenciar páginas dinâmicas
export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageLayouts, setPageLayouts] = useState<Record<string, PageLayoutItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create operation utilities
  const pageOps = createPageOperations(setPages, setError);
  const layoutOps = createLayoutOperations(pageLayouts, setPageLayouts, setError);

  // Função otimizada para buscar páginas
  const fetchPages = useCallback(async () => {
    if (isInitialized) return; // Evita recarregamentos desnecessários
    
    setLoading(true);
    try {
      await pageOps.fetchPages();
      setIsInitialized(true);
    } catch (err) {
      console.error('Erro ao carregar páginas:', err);
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Função otimizada para buscar layout
  const fetchPageLayout = useCallback(async (pageId: string) => {
    // Evita recarregar layout já existente
    if (pageLayouts[pageId] && pageLayouts[pageId].length > 0) {
      console.log("Layout already exists for page:", pageId, pageLayouts[pageId]);
      return pageLayouts[pageId];
    }

    console.log("Fetching new layout for page:", pageId);
    try {
      return await layoutOps.fetchPageLayout(pageId);
    } catch (err) {
      console.error('Erro ao carregar layout:', err);
      return [];
    }
  }, [pageLayouts]);

  // Memoized functions that depend on current pages state
  const getPageBySlug = useCallback((slug: string) => {
    return pageOps.getPageBySlug(pages, slug);
  }, [pages]);

  const getPageById = useCallback((id: string) => {
    return pageOps.getPageById(pages, id);
  }, [pages]);

  // Wrapper functions for operations that don't need loading state management
  const createPage = useCallback(async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    return pageOps.createPage(pageData);
  }, []);

  const updatePage = useCallback(async (id: string, pageData: Partial<Omit<Page, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return pageOps.updatePage(id, pageData);
  }, []);

  const deletePage = useCallback(async (id: string) => {
    return pageOps.deletePage(id);
  }, []);

  const updatePageLayout = useCallback(async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    return layoutOps.updatePageLayout(pageId, layoutItems);
  }, []);

  const addPageSection = useCallback(async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    return layoutOps.addPageSection(pageId, section);
  }, []);

  const removePageSection = useCallback(async (pageId: string, sectionId: string) => {
    return layoutOps.removePageSection(pageId, sectionId);
  }, []);

  // Carregar páginas ao inicializar (apenas uma vez)
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    pages,
    pageLayouts,
    loading,
    error,
    fetchPages,
    fetchPageLayout,
    getPageBySlug,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    updatePageLayout,
    addPageSection,
    removePageSection
  };
};
