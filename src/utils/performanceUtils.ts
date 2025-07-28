// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
  };

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
    this.observeFCP();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          console.log('FID:', this.metrics.fid);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.metrics.cls = clsValue;
            console.log('CLS:', clsValue);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private observeTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
      console.log('TTFB:', this.metrics.ttfb);
    }
  }

  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            console.log('FCP:', entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Resource optimization utilities
  static preloadResource(href: string, as: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  static prefetchResource(href: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  static preconnectDomain(href: string) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Image optimization
  static optimizeImageLoading() {
    // Add loading="lazy" to images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      (img as HTMLImageElement).loading = 'lazy';
    });

    // Intersection Observer for progressive loading
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
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // Font optimization
  static optimizeFontLoading() {
    if ('fonts' in document) {
      // Preload critical fonts
      const criticalFonts = [
        'Inter 400',
        'Inter 600',
        'Montserrat 600'
      ];

      criticalFonts.forEach((font) => {
        document.fonts.load(`16px ${font}`);
      });

      // Font display optimization
      const fontFaces = document.fonts;
      fontFaces.ready.then(() => {
        console.log('Fonts loaded');
      });
    }
  }

  // Scrolling performance optimization
  static optimizeScrolling() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-dependent operations here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Memory optimization
  static optimizeMemory() {
    // Clean up unused resources periodically
    setInterval(() => {
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    }, 60000); // Every minute
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const {
  preloadResource,
  prefetchResource,
  preconnectDomain,
  optimizeImageLoading,
  optimizeFontLoading,
  optimizeScrolling,
  optimizeMemory
} = PerformanceMonitor;

// Critical resource hints
export const addCriticalResourceHints = () => {
  // Preconnect to external domains
  preconnectDomain('https://fonts.googleapis.com');
  preconnectDomain('https://fonts.gstatic.com');
  preconnectDomain('https://supabase.co');
  
  // DNS prefetch for less critical domains
  const dnsPrefetchDomains = [
    '//lovable-uploads.s3.amazonaws.com',
    '//cdn.gpteng.co'
  ];

  dnsPrefetchDomains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  addCriticalResourceHints();
  optimizeImageLoading();
  optimizeFontLoading();
  optimizeScrolling();
  optimizeMemory();
};