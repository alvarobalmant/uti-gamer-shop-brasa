/**
 * Smart bundle loading hook with React integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  loadReactQuerySmart, 
  loadRadixComponents, 
  loadPlatformBundle, 
  loadAdminBundle,
  loadFeatureBundle,
  detectPlatform,
  progressiveLoader
} from '@/lib/smartBundleSplitter';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/productionLogger';

interface BundleState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useSmartBundle = <T>(
  bundleLoader: () => Promise<T>,
  options: {
    condition?: () => boolean;
    preload?: boolean;
    priority?: 'high' | 'normal' | 'low';
  } = {}
) => {
  const [state, setState] = useState<BundleState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { condition = () => true, preload = false, priority = 'normal' } = options;
  const loadedRef = useRef(false);

  const loadBundle = useCallback(async () => {
    if (!condition() || loadedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await bundleLoader();
      setState({ data, loading: false, error: null });
      loadedRef.current = true;
      logger.debug('Smart bundle loaded successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Bundle loading failed');
      setState({ data: null, loading: false, error: err });
      logger.error('Smart bundle loading failed', err);
    }
  }, [bundleLoader, condition]);

  useEffect(() => {
    if (preload && condition()) {
      const delay = priority === 'high' ? 0 : priority === 'normal' ? 100 : 500;
      
      if (delay === 0) {
        loadBundle();
      } else {
        const timer = setTimeout(loadBundle, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [loadBundle, preload, priority, condition]);

  return {
    ...state,
    loadBundle,
    isReady: !!state.data && !state.loading && !state.error,
  };
};

// Specialized hooks for common bundles
export const useReactQuery = (options: { preload?: boolean } = {}) => {
  return useSmartBundle(loadReactQuerySmart, {
    preload: options.preload,
    priority: 'high',
  });
};

export const useRadixBundle = (components: string[], options: { preload?: boolean } = {}) => {
  return useSmartBundle(
    () => loadRadixComponents(components),
    {
      preload: options.preload,
      priority: 'normal',
    }
  );
};

export const usePlatformBundle = (options: { preload?: boolean } = {}) => {
  const platform = detectPlatform();
  
  return useSmartBundle(
    () => loadPlatformBundle(platform),
    {
      preload: options.preload,
      priority: 'high',
    }
  );
};

export const useAdminBundle = (options: { preload?: boolean } = {}) => {
  const { isAdmin, user, loading: authLoading } = useAuth();

  return useSmartBundle(loadAdminBundle, {
    condition: () => !authLoading && !!user && isAdmin,
    preload: options.preload,
    priority: 'normal',
  });
};

export const useFeatureBundle = (
  feature: string, 
  options: { 
    preload?: boolean; 
    condition?: () => boolean;
    priority?: 'high' | 'normal' | 'low';
  } = {}
) => {
  return useSmartBundle(
    () => loadFeatureBundle(feature),
    {
      condition: options.condition,
      preload: options.preload,
      priority: options.priority || 'normal',
    }
  );
};

// Progressive loading management
export const useProgressiveLoader = () => {
  const [loadedFeatures, setLoadedFeatures] = useState<string[]>([]);

  useEffect(() => {
    const updateLoadedFeatures = () => {
      setLoadedFeatures(progressiveLoader.getLoadedFeatures());
    };

    // Check initially
    updateLoadedFeatures();

    // Update periodically
    const interval = setInterval(updateLoadedFeatures, 1000);
    return () => clearInterval(interval);
  }, []);

  const preloadFeature = useCallback((feature: string) => {
    progressiveLoader.preloadFeature(feature);
  }, []);

  return {
    loadedFeatures,
    preloadFeature,
    isFeatureLoaded: (feature: string) => loadedFeatures.includes(feature),
  };
};