import React, { createContext } from 'react';
import { useEnhancedScrollSystem } from '@/hooks/useEnhancedScrollSystem';
import { useScrollSystemIntegration } from '@/hooks/useScrollSystemIntegration';

// Contexto vazio apenas para fornecer o provedor
const ScrollRestorationContext = createContext<null>(null);

/**
 * Provedor que gerencia a restauração de scroll para toda a aplicação
 * Sistema novo: robusto, simples e eficaz
 */
const ScrollRestorationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize scroll system coordination
  useScrollSystemIntegration({
    enabledSystems: {
      sticky: true,
      horizontal: true,
      coins: true,
      restoration: true
    },
    performanceMode: 'smooth'
  });
  
  // Use the enhanced scroll system with full caching
  useEnhancedScrollSystem({
    enablePageStateCache: true,
    enableTransitionCache: true,
    enableScrollRestoration: true,
    transitionCacheOptions: {
      enableSnapshots: true,
      snapshotDelay: 1000,
      enableInstantTransitions: true,
      preloadRoutes: [], // Add commonly visited routes here
    },
    pageCacheOptions: {
      enableAutoSave: true,
      saveInterval: 2000,
      restoreQueryCache: true,
      enableFormDataCache: true,
      enableFiltersCache: true,
    },
  });
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
