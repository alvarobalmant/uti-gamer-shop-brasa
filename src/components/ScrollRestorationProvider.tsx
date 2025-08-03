import React, { createContext } from 'react';
import { useSimpleScrollRestoration } from '@/hooks/useSimpleScrollRestoration';
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
  
  // Use the scroll restoration system
  useSimpleScrollRestoration();
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
