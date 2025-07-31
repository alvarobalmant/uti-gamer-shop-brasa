import React from 'react';
import { useIntelligentPreloader } from '@/hooks/useIntelligentPreloader';
import { PerformanceMonitor, PreloadingIndicator } from '@/components/PerformanceMonitor';
import { usePerformanceOptimizer, useResourceHints } from '@/hooks/usePerformanceOptimizer';
import { useExtremePerformanceOptimizations } from '@/hooks/useExtremePerformanceOptimizations';

// Error Boundary para o AppWithPreloader
class PreloaderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.warn('Erro no AppWithPreloader:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('AppWithPreloader Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderizar children normalmente se houver erro no preloader
      return this.props.children;
    }

    return this.props.children;
  }
}

// Componente wrapper que adiciona preloading inteligente
export const AppWithPreloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
<<<<<<< HEAD
  // Inicializar preloader inteligente com error handling
  try {
    useIntelligentPreloader();
  } catch (error) {
    console.warn('Erro ao inicializar preloader:', error);
  }
=======
  // Inicializar preloader inteligente
  useIntelligentPreloader();
  
  // Fase 1: Otimizações de performance automáticas
  usePerformanceOptimizer();
  useResourceHints();
  
  // Fase 3: Otimizações EXTREMAS 🚀
  useExtremePerformanceOptimizations();
>>>>>>> 149a4c060e7fe167b6dc88c6cb7fc7b100853637

  return (
    <PreloaderErrorBoundary>
      {children}
      
      {/* Indicador de preloading para usuários */}
      <PreloadingIndicator />
      
      {/* Monitor de performance (apenas em dev ou com ?debug=performance) */}
      <PerformanceMonitor />
    </PreloaderErrorBoundary>
  );
};

