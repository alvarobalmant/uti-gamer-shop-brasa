// Session expiration monitoring and logging
interface SessionMetrics {
  jwtExpirations: number;
  retrySuccesses: number;
  retryFailures: number;
  lastExpiration: string | null;
}

class SessionMonitor {
  private metrics: SessionMetrics = {
    jwtExpirations: 0,
    retrySuccesses: 0,
    retryFailures: 0,
    lastExpiration: null
  };

  logJWTExpiration(context: string) {
    this.metrics.jwtExpirations++;
    this.metrics.lastExpiration = new Date().toISOString();
    console.warn(`🔥 [SessionMonitor] JWT expired in ${context} at ${this.metrics.lastExpiration}`);
  }

  logRetrySuccess(context: string, attempt: number) {
    this.metrics.retrySuccesses++;
    console.log(`✅ [SessionMonitor] Retry succeeded in ${context} after ${attempt} attempts`);
  }

  logRetryFailure(context: string) {
    this.metrics.retryFailures++;
    console.error(`❌ [SessionMonitor] Retry failed in ${context}`);
  }

  getMetrics(): SessionMetrics {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      jwtExpirations: 0,
      retrySuccesses: 0,
      retryFailures: 0,
      lastExpiration: null
    };
  }
}

export const sessionMonitor = new SessionMonitor();