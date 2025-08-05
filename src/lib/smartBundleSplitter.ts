/**
 * Phase 4B: Smart Bundle Splitting
 * Advanced lazy loading with intelligent chunking strategies
 */

import { logger } from './productionLogger';
import { bundleLoader } from './bundleSplitter';

// Lazy React Query with intelligent caching
export const loadReactQuerySmart = async () => {
  return bundleLoader.loadBundle('react-query', async () => {
    const { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } = 
      await import('@tanstack/react-query');
    
    logger.debug('React Query loaded with smart bundling');
    return { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient };
  });
};

// Modular Radix UI loading - only load what's needed
export const loadRadixComponents = async (components: string[]) => {
  const loadedComponents: Record<string, any> = {};
  
  const componentMap: Record<string, () => Promise<any>> = {
    dialog: () => import('@radix-ui/react-dialog'),
    dropdown: () => import('@radix-ui/react-dropdown-menu'),
    select: () => import('@radix-ui/react-select'),
    tabs: () => import('@radix-ui/react-tabs'),
    toast: () => import('@radix-ui/react-toast'),
    popover: () => import('@radix-ui/react-popover'),
    accordion: () => import('@radix-ui/react-accordion'),
    avatar: () => import('@radix-ui/react-avatar'),
    checkbox: () => import('@radix-ui/react-checkbox'),
    label: () => import('@radix-ui/react-label'),
    progress: () => import('@radix-ui/react-progress'),
    separator: () => import('@radix-ui/react-separator'),
    slider: () => import('@radix-ui/react-slider'),
    switch: () => import('@radix-ui/react-switch'),
    tooltip: () => import('@radix-ui/react-tooltip'),
  };

  for (const component of components) {
    if (componentMap[component]) {
      try {
        loadedComponents[component] = await componentMap[component]();
        logger.debug(`Radix ${component} loaded modularly`);
      } catch (error) {
        logger.error(`Failed to load Radix ${component}`, error);
      }
    }
  }

  return loadedComponents;
};

// Platform-specific code splitting
export const loadPlatformBundle = async (platform: 'mobile' | 'desktop' | 'tablet') => {
  return bundleLoader.loadBundle(`platform-${platform}`, async () => {
    switch (platform) {
      case 'mobile':
        return {
          // Placeholder for mobile-specific utilities
          platform: 'mobile',
        };
      
      case 'desktop':
        return {
          // Placeholder for desktop-specific utilities
          platform: 'desktop',
        };
      
      case 'tablet':
        return {
          // Placeholder for tablet-specific utilities
          platform: 'tablet',
        };
      
      default:
        return {};
    }
  });
};

// Detect device type for intelligent platform loading
export const detectPlatform = (): 'mobile' | 'desktop' | 'tablet' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTouchDevice = 'ontouchstart' in window;
  const screenWidth = window.innerWidth;

  if (isTouchDevice) {
    if (screenWidth < 768) return 'mobile';
    if (screenWidth < 1024) return 'tablet';
  }

  if (/android|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)) {
    return screenWidth < 768 ? 'mobile' : 'tablet';
  }

  return 'desktop';
};

// Admin-only bundle with strict isolation
export const loadAdminBundle = async () => {
  return bundleLoader.loadBundle('admin-complete', async () => {
    const [
      adminComponents,
      excelLibs,
      aiLibs
    ] = await Promise.all([
      import('@/components/Admin/LazyAdminTabs'),
      import('xlsx'),
      import('@huggingface/transformers').catch(() => null), // Optional AI features
    ]);

    logger.debug('Complete admin bundle loaded');
    return {
      adminComponents,
      excel: excelLibs,
      ai: aiLibs,
    };
  });
};

// Feature-specific lazy loading with dependencies
export const loadFeatureBundle = async (feature: string) => {
  const featureMap: Record<string, () => Promise<any>> = {
    search: async () => {
      // Placeholder for search components
      return { searchEnabled: true };
    },
    
    products: async () => {
      // Placeholder for product components
      return { productsEnabled: true };
    },
    
    charts: async () => {
      return bundleLoader.loadBundle('charts', () => import('recharts'));
    },
    
    forms: async () => {
      const [hookForm, zod, resolvers] = await Promise.all([
        import('react-hook-form'),
        import('zod'),
        import('@hookform/resolvers/zod'),
      ]);
      return { hookForm, zod, resolvers };
    },
    
    coins: async () => {
      // Placeholder for UTI coins components
      return { coinsEnabled: true };
    },
  };

  if (featureMap[feature]) {
    return bundleLoader.loadBundle(`feature-${feature}`, featureMap[feature]);
  }

  logger.warn(`Unknown feature: ${feature}`);
  return null;
};

// Network-aware progressive loading
export class ProgressiveLoader {
  private loadedFeatures = new Set<string>();
  private platform: 'mobile' | 'desktop' | 'tablet';

  constructor() {
    this.platform = detectPlatform();
    this.initProgressiveLoading();
  }

  private async initProgressiveLoading() {
    // Load platform-specific code first
    await loadPlatformBundle(this.platform);
    
    // Load core features based on platform
    if (this.platform === 'mobile') {
      await this.loadMobileEssentials();
    } else {
      await this.loadDesktopEssentials();
    }
  }

  private async loadMobileEssentials() {
    const essentials = ['search', 'products'];
    for (const feature of essentials) {
      await loadFeatureBundle(feature);
      this.loadedFeatures.add(feature);
    }
  }

  private async loadDesktopEssentials() {
    const essentials = ['search', 'products', 'charts'];
    await Promise.all(
      essentials.map(async feature => {
        await loadFeatureBundle(feature);
        this.loadedFeatures.add(feature);
      })
    );
  }

  async preloadFeature(feature: string) {
    if (this.loadedFeatures.has(feature)) {
      return;
    }

    bundleLoader.preloadOnIdle(`feature-${feature}`, () => loadFeatureBundle(feature));
  }

  getLoadedFeatures() {
    return Array.from(this.loadedFeatures);
  }
}

export const progressiveLoader = new ProgressiveLoader();