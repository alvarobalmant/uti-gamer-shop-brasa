import { useEffect, useCallback } from 'react';

// Custom hook for performance optimizations
export const usePerformanceOptimizations = () => {
  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    const preloadLink = (href: string, as: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical images and fonts
    const criticalResources = [
      { href: '/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png', as: 'image' },
    ];

    criticalResources.forEach(({ href, as }) => {
      preloadLink(href, as);
    });
  }, []);

  // Optimize images using intersection observer
  const setupImageLazyLoading = useCallback(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observer for existing images
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  }, []);

  // Prefetch next page content
  const prefetchNextPage = useCallback((url: string) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    }
  }, []);

  // Optimize fonts loading
  const optimizeFonts = useCallback(() => {
    if ('fonts' in document) {
      // Load critical fonts first
      const criticalFonts = [
        'Inter 400',
        'Inter 600',
        'Montserrat 600'
      ];

      criticalFonts.forEach((font) => {
        document.fonts.load(`16px ${font}`);
      });
    }
  }, []);

  // Setup performance monitoring
  const setupPerformanceMonitoring = useCallback(() => {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const vitalsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              console.log('LCP:', entry.startTime);
              break;
            case 'first-input':
              const fidEntry = entry as PerformanceEventTiming;
              console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
              break;
            case 'layout-shift':
              const clsEntry = entry as any;
              if (!clsEntry.hadRecentInput) {
                console.log('CLS:', clsEntry.value);
              }
              break;
          }
        });
      });

      vitalsObserver.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });

      return vitalsObserver;
    }
  }, []);

  // Optimize scrolling performance
  const optimizeScrolling = useCallback(() => {
    let ticking = false;

    const updateScrollPosition = () => {
      // Update scroll-dependent elements
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    // Initialize all optimizations
    preloadCriticalResources();
    const imageObserver = setupImageLazyLoading();
    optimizeFonts();
    const perfObserver = setupPerformanceMonitoring();
    const cleanupScroll = optimizeScrolling();

    return () => {
      imageObserver?.disconnect();
      perfObserver?.disconnect();
      cleanupScroll?.();
    };
  }, [
    preloadCriticalResources,
    setupImageLazyLoading,
    optimizeFonts,
    setupPerformanceMonitoring,
    optimizeScrolling
  ]);

  return {
    prefetchNextPage,
    preloadCriticalResources
  };
};