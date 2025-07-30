import React from 'react';
import { useIntelligentPreloader } from '@/hooks/useIntelligentPreloader';
import { PerformanceMonitor, PreloadingIndicator } from '@/components/PerformanceMonitor';
import { usePerformanceOptimizer, useResourceHints } from '@/hooks/usePerformanceOptimizer';
import { useExtremePerformanceOptimizations } from '@/hooks/useExtremePerformanceOptimizations';

// Componente wrapper que adiciona preloading inteligente
export const AppWithPreloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar preloader inteligente
  useIntelligentPreloader();
  
  // Fase 1: Otimizações de performance automáticas
  usePerformanceOptimizer();
  useResourceHints();
  
  // Fase 3: Otimizações EXTREMAS 🚀
  useExtremePerformanceOptimizations();

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

