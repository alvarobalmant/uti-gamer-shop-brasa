import { useCallback, useEffect, useState } from 'react';
import { useOptimizedCache, useCacheInvalidation } from './useOptimizedCache';

// Hook para otimização automática de performance
export const usePerformanceOptimizer = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    isSlowDevice: false,
    isSlowNetwork: false,
    hasLowMemory: false,
    shouldOptimize: false
  });

  const { invalidateAll } = useCacheInvalidation();

  // Detectar características do dispositivo/rede
  const detectPerformanceCapabilities = useCallback(() => {
    try {
      // Verificar conexão de rede
      const connection = (navigator as any).connection;
      const isSlowNetwork = connection?.effectiveType === '2g' || 
                           connection?.effectiveType === 'slow-2g' ||
                           connection?.saveData === true;

      // Verificar capacidade do dispositivo
      const cores = navigator.hardwareConcurrency || 1;
      const isSlowDevice = cores < 4;

      // Verificar memória disponível
      const memory = (navigator as any).deviceMemory || 4;
      const hasLowMemory = memory < 4;

      const shouldOptimize = isSlowNetwork || isSlowDevice || hasLowMemory;

      setPerformanceMetrics({
        isSlowDevice,
        isSlowNetwork,
        hasLowMemory,
        shouldOptimize
      });

      console.log('🔧 Performance Optimizer:', {
        cores,
        memory: `${memory}GB`,
        networkType: connection?.effectiveType || 'unknown',
        saveData: connection?.saveData || false,
        shouldOptimize
      });

    } catch (error) {
      console.warn('Erro ao detectar capacidades de performance:', error);
    }
  }, []);

  // Otimizações automáticas baseadas no dispositivo
  const applyOptimizations = useCallback(() => {
    if (performanceMetrics.shouldOptimize) {
      console.log('⚡ Aplicando otimizações de performance...');
      
      // Limpar cache se necessário
      if (performanceMetrics.hasLowMemory) {
        console.log('🧹 Limpando cache devido à baixa memória');
        invalidateAll();
      }

      // Configurar preferências de performance
      if (typeof document !== 'undefined') {
        // Reduzir animações em dispositivos lentos
        if (performanceMetrics.isSlowDevice) {
          document.documentElement.style.setProperty('--animation-duration', '0.1s');
          document.documentElement.style.setProperty('--transition-duration', '0.1s');
        }

        // Aplicar hints de performance
        const head = document.head;
        
        // DNS prefetch para domínios importantes
        if (!head.querySelector('[rel="dns-prefetch"][href="//fonts.googleapis.com"]')) {
          const dnsPrefetch = document.createElement('link');
          dnsPrefetch.rel = 'dns-prefetch';
          dnsPrefetch.href = '//fonts.googleapis.com';
          head.appendChild(dnsPrefetch);
        }
      }
    }
  }, [performanceMetrics, invalidateAll]);

  // Executar detecção e otimizações
  useEffect(() => {
    detectPerformanceCapabilities();
  }, [detectPerformanceCapabilities]);

  useEffect(() => {
    applyOptimizations();
  }, [applyOptimizations]);

  return {
    performanceMetrics,
    detectPerformanceCapabilities,
    applyOptimizations
  };
};

// Hook para lazy loading inteligente
export const useIntelligentLazyLoading = () => {
  const [shouldLazyLoad, setShouldLazyLoad] = useState(true);

  useEffect(() => {
    // Detectar se deve usar lazy loading
    const connection = (navigator as any).connection;
    const isFastConnection = connection?.effectiveType === '4g' || 
                            connection?.downlink > 5;
    
    // Desabilitar lazy loading em conexões muito rápidas
    setShouldLazyLoad(!isFastConnection);
  }, []);

  return { shouldLazyLoad };
};

// Hook para resource hints automáticos
export const useResourceHints = () => {
  const applyResourceHints = useCallback(() => {
    if (typeof document === 'undefined') return;

    const head = document.head;

    // Preconnect para domínios críticos
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    criticalDomains.forEach(domain => {
      if (!head.querySelector(`[rel="preconnect"][href="${domain}"]`)) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = domain;
        preconnect.crossOrigin = 'anonymous';
        head.appendChild(preconnect);
      }
    });

    // Module preload para chunks críticos
    const criticalChunks = [
      '/src/hooks/useProducts.ts',
      '/src/hooks/useAuth.ts',
      '/src/contexts/CartContext.tsx'
    ];

    criticalChunks.forEach(chunk => {
      if (!head.querySelector(`[rel="modulepreload"][href="${chunk}"]`)) {
        const modulePreload = document.createElement('link');
        modulePreload.rel = 'modulepreload';
        modulePreload.href = chunk;
        head.appendChild(modulePreload);
      }
    });

  }, []);

  useEffect(() => {
    // Aplicar hints após um pequeno delay
    const timer = setTimeout(applyResourceHints, 1000);
    return () => clearTimeout(timer);
  }, [applyResourceHints]);

  return { applyResourceHints };
};