import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface PersistentCacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
  version: string;
}

interface UltraAggressiveCacheConfig {
  ttl: number; // Time to live in milliseconds
  persistentStorage: boolean;
  enableCacheWarming: boolean;
  enablePrefetching: boolean;
  version: string;
}

const DEFAULT_CONFIG: UltraAggressiveCacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  persistentStorage: true,
  enableCacheWarming: true,
  enablePrefetching: true,
  version: '1.0.0',
};

/**
 * Ultra-aggressive caching system that persists data across sessions
 * Eliminates database queries for frequently accessed data
 */
export const useUltraAggressiveCache = (config: Partial<UltraAggressiveCacheConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const queryClient = useQueryClient();
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    persistentHits: 0,
    lastUpdate: Date.now(),
  });

  /**
   * Store data in persistent cache (localStorage)
   */
  const storePersistentCache = useCallback((key: string, data: any): void => {
    if (!finalConfig.persistentStorage) return;

    try {
      const entry: PersistentCacheEntry = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + finalConfig.ttl,
        version: finalConfig.version,
      };
      
      localStorage.setItem(`ultra_cache_${key}`, JSON.stringify(entry));
      console.log(`[UltraCache] 💾 Stored persistent cache for: ${key}`);
    } catch (error) {
      console.warn('[UltraCache] Failed to store persistent cache:', error);
    }
  }, [finalConfig.persistentStorage, finalConfig.ttl, finalConfig.version]);

  /**
   * Retrieve data from persistent cache
   */
  const getPersistentCache = useCallback((key: string): any | null => {
    if (!finalConfig.persistentStorage) return null;

    try {
      const stored = localStorage.getItem(`ultra_cache_${key}`);
      if (!stored) return null;

      const entry: PersistentCacheEntry = JSON.parse(stored);
      
      // Check version compatibility
      if (entry.version !== finalConfig.version) {
        localStorage.removeItem(`ultra_cache_${key}`);
        console.log(`[UltraCache] 🔄 Version mismatch, cleared cache for: ${key}`);
        return null;
      }

      // Check expiration
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(`ultra_cache_${key}`);
        console.log(`[UltraCache] ⏰ Expired cache cleared for: ${key}`);
        return null;
      }

      setCacheStats(prev => ({ ...prev, persistentHits: prev.persistentHits + 1 }));
      console.log(`[UltraCache] ⚡ Persistent cache hit for: ${key}`);
      return entry.data;
    } catch (error) {
      console.warn('[UltraCache] Failed to retrieve persistent cache:', error);
      return null;
    }
  }, [finalConfig.persistentStorage, finalConfig.version]);

  /**
   * Get data with ultra-aggressive caching
   */
  const getCachedData = useCallback((queryKey: string[], fallbackFn?: () => Promise<any>): any | null => {
    const cacheKey = queryKey.join('_');
    
    // Try React Query cache first (fastest)
    const reactQueryData = queryClient.getQueryData(queryKey);
    if (reactQueryData) {
      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      console.log(`[UltraCache] 🚀 React Query cache hit for: ${cacheKey}`);
      return reactQueryData;
    }

    // Try persistent cache
    const persistentData = getPersistentCache(cacheKey);
    if (persistentData) {
      // Restore to React Query cache
      queryClient.setQueryData(queryKey, persistentData);
      return persistentData;
    }

    setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    console.log(`[UltraCache] 💭 Cache miss for: ${cacheKey}`);
    return null;
  }, [queryClient, getPersistentCache]);

  /**
   * Set data in both React Query and persistent cache
   */
  const setCachedData = useCallback((queryKey: string[], data: any): void => {
    const cacheKey = queryKey.join('_');
    
    // Set in React Query cache
    queryClient.setQueryData(queryKey, data);
    
    // Set in persistent cache
    storePersistentCache(cacheKey, data);
    
    console.log(`[UltraCache] 📝 Cached data for: ${cacheKey}`);
  }, [queryClient, storePersistentCache]);

  /**
   * Prefetch and cache data
   */
  const prefetchAndCache = useCallback(async (queryKey: string[], queryFn: () => Promise<any>): Promise<void> => {
    if (!finalConfig.enablePrefetching) return;

    try {
      console.log(`[UltraCache] 🔄 Prefetching: ${queryKey.join('_')}`);
      const data = await queryFn();
      setCachedData(queryKey, data);
    } catch (error) {
      console.warn('[UltraCache] Prefetch failed:', error);
    }
  }, [finalConfig.enablePrefetching, setCachedData]);

  /**
   * Warm up cache with critical data
   */
  const warmCache = useCallback(async (warmupFunctions: Record<string, () => Promise<any>>): Promise<void> => {
    if (!finalConfig.enableCacheWarming) return;

    console.log('[UltraCache] 🔥 Starting cache warmup...');
    
    const warmupPromises = Object.entries(warmupFunctions).map(async ([key, fn]) => {
      try {
        const data = await fn();
        setCachedData([key], data);
        console.log(`[UltraCache] ✅ Warmed up: ${key}`);
      } catch (error) {
        console.warn(`[UltraCache] Failed to warm up ${key}:`, error);
      }
    });

    await Promise.allSettled(warmupPromises);
    console.log('[UltraCache] 🔥 Cache warmup complete');
  }, [finalConfig.enableCacheWarming, setCachedData]);

  /**
   * Clear expired persistent cache entries
   */
  const clearExpiredCache = useCallback((): void => {
    try {
      const keys = Object.keys(localStorage);
      const ultraCacheKeys = keys.filter(key => key.startsWith('ultra_cache_'));
      
      ultraCacheKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: PersistentCacheEntry = JSON.parse(stored);
            if (Date.now() > entry.expiresAt) {
              localStorage.removeItem(key);
              console.log(`[UltraCache] 🧹 Cleared expired: ${key}`);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('[UltraCache] Failed to clear expired cache:', error);
    }
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    const reactQueryCacheSize = queryClient.getQueryCache().getAll().length;
    const persistentCacheSize = Object.keys(localStorage).filter(key => 
      key.startsWith('ultra_cache_')
    ).length;

    return {
      ...cacheStats,
      reactQueryCacheSize,
      persistentCacheSize,
      hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
      config: finalConfig,
    };
  }, [cacheStats, queryClient, finalConfig]);

  // Cleanup expired cache on initialization
  useEffect(() => {
    clearExpiredCache();
  }, [clearExpiredCache]);

  // Performance monitoring in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const stats = getCacheStats();
        console.log('[UltraCache] 📊 Performance Stats:', stats);
      }, 60000); // Log every minute

      return () => clearInterval(interval);
    }
  }, [getCacheStats]);

  return {
    getCachedData,
    setCachedData,
    prefetchAndCache,
    warmCache,
    clearExpiredCache,
    getCacheStats,
    config: finalConfig,
  };
};