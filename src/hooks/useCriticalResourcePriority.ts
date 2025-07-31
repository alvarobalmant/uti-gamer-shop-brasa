import { useEffect, useCallback } from 'react';

/**
 * Hook para priorizar recursos críticos da homepage
 * Aplica loading="eager" e fetchPriority="high" para elementos críticos
 */
export const useCriticalResourcePriority = () => {
  const markCriticalImages = useCallback(() => {
    try {
      // Marcar produtos da homepage como high priority
      const criticalImages = document.querySelectorAll('[data-critical-product] img');
      criticalImages.forEach((img: HTMLImageElement) => {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.setAttribute('data-optimized', 'true');
      });

      // Marcar primeiras imagens de carrossel como críticas
      const carouselImages = document.querySelectorAll(
        '[data-carousel="featured"] img:nth-child(-n+5), [data-carousel="homepage"] img:nth-child(-n+5)'
      );
      carouselImages.forEach((img: HTMLImageElement) => {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.setAttribute('data-carousel-optimized', 'true');
      });

      // Marcar imagens de hero/banner como críticas
      const heroImages = document.querySelectorAll(
        '[data-hero] img, [data-banner] img, [data-critical-banner] img'
      );
      heroImages.forEach((img: HTMLImageElement) => {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.setAttribute('data-hero-optimized', 'true');
      });

      console.log('✅ Critical resources prioritized:', {
        criticalProducts: criticalImages.length,
        carouselImages: carouselImages.length,
        heroImages: heroImages.length
      });
    } catch (error) {
      console.warn('❌ Error prioritizing critical resources:', error);
    }
  }, []);

  const preloadCriticalFonts = useCallback(() => {
    try {
      // Preload de fontes críticas
      const criticalFonts = [
        '/fonts/inter-var.woff2',
        '/fonts/inter-var-latin.woff2'
      ];

      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.href = font;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      console.log('✅ Critical fonts preloaded');
    } catch (error) {
      console.warn('❌ Error preloading fonts:', error);
    }
  }, []);

  const optimizeCSSDelivery = useCallback(() => {
    try {
      // Preload de CSS crítico
      const criticalCSS = document.querySelectorAll('link[rel="stylesheet"]');
      
      criticalCSS.forEach((link: HTMLLinkElement, index) => {
        if (index < 2) { // Primeiros 2 CSS são críticos
          link.setAttribute('data-critical', 'true');
        } else {
          // CSS não crítico pode ser carregado com menor prioridade
          link.media = 'print';
          link.addEventListener('load', () => {
            link.media = 'all';
          });
        }
      });

      console.log('✅ CSS delivery optimized');
    } catch (error) {
      console.warn('❌ Error optimizing CSS delivery:', error);
    }
  }, []);

  // Executar otimizações quando DOM estiver pronto
  useEffect(() => {
    // Otimizações imediatas
    markCriticalImages();
    preloadCriticalFonts();
    optimizeCSSDelivery();

    // Re-executar quando novos elementos forem adicionados ao DOM
    const observer = new MutationObserver((mutations) => {
      let shouldReoptimize = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector('img') || element.tagName === 'IMG') {
                shouldReoptimize = true;
              }
            }
          });
        }
      });

      if (shouldReoptimize) {
        // Debounce para evitar muitas execuções
        setTimeout(markCriticalImages, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [markCriticalImages, preloadCriticalFonts, optimizeCSSDelivery]);

  // Executar novamente quando produtos carregarem
  useEffect(() => {
    const handleProductsLoaded = () => {
      setTimeout(markCriticalImages, 50);
    };

    // Escutar eventos de carregamento de produtos
    window.addEventListener('products-loaded', handleProductsLoaded);
    
    return () => {
      window.removeEventListener('products-loaded', handleProductsLoaded);
    };
  }, [markCriticalImages]);

  return {
    markCriticalImages,
    preloadCriticalFonts,
    optimizeCSSDelivery
  };
};

export default useCriticalResourcePriority;