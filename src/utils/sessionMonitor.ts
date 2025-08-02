import { supabase } from '@/integrations/supabase/client';

// Session expiration monitoring and JWT health management
interface SessionMetrics {
  jwtExpirations: number;
  retrySuccesses: number;
  retryFailures: number;
  lastExpiration: string | null;
  forceRefreshCount: number;
  ghostStateDetections: number;
}

interface SessionHealth {
  isHealthy: boolean;
  lastChecked: string;
  consecutiveFailures: number;
  tokenAge?: number;
  expiresIn?: number;
}

class SessionMonitor {
  private metrics: SessionMetrics = {
    jwtExpirations: 0,
    retrySuccesses: 0,
    retryFailures: 0,
    lastExpiration: null,
    forceRefreshCount: 0,
    ghostStateDetections: 0
  };

  private sessionHealth: SessionHealth = {
    isHealthy: true,
    lastChecked: new Date().toISOString(),
    consecutiveFailures: 0
  };

  private healthCheckInterval: NodeJS.Timeout | null = null;
  private onGhostStateCallback: (() => void) | null = null;

  // Start proactive session monitoring
  startMonitoring(onGhostState?: () => void) {
    this.onGhostStateCallback = onGhostState || null;
    
    // Check session health every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.checkSessionHealth();
    }, 30000);

    console.log('🔍 [SessionMonitor] Proactive monitoring started');
  }

  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    console.log('⏹️ [SessionMonitor] Monitoring stopped');
  }

  // Proactively check if session is in ghost state
  private async checkSessionHealth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session) {
        this.sessionHealth.isHealthy = true;
        this.sessionHealth.consecutiveFailures = 0;
        return;
      }

      // Check if token is expired or about to expire
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = session.expires_at || 0;
      const timeUntilExpiry = tokenExp - now;

      this.sessionHealth.tokenAge = now - (session.user?.created_at ? Math.floor(new Date(session.user.created_at).getTime() / 1000) : now);
      this.sessionHealth.expiresIn = timeUntilExpiry;

      // Token expired or expiring soon (within 5 minutes)
      if (timeUntilExpiry <= 300) {
        console.warn(`⚠️ [SessionMonitor] Token expiring soon: ${timeUntilExpiry}s remaining`);
        await this.attemptForceRefresh();
        return;
      }

      // Test if token actually works by making a simple auth request
      const { error: testError } = await supabase.auth.getUser();
      
      if (testError) {
        this.detectGhostState();
        await this.attemptForceRefresh();
      } else {
        this.sessionHealth.isHealthy = true;
        this.sessionHealth.consecutiveFailures = 0;
      }

    } catch (error) {
      console.error('❌ [SessionMonitor] Health check failed:', error);
      this.sessionHealth.consecutiveFailures++;
    }

    this.sessionHealth.lastChecked = new Date().toISOString();
  }

  // Detect ghost state (user appears logged in but has no valid permissions)
  private detectGhostState() {
    this.metrics.ghostStateDetections++;
    this.sessionHealth.isHealthy = false;
    this.sessionHealth.consecutiveFailures++;

    console.error('👻 [SessionMonitor] Ghost state detected - user appears logged in but lacks permissions');

    // Trigger callback to notify the application
    if (this.onGhostStateCallback) {
      this.onGhostStateCallback();
    }
  }

  // Force token refresh when issues are detected
  private async attemptForceRefresh(): Promise<boolean> {
    try {
      console.log('🔄 [SessionMonitor] Attempting force token refresh...');
      this.metrics.forceRefreshCount++;

      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('❌ [SessionMonitor] Force refresh failed:', error);
        this.sessionHealth.consecutiveFailures++;
        return false;
      }

      if (session) {
        console.log('✅ [SessionMonitor] Force refresh successful');
        this.sessionHealth.isHealthy = true;
        this.sessionHealth.consecutiveFailures = 0;
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [SessionMonitor] Force refresh error:', error);
      this.sessionHealth.consecutiveFailures++;
      return false;
    }
  }

  // Enhanced JWT expiration logging with proactive response
  logJWTExpiration(context: string) {
    this.metrics.jwtExpirations++;
    this.metrics.lastExpiration = new Date().toISOString();
    this.sessionHealth.isHealthy = false;
    
    console.warn(`🔥 [SessionMonitor] JWT expired in ${context} at ${this.metrics.lastExpiration}`);
    
    // Different handling for offline-related expirations
    if (context.includes('offline') || context.includes('focus')) {
      console.log(`🔄 [SessionMonitor] Offline/focus JWT expiration detected, handling accordingly`);
    }
    
    // Immediately attempt refresh
    this.attemptForceRefresh();
  }

  logRetrySuccess(context: string, attempt: number) {
    this.metrics.retrySuccesses++;
    this.sessionHealth.consecutiveFailures = Math.max(0, this.sessionHealth.consecutiveFailures - 1);
    console.log(`✅ [SessionMonitor] Retry succeeded in ${context} after ${attempt} attempts`);
  }

  logRetryFailure(context: string) {
    this.metrics.retryFailures++;
    this.sessionHealth.consecutiveFailures++;
    console.error(`❌ [SessionMonitor] Retry failed in ${context}`);
  }

  // Check if session needs immediate attention
  needsAttention(): boolean {
    return !this.sessionHealth.isHealthy || 
           this.sessionHealth.consecutiveFailures >= 3 ||
           this.metrics.ghostStateDetections > 0;
  }

  // Get specific attention reason for better UX
  getAttentionReason(): string {
    if (this.metrics.ghostStateDetections > 0) {
      return 'ghost-state';
    }
    if (this.sessionHealth.consecutiveFailures >= 3) {
      return 'multiple-failures';
    }
    if (!this.sessionHealth.isHealthy) {
      return 'unhealthy';
    }
    return 'none';
  }

  getMetrics(): SessionMetrics {
    return { ...this.metrics };
  }

  getHealth(): SessionHealth {
    return { ...this.sessionHealth };
  }

  resetMetrics() {
    this.metrics = {
      jwtExpirations: 0,
      retrySuccesses: 0,
      retryFailures: 0,
      lastExpiration: null,
      forceRefreshCount: 0,
      ghostStateDetections: 0
    };
    this.sessionHealth = {
      isHealthy: true,
      lastChecked: new Date().toISOString(),
      consecutiveFailures: 0
    };
  }
}

export const sessionMonitor = new SessionMonitor();