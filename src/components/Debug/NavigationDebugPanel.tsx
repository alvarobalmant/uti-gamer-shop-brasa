import React, { useState, useEffect } from 'react';
import { NavigationMonitor } from '@/utils/navigationMonitor';
import { HealthMonitor, checkSupabaseHealth, checkNavigationTableHealth } from '@/utils/supabaseHealthCheck';
import { NavigationCache } from '@/utils/navigationCache';

interface NavigationDebugPanelProps {
  isVisible?: boolean;
}

export const NavigationDebugPanel: React.FC<NavigationDebugPanelProps> = ({ 
  isVisible = false 
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const updateMetrics = () => {
      const navMonitor = NavigationMonitor.getInstance();
      const healthMonitor = HealthMonitor.getInstance();
      
      setMetrics(navMonitor.getMetrics());
      setHealthMetrics(healthMonitor.getMetrics());
      
      setCacheInfo({
        isValid: NavigationCache.isValid(),
        age: NavigationCache.getAge(),
        items: NavigationCache.load().length
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000); // Atualizar a cada 2 segundos

    return () => clearInterval(interval);
  }, [isVisible]);

  const runHealthCheck = async () => {
    const supabaseHealth = await checkSupabaseHealth();
    const navigationHealth = await checkNavigationTableHealth();
    
    console.log('🏥 Supabase Health:', supabaseHealth);
    console.log('🧭 Navigation Health:', navigationHealth);
  };

  const clearCache = () => {
    NavigationCache.clear();
    setCacheInfo({
      isValid: false,
      age: -1,
      items: 0
    });
  };

  const resetMetrics = () => {
    NavigationMonitor.getInstance().reset();
    setMetrics(NavigationMonitor.getInstance().getMetrics());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-green-400">🧭 Navigation Debug</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Navigation Metrics */}
          <div className="border-t border-gray-700 pt-2">
            <h4 className="font-semibold text-blue-400 mb-1">📊 Navigation Metrics</h4>
            {metrics && (
              <div className="space-y-1">
                <div>Total Operations: {metrics.totalOperations}</div>
                <div>Success Rate: {((1 - metrics.errorRate) * 100).toFixed(1)}%</div>
                <div>Avg Response: {metrics.avgResponseTime.toFixed(0)}ms</div>
                <div>Cache Hits: {metrics.cacheHits}</div>
                <div>Fallback Used: {metrics.fallbackUsed}</div>
                <div>Health: <span className={
                  NavigationMonitor.getInstance().getHealthStatus() === 'healthy' ? 'text-green-400' :
                  NavigationMonitor.getInstance().getHealthStatus() === 'degraded' ? 'text-yellow-400' :
                  'text-red-400'
                }>
                  {NavigationMonitor.getInstance().getHealthStatus().toUpperCase()}
                </span></div>
              </div>
            )}
          </div>

          {/* Cache Info */}
          <div className="border-t border-gray-700 pt-2">
            <h4 className="font-semibold text-purple-400 mb-1">📦 Cache Status</h4>
            {cacheInfo && (
              <div className="space-y-1">
                <div>Valid: {cacheInfo.isValid ? '✅' : '❌'}</div>
                <div>Items: {cacheInfo.items}</div>
                <div>Age: {cacheInfo.age > 0 ? `${Math.floor(cacheInfo.age / 1000)}s` : 'N/A'}</div>
              </div>
            )}
          </div>

          {/* Health Metrics */}
          <div className="border-t border-gray-700 pt-2">
            <h4 className="font-semibold text-orange-400 mb-1">🏥 System Health</h4>
            {healthMetrics && (
              <div className="space-y-1">
                <div>Health Checks: {healthMetrics.totalChecks}</div>
                <div>Health Rate: {(healthMetrics.healthRate * 100).toFixed(1)}%</div>
                <div>Avg Response: {healthMetrics.avgResponseTime.toFixed(0)}ms</div>
                <div>Status: <span className={
                  healthMetrics.recentStatus === 'healthy' ? 'text-green-400' :
                  healthMetrics.recentStatus === 'degraded' ? 'text-yellow-400' :
                  'text-red-400'
                }>
                  {healthMetrics.recentStatus.toUpperCase()}
                </span></div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-700 pt-2 space-y-2">
            <button
              onClick={runHealthCheck}
              className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs mr-2"
            >
              🏥 Health Check
            </button>
            <button
              onClick={clearCache}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs mr-2"
            >
              🗑️ Clear Cache
            </button>
            <button
              onClick={resetMetrics}
              className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
            >
              🔄 Reset Metrics
            </button>
          </div>

          {/* Recent Errors */}
          {metrics?.recentErrors?.length > 0 && (
            <div className="border-t border-gray-700 pt-2">
              <h4 className="font-semibold text-red-400 mb-1">🚨 Recent Errors</h4>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {metrics.recentErrors.slice(-3).map((error: any, index: number) => (
                  <div key={index} className="text-red-300 text-xs">
                    {new Date(error.timestamp).toLocaleTimeString()}: {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

