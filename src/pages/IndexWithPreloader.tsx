import React, { useEffect } from 'react';
import { useIntelligentPreloader } from '@/hooks/useIntelligentPreloader';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { useOptimizedScrollCoins } from '@/hooks/useOptimizedScrollCoins';
import { logger } from '@/lib/productionLogger';

// Importar componente Index original
import Index from './Index';

// Versão da home com preloading inteligente integrado e otimizações
const IndexWithPreloader: React.FC = () => {
  // Inicializar preloader inteligente e scroll coins otimizado
  const { getStats } = useIntelligentPreloader();
  useOptimizedScrollCoins();

  // Log para debug usando logger otimizado
  useEffect(() => {
    logger.info('🏠 Home carregada - preloading inteligente ativo');
    
    // Verificar estatísticas após 5 segundos
    const timer = setTimeout(() => {
      const stats = getStats();
      if (stats) {
        logger.info('📊 Estatísticas de preloading:', stats);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [getStats]);

  return (
    <>
      {/* Componente Index original */}
      <Index />
      
      {/* Monitor de performance (apenas em dev ou com ?debug=performance) */}
      <PerformanceMonitor />
    </>
  );
};

export default IndexWithPreloader;

