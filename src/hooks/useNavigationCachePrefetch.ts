import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHomepageUltraCache } from './useHomepageUltraCache';

/**
 * Optimizes navigation by prefetching homepage data when navigating from product pages
 * Ensures instant loading when returning to homepage
 */
export const useNavigationCachePrefetch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prefetchHomepageData, hasHomepageCached } = useHomepageUltraCache();

  /**
   * Prefetch homepage data when on product pages
   */
  const prefetchHomepageOnProductPage = useCallback(async () => {
    const isProductPage = location.pathname.startsWith('/produto/');
    
    if (isProductPage) {
      const cached = hasHomepageCached();
      if (!cached.both) {
        console.log('[NavigationCache] 🔄 Prefetching homepage from product page...');
        await prefetchHomepageData();
      } else {
        console.log('[NavigationCache] ✅ Homepage already cached');
      }
    }
  }, [location.pathname, prefetchHomepageData, hasHomepageCached]);

  /**
   * Enhanced navigate function with cache awareness
   */
  const navigateWithCache = useCallback((path: string, options?: any) => {
    // If navigating to homepage, ensure data is prefetched
    if (path === '/' || path === '/homepage') {
      const cached = hasHomepageCached();
      if (cached.both) {
        console.log('[NavigationCache] ⚡ Instant navigation to cached homepage');
      } else {
        console.log('[NavigationCache] 🔄 Navigation to homepage (will cache)');
      }
    }
    
    navigate(path, options);
  }, [navigate, hasHomepageCached]);

  /**
   * Preload critical routes based on user behavior
   */
  const preloadCriticalRoutes = useCallback(async () => {
    const isHomepage = location.pathname === '/' || location.pathname === '/homepage';
    
    if (isHomepage) {
      // On homepage, we're already good
      console.log('[NavigationCache] 🏠 On homepage, data ready');
    } else {
      // On other pages, prefetch homepage
      await prefetchHomepageOnProductPage();
    }
  }, [location.pathname, prefetchHomepageOnProductPage]);

  // Monitor navigation and prefetch accordingly
  useEffect(() => {
    preloadCriticalRoutes();
  }, [preloadCriticalRoutes]);

  // Prefetch on user interactions that suggest navigation intent
  useEffect(() => {
    const handleMouseEnter = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href="/"], a[href="/homepage"]');
      
      if (link) {
        const cached = hasHomepageCached();
        if (!cached.both) {
          console.log('[NavigationCache] 🎯 Prefetching on hover...');
          await prefetchHomepageData();
        }
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, { capture: true });
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, { capture: true });
    };
  }, [prefetchHomepageData, hasHomepageCached]);

  return {
    navigateWithCache,
    prefetchHomepageData,
    hasHomepageCached,
    preloadCriticalRoutes,
  };
};