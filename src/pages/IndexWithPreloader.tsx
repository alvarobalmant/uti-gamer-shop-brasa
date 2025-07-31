import React, { useEffect } from 'react';
import { useIntelligentPreloader } from '@/hooks/useIntelligentPreloader';
import { PerformanceMonitor, PreloadingIndicator } from '@/components/PerformanceMonitor';

// Importar componente Index original
import Index from './Index';

// Versão da home com preloading inteligente integrado
const IndexWithPreloader: React.FC = () => {
  // Inicializar preloader inteligente
  const { getStats } = useIntelligentPreloader();

  // Log para debug
  useEffect(() => {
    console.log('🏠 Home carregada - preloading inteligente ativo');
    
    // Verificar estatísticas após 5 segundos
    const timer = setTimeout(() => {
      const stats = getStats();
      if (stats) {
        console.log('📊 Estatísticas de preloading:', stats);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [getStats]);

  return (
    <>
      {/* Componente Index original */}
      <Index />
      
      {/* Indicador de preloading para usuários */}
      <PreloadingIndicator />
      
      {/* Monitor de performance (apenas em dev ou com ?debug=performance) */}
      <PerformanceMonitor />
    </>
  );
};

export default IndexWithPreloader;

