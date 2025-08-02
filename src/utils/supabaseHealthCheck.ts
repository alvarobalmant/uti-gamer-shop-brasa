import { supabase } from '@/integrations/supabase/client';

export interface HealthCheckResult {
  isHealthy: boolean;
  responseTime: number;
  error?: string;
  sessionStatus?: {
    hasSession: boolean;
    expiresAt?: string;
    expiresIn?: number;
  };
  timestamp: number;
}

export const checkSupabaseHealth = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now();
  const timestamp = Date.now();
  
  try {
    // Verificar sessão primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    const sessionStatus = {
      hasSession: !!session,
      expiresAt: session?.expires_at,
      expiresIn: session?.expires_at ? 
        Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000) : 
        undefined
    };
    
    if (sessionError) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: `Session error: ${sessionError.message}`,
        sessionStatus,
        timestamp
      };
    }
    
    // Testar conectividade básica
    const { data, error } = await supabase
      .from('navigation_items')
      .select('count')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        isHealthy: false,
        responseTime,
        error: error.message,
        sessionStatus,
        timestamp
      };
    }
    
    return {
      isHealthy: true,
      responseTime,
      sessionStatus,
      timestamp
    };
    
  } catch (err: any) {
    return { 
      isHealthy: false, 
      responseTime: Date.now() - startTime, 
      error: err.message,
      timestamp
    };
  }
};

export const checkNavigationTableHealth = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now();
  const timestamp = Date.now();
  
  try {
    // Testar query específica da navegação
    const { data, error } = await supabase
      .from('navigation_items')
      .select('id, title, is_visible, is_active')
      .eq('is_visible', true)
      .eq('is_active', true)
      .limit(5);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        isHealthy: false,
        responseTime,
        error: `Navigation query error: ${error.message}`,
        timestamp
      };
    }
    
    if (!data || data.length === 0) {
      return {
        isHealthy: false,
        responseTime,
        error: 'No navigation items found',
        timestamp
      };
    }
    
    return {
      isHealthy: true,
      responseTime,
      timestamp
    };
    
  } catch (err: any) {
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      error: `Navigation health check failed: ${err.message}`,
      timestamp
    };
  }
};

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthHistory: HealthCheckResult[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  startMonitoring(intervalMs: number = 30000) { // 30 segundos por padrão
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🏥 [HEALTH-MONITOR] Iniciando monitoramento...');
    
    this.monitoringInterval = setInterval(async () => {
      const health = await checkSupabaseHealth();
      this.addHealthResult(health);
      
      if (!health.isHealthy) {
        console.warn('🚨 [HEALTH-MONITOR] Sistema não saudável:', health.error);
      }
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('🏥 [HEALTH-MONITOR] Monitoramento parado');
  }

  private addHealthResult(result: HealthCheckResult) {
    this.healthHistory.push(result);
    
    // Manter apenas últimos 100 resultados
    if (this.healthHistory.length > 100) {
      this.healthHistory = this.healthHistory.slice(-100);
    }
  }

  getHealthStatus(): 'healthy' | 'degraded' | 'critical' {
    if (this.healthHistory.length === 0) return 'healthy';
    
    const recent = this.healthHistory.slice(-10); // Últimos 10 checks
    const unhealthyCount = recent.filter(h => !h.isHealthy).length;
    
    if (unhealthyCount >= 7) return 'critical'; // 70% falhas
    if (unhealthyCount >= 3) return 'degraded'; // 30% falhas
    return 'healthy';
  }

  getMetrics() {
    if (this.healthHistory.length === 0) {
      return {
        totalChecks: 0,
        healthyCount: 0,
        unhealthyCount: 0,
        healthRate: 0,
        avgResponseTime: 0,
        recentStatus: 'healthy' as const
      };
    }
    
    const healthyCount = this.healthHistory.filter(h => h.isHealthy).length;
    const unhealthyCount = this.healthHistory.length - healthyCount;
    const avgResponseTime = this.healthHistory.reduce((sum, h) => sum + h.responseTime, 0) / this.healthHistory.length;
    
    return {
      totalChecks: this.healthHistory.length,
      healthyCount,
      unhealthyCount,
      healthRate: healthyCount / this.healthHistory.length,
      avgResponseTime,
      recentStatus: this.getHealthStatus()
    };
  }
}

