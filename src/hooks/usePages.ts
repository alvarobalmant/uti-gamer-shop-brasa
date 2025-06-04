
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

  // Create operation utilities
  const pageOps = createPageOperations(setPages, setError);
  const layoutOps = createLayoutOperations(pageLayouts, setPageLayouts, setError);

  // Wrapper functions to handle loading state
  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      await pageOps.fetchPages();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPageLayout = useCallback(async (pageId: string) => {
    setLoading(true);
    try {
      return await layoutOps.fetchPageLayout(pageId);
    } finally {
      setLoading(false);
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
  }, [pageLayouts]);

  const addPageSection = useCallback(async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    return layoutOps.addPageSection(pageId, section);
  }, [pageLayouts]);

  const removePageSection = useCallback(async (pageId: string, sectionId: number) => {
    return layoutOps.removePageSection(pageId, sectionId);
  }, [pageLayouts]);

  // Carregar páginas ao inicializar
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
