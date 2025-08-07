import { useCallback, useEffect } from 'react';
import { useUltraAggressiveCache } from './useUltraAggressiveCache';
import { useOptimizedHomepageLayout } from './useOptimizedHomepageLayout';
import { useOptimizedProducts } from './useOptimizedProducts';
import { fetchProductsFromDatabaseCached } from './useProducts/productApiOptimized';
import { supabase } from '@/integrations/supabase/client';

// Fetch function for layout data
const fetchOptimizedHomepageLayout = async () => {
  const { data, error } = await supabase
    .from('view_homepage_layout_complete')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data || [];
};

/**
 * Ultra-aggressive caching specifically for homepage data
 * Eliminates database queries on subsequent visits
 */
export const useHomepageUltraCache = () => {
  const ultraCache = useUltraAggressiveCache({
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    persistentStorage: true,
    enableCacheWarming: true,
    enablePrefetching: true,
    version: '1.1.0', // Increment when data structure changes
  });

  // Use optimized hooks with ultra-aggressive caching
  const layoutQuery = useOptimizedHomepageLayout();
  const productsQuery = useOptimizedProducts();

  /**
   * Get homepage layout with ultra-aggressive caching
   */
  const getHomepageLayout = useCallback(() => {
    const layoutKey = ['homepage_layout_optimized'];
    
    // Try ultra cache first
    const cachedLayout = ultraCache.getCachedData(layoutKey);
    if (cachedLayout) {
      return {
        data: cachedLayout,
        loading: false,
        error: null,
        isFromCache: true,
      };
    }

    // Return live query data
    if (layoutQuery.layoutItems && !layoutQuery.isLoading) {
      ultraCache.setCachedData(layoutKey, layoutQuery.layoutItems);
    }

    return {
      data: layoutQuery.layoutItems,
      loading: layoutQuery.isLoading,
      error: layoutQuery.error,
      isFromCache: false,
    };
  }, [ultraCache, layoutQuery]);

  /**
   * Get products with ultra-aggressive caching
   */
  const getProducts = useCallback(() => {
    const productsKey = ['products_optimized'];
    
    // Try ultra cache first
    const cachedProducts = ultraCache.getCachedData(productsKey);
    if (cachedProducts) {
      return {
        data: cachedProducts,
        loading: false,
        error: null,
        isFromCache: true,
      };
    }

    // Return live query data
    if (productsQuery.data && !productsQuery.isLoading) {
      ultraCache.setCachedData(productsKey, productsQuery.data);
    }

    return {
      data: productsQuery.data,
      loading: productsQuery.isLoading,
      error: productsQuery.error,
      isFromCache: false,
    };
  }, [ultraCache, productsQuery]);

  /**
   * Prefetch homepage data for instant loading
   */
  const prefetchHomepageData = useCallback(async () => {
    console.log('[HomepageUltraCache] 🚀 Prefetching homepage data...');
    
    await Promise.allSettled([
      ultraCache.prefetchAndCache(['homepage_layout_optimized'], fetchOptimizedHomepageLayout),
      ultraCache.prefetchAndCache(['products_optimized'], () => fetchProductsFromDatabaseCached()),
    ]);
    
    console.log('[HomepageUltraCache] ✅ Prefetch complete');
  }, [ultraCache]);

  /**
   * Warm up cache on app initialization
   */
  const warmHomepageCache = useCallback(async () => {
    await ultraCache.warmCache({
      homepage_layout_optimized: fetchOptimizedHomepageLayout,
      products_optimized: () => fetchProductsFromDatabaseCached(),
    });
  }, [ultraCache]);

  /**
   * Check if homepage data is available in cache
   */
  const hasHomepageCached = useCallback(() => {
    const layoutCached = ultraCache.getCachedData(['homepage_layout_optimized']) !== null;
    const productsCached = ultraCache.getCachedData(['products_optimized']) !== null;
    
    return {
      layout: layoutCached,
      products: productsCached,
      both: layoutCached && productsCached,
    };
  }, [ultraCache]);

  /**
   * Invalidate homepage cache (use sparingly)
   */
  const invalidateHomepageCache = useCallback(() => {
    console.log('[HomepageUltraCache] 🗑️ Invalidating homepage cache...');
    
    // Clear from localStorage
    localStorage.removeItem('ultra_cache_homepage_layout_optimized');
    localStorage.removeItem('ultra_cache_products_optimized');
    
    console.log('[HomepageUltraCache] ✅ Cache invalidated');
  }, []);

  // Warm cache on component mount
  useEffect(() => {
    warmHomepageCache();
  }, [warmHomepageCache]);

  return {
    // Data access
    getHomepageLayout,
    getProducts,
    
    // Cache management
    prefetchHomepageData,
    warmHomepageCache,
    hasHomepageCached,
    invalidateHomepageCache,
    
    // Stats and debugging
    getCacheStats: ultraCache.getCacheStats,
    
    // Raw queries (for fallback)
    layoutQuery,
    productsQuery,
  };
};