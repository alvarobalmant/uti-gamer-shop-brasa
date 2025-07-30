import React from 'react';
import { useIntelligentPreloader } from '@/hooks/useIntelligentPreloader';
import { PerformanceMonitor, PreloadingIndicator } from '@/components/PerformanceMonitor';

// Componente wrapper que adiciona preloading inteligente
export const AppWithPreloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar preloader inteligente
  useIntelligentPreloader();

  return (
    <>
      {children}
      
      {/* Indicador de preloading para usuários */}
      <PreloadingIndicator />
      
      {/* Monitor de performance (apenas em dev ou com ?debug=performance) */}
      <PerformanceMonitor />
    </>
  );
};

