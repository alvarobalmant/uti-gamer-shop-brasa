
import { useState, useEffect, useCallback } from 'react';
import { Page, PageLayoutItem } from './usePages/types';
import { createPageOperations } from './usePages/pageOperations';
import { createLayoutOperations } from './usePages/layoutOperations';

// Export types for backward compatibility
export type { Page, PageLayoutItem, PageTheme, PageFilter } from './usePages/types';

// Hook to manage dynamic pages with better cache invalidation
export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageLayouts, setPageLayouts] = useState<Record<string, PageLayoutItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create operation utilities
  const pageOps = createPageOperations(setPages, setError);
  const layoutOps = createLayoutOperations(pageLayouts, setPageLayouts, setError);

  // Force refresh function to clear cache and reload data
  const forceRefresh = useCallback(async () => {
    console.log('[usePages] Force refreshing all data...');
    setPageLayouts({});
    setIsInitialized(false);
    setLoading(true);
    
    try {
      await pageOps.fetchPages();
      setIsInitialized(true);
    } catch (err) {
      console.error('Erro ao recarregar páginas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized function to fetch pages
  const fetchPages = useCallback(async () => {
    if (isInitialized) return;
    
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

  // Enhanced function to fetch layout with cache invalidation
  const fetchPageLayout = useCallback(async (pageId: string, forceReload = false) => {
    console.log(`[usePages] Fetching layout for page ${pageId}, forceReload: ${forceReload}`);
    
    // Skip cache if forceReload is true
    if (!forceReload && pageLayouts[pageId]) {
      console.log(`[usePages] Returning cached layout for page ${pageId}`);
      return pageLayouts[pageId];
    }

    try {
      const result = await layoutOps.fetchPageLayout(pageId);
      console.log(`[usePages] Fetched fresh layout for page ${pageId}:`, result);
      return result;
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

  // Enhanced wrapper functions with cache invalidation
  const createPage = useCallback(async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await pageOps.createPage(pageData);
    await forceRefresh(); // Invalidate cache after creation
    return result;
  }, [forceRefresh]);

  const updatePage = useCallback(async (id: string, pageData: Partial<Omit<Page, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const result = await pageOps.updatePage(id, pageData);
    await forceRefresh(); // Invalidate cache after update
    return result;
  }, [forceRefresh]);

  const deletePage = useCallback(async (id: string) => {
    const result = await pageOps.deletePage(id);
    await forceRefresh(); // Invalidate cache after deletion
    return result;
  }, [forceRefresh]);

  const updatePageLayout = useCallback(async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    const result = await layoutOps.updatePageLayout(pageId, layoutItems);
    // Force reload this specific page layout
    await fetchPageLayout(pageId, true);
    return result;
  }, [fetchPageLayout]);

  const addPageSection = useCallback(async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    const result = await layoutOps.addPageSection(pageId, section);
    // Force reload this specific page layout
    await fetchPageLayout(pageId, true);
    return result;
  }, [fetchPageLayout]);

  const removePageSection = useCallback(async (pageId: string, sectionId: string) => {
    const result = await layoutOps.removePageSection(pageId, sectionId);
    // Force reload this specific page layout
    await fetchPageLayout(pageId, true);
    return result;
  }, [fetchPageLayout]);

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
    removePageSection,
    forceRefresh
  };
};
