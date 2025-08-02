export interface NavigationError {
  timestamp: number;
  error: string;
  context: string;
  sessionInfo?: {
    hasSession: boolean;
    expiresAt?: string;
    expiresIn?: number;
  };
}

export interface NavigationMetrics {
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  cacheHits: number;
  fallbackUsed: number;
}

export class NavigationMonitor {
  private static instance: NavigationMonitor;
  private errors: NavigationError[] = [];
  private metrics: NavigationMetrics = {
    successCount: 0,
    errorCount: 0,
    avgResponseTime: 0,
    cacheHits: 0,
    fallbackUsed: 0
  };

  static getInstance(): NavigationMonitor {
    if (!NavigationMonitor.instance) {
      NavigationMonitor.instance = new NavigationMonitor();
    }
    return NavigationMonitor.instance;
  }

  logError(error: string, context: string, sessionInfo?: NavigationError['sessionInfo']) {
    const errorEntry: NavigationError = {
      timestamp: Date.now(),
      error,
      context,
      sessionInfo
    };
    
    this.errors.push(errorEntry);
    this.metrics.errorCount++;
    
    // Manter apenas últimos 50 erros
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
    
    console.error(`🚨 [NAV-MONITOR] ${context}:`, error, sessionInfo);
  }

  logSuccess(responseTime: number) {
    this.metrics.successCount++;
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.successCount - 1) + responseTime) / 
      this.metrics.successCount;
    
    console.log(`✅ [NAV-MONITOR] Success in ${responseTime}ms`);
  }

  logCacheHit() {
    this.metrics.cacheHits++;
    console.log(`📦 [NAV-MONITOR] Cache hit (total: ${this.metrics.cacheHits})`);
  }

  logFallbackUsed() {
    this.metrics.fallbackUsed++;
    console.log(`🆘 [NAV-MONITOR] Fallback used (total: ${this.metrics.fallbackUsed})`);
  }

  getMetrics() {
    const totalOperations = this.metrics.successCount + this.metrics.errorCount;
    
    return {
      ...this.metrics,
      recentErrors: this.errors.slice(-10),
      errorRate: totalOperations > 0 ? this.metrics.errorCount / totalOperations : 0,
      totalOperations,
      cacheHitRate: totalOperations > 0 ? this.metrics.cacheHits / totalOperations : 0
    };
  }

  getHealthStatus(): 'healthy' | 'degraded' | 'critical' {
    const metrics = this.getMetrics();
    
    if (metrics.errorRate > 0.5) return 'critical';
    if (metrics.errorRate > 0.2 || metrics.fallbackUsed > 5) return 'degraded';
    return 'healthy';
  }

  reset() {
    this.errors = [];
    this.metrics = {
      successCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      cacheHits: 0,
      fallbackUsed: 0
    };
    console.log('🔄 [NAV-MONITOR] Metrics reset');
  }

  // Método para debug/desenvolvimento
  printReport() {
    const metrics = this.getMetrics();
    const health = this.getHealthStatus();
    
    console.group('📊 [NAV-MONITOR] Report');
    console.log('Health Status:', health);
    console.log('Total Operations:', metrics.totalOperations);
    console.log('Success Rate:', `${((1 - metrics.errorRate) * 100).toFixed(1)}%`);
    console.log('Avg Response Time:', `${metrics.avgResponseTime.toFixed(0)}ms`);
    console.log('Cache Hit Rate:', `${(metrics.cacheHitRate * 100).toFixed(1)}%`);
    console.log('Fallback Usage:', metrics.fallbackUsed);
    
    if (metrics.recentErrors.length > 0) {
      console.log('Recent Errors:', metrics.recentErrors);
    }
    
    console.groupEnd();
  }
}

