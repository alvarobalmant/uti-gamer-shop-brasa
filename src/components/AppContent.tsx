import React from 'react';
import { usePageScrollRestoration } from '@/hooks/usePageScrollRestoration';

interface AppContentProps {
  children: React.ReactNode;
}

/**
 * Componente wrapper que integra o sistema de scroll horizontal
 * com a navegação do React Router
 */
const AppContent: React.FC<AppContentProps> = ({ children }) => {
  // Integra sistema simples de scroll horizontal com navegação
  usePageScrollRestoration();
  
  return <>{children}</>;
};

export default AppContent;

