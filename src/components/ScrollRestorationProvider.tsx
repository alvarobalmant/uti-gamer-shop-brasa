
import React, { createContext } from 'react';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

// Contexto vazio apenas para fornecer o provedor
const ScrollRestorationContext = createContext<null>(null);

/**
 * Provedor que gerencia apenas a restauração de scroll VERTICAL
 * O scroll horizontal é gerenciado individualmente por cada seção via useHorizontalScrollRestoration
 */
const ScrollRestorationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usa apenas o sistema de scroll vertical
  useScrollRestoration();
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
