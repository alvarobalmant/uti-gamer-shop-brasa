import React, { Suspense, lazy } from 'react';
import { logger } from '@/lib/productionLogger';

// Optimized lazy loading with error boundaries and loading states
interface LazyComponentProps {
  componentPath: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  preload?: boolean;
}

// Cache for loaded components
const componentCache = new Map<string, React.LazyExoticComponent<any>>();

// Preload components that are likely to be needed
const preloadComponent = (componentPath: string) => {
  if (!componentCache.has(componentPath)) {
    try {
      const Component = lazy(() => import(componentPath));
      componentCache.set(componentPath, Component);
      logger.debug(`Preloaded component: ${componentPath}`);
    } catch (error) {
      logger.error(`Failed to preload component: ${componentPath}`, error);
    }
  }
};

// Error boundary for lazy components
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logger.error('Lazy component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong loading this component.</div>;
    }

    return this.props.children;
  }
}

export const OptimizedLazyLoader: React.FC<LazyComponentProps> = ({
  componentPath,
  fallback = <div>Loading...</div>,
  errorFallback,
  preload = false,
  ...props
}) => {
  // Preload if requested
  React.useEffect(() => {
    if (preload) {
      preloadComponent(componentPath);
    }
  }, [componentPath, preload]);

  // Get or create lazy component
  let LazyComponent = componentCache.get(componentPath);
  
  if (!LazyComponent) {
    LazyComponent = lazy(() => import(componentPath));
    componentCache.set(componentPath, LazyComponent);
  }

  return (
    <LazyLoadErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

// Hook for preloading components based on user behavior
export const useIntelligentPreloading = () => {
  const preloadOnUserInteraction = React.useCallback((componentPaths: string[]) => {
    const handleUserInteraction = () => {
      componentPaths.forEach(path => {
        preloadComponent(path);
      });
      
      // Remove listeners after preloading
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Preload on first user interaction
    document.addEventListener('mousemove', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
  }, []);

  const preloadOnIdle = React.useCallback((componentPaths: string[]) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        componentPaths.forEach(path => {
          preloadComponent(path);
        });
      });
    } else {
      setTimeout(() => {
        componentPaths.forEach(path => {
          preloadComponent(path);
        });
      }, 100);
    }
  }, []);

  return {
    preloadOnUserInteraction,
    preloadOnIdle,
    preloadComponent
  };
};