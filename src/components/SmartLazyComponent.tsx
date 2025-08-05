/**
 * Smart Lazy Component - Enhanced lazy loading with bundle management
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { useSmartBundle } from '@/hooks/useSmartBundleLoader';
import { logger } from '@/lib/productionLogger';

interface SmartLazyComponentProps {
  bundleLoader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  preload?: boolean;
  priority?: 'high' | 'normal' | 'low';
  condition?: () => boolean;
  [key: string]: any;
}

const defaultFallback = (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const defaultErrorFallback = (
  <div className="flex items-center justify-center p-8 text-muted-foreground">
    <span>Failed to load component</span>
  </div>
);

export const SmartLazyComponent: React.FC<SmartLazyComponentProps> = ({
  bundleLoader,
  fallback = defaultFallback,
  errorFallback = defaultErrorFallback,
  preload = false,
  priority = 'normal',
  condition = () => true,
  ...props
}) => {
  const { data: bundleData, loading, error, isReady } = useSmartBundle(
    bundleLoader,
    { preload, priority, condition }
  );

  if (error) {
    logger.error('SmartLazyComponent error:', error);
    return <>{errorFallback}</>;
  }

  if (!condition()) {
    return null;
  }

  if (!isReady) {
    return <>{fallback}</>;
  }

  if (!bundleData?.default) {
    return <>{errorFallback}</>;
  }

  const Component = bundleData.default;
  
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Factory function for creating smart lazy components
export const createSmartLazyComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>,
  options: {
    preload?: boolean;
    priority?: 'high' | 'normal' | 'low';
    condition?: () => boolean;
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
  } = {}
) => {
  return (props: any) => (
    <SmartLazyComponent
      bundleLoader={importFn}
      {...options}
      {...props}
    />
  );
};

// Pre-built smart lazy components for common use cases
export const SmartLazyAdmin = createSmartLazyComponent(
  async () => {
    const module = await import('@/components/Admin/AdminPanel');
    // AdminPanel is exported as named export, wrap it properly
    return { default: module.AdminPanel };
  },
  {
    priority: 'low',
    preload: false,
    condition: () => {
      // Only load if user might be admin (check in localStorage or URL)
      return window.location.pathname.includes('/admin') || 
             localStorage.getItem('userRole') === 'admin';
    }
  }
);

export const SmartLazyCharts = createSmartLazyComponent(
  () => import('recharts').then(m => ({ default: m.ResponsiveContainer })),
  {
    priority: 'normal',
    preload: false,
  }
);