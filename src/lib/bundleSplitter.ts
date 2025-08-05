/**
 * Advanced bundle splitting utilities for optimal loading
 * This helps reduce initial bundle size by lazy loading non-critical dependencies
 */

import { logger } from './productionLogger';

// Lazy load React Query only when needed
export const loadReactQuery = async () => {
  try {
    const { QueryClient, QueryClientProvider, useQuery, useMutation } = await import('@tanstack/react-query');
    logger.debug('React Query loaded lazily');
    return { QueryClient, QueryClientProvider, useQuery, useMutation };
  } catch (error) {
    logger.error('Failed to load React Query', error);
    throw error;
  }
};

// Lazy load chart libraries
export const loadChartLibrary = async () => {
  try {
    const recharts = await import('recharts');
    logger.debug('Recharts loaded lazily');
    return recharts;
  } catch (error) {
    logger.error('Failed to load recharts', error);
    throw error;
  }
};

// Lazy load admin components (placeholder for future implementation)
export const loadAdminComponents = async () => {
  try {
    // TODO: Implement when admin components are created
    logger.debug('Admin components would be loaded lazily');
    return {};
  } catch (error) {
    logger.error('Failed to load admin components', error);
    throw error;
  }
};

// Lazy load form libraries
export const loadFormLibraries = async () => {
  try {
    const [hookForm, zod] = await Promise.all([
      import('react-hook-form'),
      import('zod')
    ]);
    logger.debug('Form libraries loaded lazily');
    return { hookForm, zod };
  } catch (error) {
    logger.error('Failed to load form libraries', error);
    throw error;
  }
};

// Platform-specific code splitting (placeholder for future implementation)
export const loadPlatformSpecificCode = async (platform: 'mobile' | 'desktop' | 'tablet') => {
  try {
    // TODO: Implement when platform-specific components are created
    logger.debug(`${platform} specific code would be loaded lazily`);
    return {};
  } catch (error) {
    logger.error(`Failed to load ${platform} specific code`, error);
    return null;
  }
};

// Network-aware loading
export const getOptimalLoadingStrategy = () => {
  const connection = (navigator as any).connection;
  
  if (!connection) {
    return 'standard';
  }

  const { effectiveType, downlink, rtt } = connection;
  
  // Aggressive optimization for slow connections
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'minimal';
  }
  
  // Conservative loading for 3G
  if (effectiveType === '3g' || downlink < 1.5) {
    return 'conservative';
  }
  
  // Full loading for fast connections
  if (effectiveType === '4g' && downlink > 10 && rtt < 100) {
    return 'aggressive';
  }
  
  return 'standard';
};

// Intelligent preloading based on user behavior
export class IntelligentBundleLoader {
  private loadedBundles = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();
  
  async loadBundle(bundleName: string, loader: () => Promise<any>) {
    if (this.loadedBundles.has(bundleName)) {
      return; // Already loaded
    }
    
    if (this.loadingPromises.has(bundleName)) {
      return this.loadingPromises.get(bundleName); // Already loading
    }
    
    const loadingStrategy = getOptimalLoadingStrategy();
    
    // Skip non-essential bundles on slow connections
    if (loadingStrategy === 'minimal' && this.isNonEssential(bundleName)) {
      logger.debug(`Skipping non-essential bundle ${bundleName} due to slow connection`);
      return;
    }
    
    const loadPromise = loader().then(result => {
      this.loadedBundles.add(bundleName);
      this.loadingPromises.delete(bundleName);
      logger.debug(`Bundle ${bundleName} loaded successfully`);
      return result;
    }).catch(error => {
      this.loadingPromises.delete(bundleName);
      logger.error(`Failed to load bundle ${bundleName}`, error);
      throw error;
    });
    
    this.loadingPromises.set(bundleName, loadPromise);
    return loadPromise;
  }
  
  private isNonEssential(bundleName: string): boolean {
    const nonEssentialBundles = [
      'admin',
      'charts',
      'analytics',
      'advanced-forms'
    ];
    return nonEssentialBundles.includes(bundleName);
  }
  
  preloadOnIdle(bundleName: string, loader: () => Promise<any>) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadBundle(bundleName, loader);
      });
    } else {
      setTimeout(() => {
        this.loadBundle(bundleName, loader);
      }, 1000);
    }
  }
  
  getStats() {
    return {
      loadedBundles: Array.from(this.loadedBundles),
      loadingBundles: Array.from(this.loadingPromises.keys()),
      totalLoaded: this.loadedBundles.size,
      currentlyLoading: this.loadingPromises.size
    };
  }
}

export const bundleLoader = new IntelligentBundleLoader();