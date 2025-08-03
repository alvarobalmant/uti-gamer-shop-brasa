import React, { createContext } from 'react';
import { useSimpleScrollRestoration } from '@/hooks/useSimpleScrollRestoration';
import { useScrollSystemIntegration } from '@/hooks/useScrollSystemIntegration';
<<<<<<< HEAD
=======
import { useScrollCoins } from '@/hooks/useScrollCoins';
>>>>>>> a14bf89bc02c21899828f715cf04e9ea7521825f

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
  
<<<<<<< HEAD
=======
  // Ativar sistema de ganho de moedas por scroll em todas as páginas
  useScrollCoins();
  
>>>>>>> a14bf89bc02c21899828f715cf04e9ea7521825f
  // Use the scroll restoration system
  useSimpleScrollRestoration();
  
  return (
    <ScrollRestorationContext.Provider value={null}>
      {children}
    </ScrollRestorationContext.Provider>
  );
};

export default ScrollRestorationProvider;
