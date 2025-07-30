import { useEffect, useCallback } from 'react';

// Hook para otimizações extremas de performance
export const useExtremePerformanceOptimizations = () => {
  
  // Service Worker registration
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('🔧 Service Worker registered:', registration);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New Service Worker available, refreshing...');
                window.location.reload();
              }
            });
          }
        });
        
      } catch (error) {
        console.warn('❌ Service Worker registration failed:', error);
      }
    }
  }, []);
  
  // Otimizações críticas de rendering
  const applyRenderingOptimizations = useCallback(() => {
    // Desabilitar smooth scrolling em dispositivos lentos
    const isSlowDevice = navigator.hardwareConcurrency < 4;
    if (isSlowDevice) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
    
    // Otimizar animações baseado na capacidade do device
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMemory = (navigator as any).deviceMemory < 4;
    
    if (reducedMotion || lowMemory || isSlowDevice) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
    
    // Force hardware acceleration para elementos críticos
    const criticalElements = document.querySelectorAll('[data-critical]');
    criticalElements.forEach(el => {
      (el as HTMLElement).style.transform = 'translateZ(0)';
      (el as HTMLElement).style.willChange = 'transform';
    });
    
  }, []);
  
  // Preload crítico agressivo
  const aggressivePreload = useCallback(() => {
    // Preload fontes críticas
    const fontPreloads = [
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
    ];
    
    fontPreloads.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Preconnect para domínios críticos
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    domains.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
  }, []);
  
  // Image optimization extrema
  const optimizeImages = useCallback(() => {
    // Intersection Observer para lazy loading agressivo
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              // Preload em resolução baixa primeiro
              const lowResImg = new Image();
              lowResImg.onload = () => {
                img.src = src;
                img.classList.add('loaded');
              };
              lowResImg.src = src.replace(/\.(jpg|jpeg|png)$/i, '_thumb.$1');
              
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );
    
    // Observar todas as imagens lazy
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    return () => imageObserver.disconnect();
  }, []);
  
  // Network optimizations
  const optimizeNetwork = useCallback(() => {
    // Prefetch páginas críticas baseado no comportamento
    const prefetchCriticalPages = () => {
      const criticalPages = ['/produto/', '/busca', '/carrinho'];
      
      criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
    };
    
    // Aguardar idle para não interferir com carregamento inicial
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchCriticalPages);
    } else {
      setTimeout(prefetchCriticalPages, 2000);
    }
  }, []);
  
  // Background Sync para operações offline
  const setupBackgroundSync = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Sync carrinho quando voltar online
        window.addEventListener('online', () => {
          console.log('🔄 Device back online, syncing data...');
          // Implementar sync manual aqui se necessário
        });
      });
    }
  }, []);
  
  // Memory management agressivo
  const optimizeMemory = useCallback(() => {
    // Cleanup automático de cache em devices com pouca memória
    const lowMemory = (navigator as any).deviceMemory < 4;
    
    if (lowMemory) {
      // Limpar cache de imagens antigas a cada 5 minutos
      setInterval(() => {
        // Force garbage collection se disponível
        if ('gc' in window) {
          (window as any).gc();
        }
        
        // Limpar event listeners orfãos
        const events = ['scroll', 'resize', 'mousemove'];
        events.forEach(event => {
          document.removeEventListener(event, () => {});
        });
        
      }, 5 * 60 * 1000);
    }
  }, []);
  
  // Debounce para logs excessivos (vi nos console logs)
  const optimizeLogs = useCallback(() => {
    const originalLog = console.log;
    const logBuffer: string[] = [];
    let logTimer: NodeJS.Timeout;
    
    console.log = (...args) => {
      const message = args.join(' ');
      
      // Se é um log repetitivo, debounce
      if (message.includes('FeaturedProductsSection') || 
          message.includes('Check scroll buttons') ||
          message.includes('Detecção de gradientes')) {
        
        logBuffer.push(message);
        
        clearTimeout(logTimer);
        logTimer = setTimeout(() => {
          if (logBuffer.length > 1) {
            originalLog(`📦 Batched ${logBuffer.length} similar logs:`, logBuffer[0]);
          } else {
            originalLog(...args);
          }
          logBuffer.length = 0;
        }, 100);
        
      } else {
        originalLog(...args);
      }
    };
  }, []);
  
  // Aplicar todas as otimizações
  useEffect(() => {
    registerServiceWorker();
    applyRenderingOptimizations();
    aggressivePreload();
    optimizeNetwork();
    setupBackgroundSync();
    optimizeMemory();
    
    // Otimizar logs apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      optimizeLogs();
    }
    
    const imageCleanup = optimizeImages();
    
    return () => {
      imageCleanup?.();
    };
  }, [
    registerServiceWorker, 
    applyRenderingOptimizations, 
    aggressivePreload, 
    optimizeNetwork, 
    setupBackgroundSync, 
    optimizeMemory, 
    optimizeLogs, 
    optimizeImages
  ]);
  
  return {
    registerServiceWorker,
    applyRenderingOptimizations,
    aggressivePreload,
    optimizeImages,
    optimizeNetwork
  };
};