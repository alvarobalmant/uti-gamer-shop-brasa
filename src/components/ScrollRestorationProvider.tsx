import React, { createContext, useContext, useEffect } from 'react';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

// Contexto vazio apenas para fornecer o provedor
const ScrollRestorationContext = createContext<null>(null);

/**
 * Provedor que gerencia a restauração de scroll para toda a aplicação
 * Deve envolver as rotas no App.tsx
 */
const ScrollRestorationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usa o hook de restauração de scroll
  useScrollRestoration();
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
