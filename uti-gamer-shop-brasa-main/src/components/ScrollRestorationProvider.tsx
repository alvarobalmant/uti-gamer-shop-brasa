import React, { createContext } from 'react';
import { useSimpleScrollRestoration } from '@/hooks/useSimpleScrollRestoration';

// Contexto vazio apenas para fornecer o provedor
const ScrollRestorationContext = createContext<null>(null);

/**
 * Provedor que gerencia a restauração de scroll para toda a aplicação
 * Sistema novo: robusto, simples e eficaz
 */
const ScrollRestorationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usa o novo sistema simples de restauração
  useSimpleScrollRestoration();
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
