
import { useState, useEffect, useCallback } from 'react';
import { PrimePage, PrimePageLayoutItem } from './usePrimePages/types';
import { createPrimePageOperations } from './usePrimePages/primePageOperations';
import { createPrimeLayoutOperations } from './usePrimePages/primeLayoutOperations';

// Export types for backward compatibility
export type { PrimePage, PrimePageLayoutItem } from './usePrimePages/types';

// Hook to manage Prime pages
export const usePrimePages = () => {
  const [pages, setPages] = useState<PrimePage[]>([]);
  const [pageLayouts, setPageLayouts] = useState<Record<string, PrimePageLayoutItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create operation utilities
  const pageOps = createPrimePageOperations(setPages, setError);
  const layoutOps = createPrimeLayoutOperations(pageLayouts, setPageLayouts, setError);

  // Optimized function to fetch pages
  const fetchPages = useCallback(async () => {
    if (isInitialized) return; // Avoid unnecessary reloads
    
    setLoading(true);
    try {
      await pageOps.fetchPages();
      setIsInitialized(true);
    } catch (err) {
      console.error('Erro ao carregar páginas Prime:', err);
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Optimized function to fetch layout
  const fetchPageLayout = useCallback(async (pageId: string) => {
    // Avoid reloading existing layout
    if (pageLayouts[pageId]) {
      return pageLayouts[pageId];
    }

    try {
      return await layoutOps.fetchPageLayout(pageId);
    } catch (err) {
      console.error('Erro ao carregar layout Prime:', err);
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
  const createPage = useCallback(async (pageData: Omit<PrimePage, 'id' | 'created_at' | 'updated_at'>) => {
    return pageOps.createPage(pageData);
  }, []);

  const updatePage = useCallback(async (id: string, pageData: Partial<Omit<PrimePage, 'id' | 'created_at' | 'updated_at'>>) => {
    return pageOps.updatePage(id, pageData);
  }, []);

  const deletePage = useCallback(async (id: string) => {
    return pageOps.deletePage(id);
  }, []);

  const updatePageLayout = useCallback(async (pageId: string, layoutItems: Partial<PrimePageLayoutItem>[]) => {
    return layoutOps.updatePageLayout(pageId, layoutItems);
  }, [pageLayouts]);

  const addPageSection = useCallback(async (pageId: string, section: Omit<PrimePageLayoutItem, 'id' | 'created_at' | 'updated_at'>) => {
    return layoutOps.addPageSection(pageId, section);
  }, [pageLayouts]);

  const removePageSection = useCallback(async (pageId: string, sectionId: string) => {
    return layoutOps.removePageSection(pageId, sectionId);
  }, [pageLayouts]);

  // Load pages on initialization (only once)
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
