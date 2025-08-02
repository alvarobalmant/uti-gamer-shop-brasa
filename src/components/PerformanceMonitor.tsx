import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  cacheEfficiency: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Mostrar monitor apenas em desenvolvimento ou com query param
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = new URLSearchParams(window.location.search).get('debug') === 'performance';
    
    if (isDev || hasDebugParam) {
      setShowMonitor(true);
      
      // Coletar métricas de performance
      const collectMetrics = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          
          // Memoria (se disponível)
          let memoryUsage;
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
          }

          setMetrics({
            loadTime: Math.round(loadTime),
            renderTime: Math.round(renderTime),
            memoryUsage: memoryUsage ? Math.round(memoryUsage * 100) / 100 : undefined,
            cacheEfficiency: Math.random() * 100 // Placeholder - implementar cache real
          });
        }
      };

      // Coletar após o carregamento
      setTimeout(collectMetrics, 1000);
    }
  }, []);

  if (!showMonitor || !metrics) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded text-xs font-mono space-y-1">
      <div className="text-yellow-400 font-bold">⚡ Performance</div>
      <div>Load: {metrics.loadTime}ms</div>
      <div>Render: {metrics.renderTime}ms</div>
      {metrics.memoryUsage && <div>Memory: {metrics.memoryUsage}MB</div>}
      <div>Cache: {Math.round(metrics.cacheEfficiency)}%</div>
    </div>
  );
};
