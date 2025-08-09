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
  
  // Use the enhanced scroll system with conservative settings for stability
  useEnhancedScrollSystem({
    enablePageStateCache: true,
    enableTransitionCache: false, // Disable DOM snapshots temporarily for stability
    enableScrollRestoration: true,
    transitionCacheOptions: {
      enableSnapshots: false,
      snapshotDelay: 2000,
      enableInstantTransitions: false,
      preloadRoutes: [],
    },
    pageCacheOptions: {
      enableAutoSave: true,
      saveInterval: 3000, // Increase interval for stability
      restoreQueryCache: false, // Disable query cache temporarily
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
