/**
 * Production-optimized logging system
 * Automatically strips logs in production builds while keeping essential error tracking
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  enabledInProduction: boolean;
  enabledInDevelopment: boolean;
  maxLogsPerSession?: number;
  logToConsole?: boolean;
  logToStorage?: boolean;
}

class ProductionLogger {
  private isProduction = process.env.NODE_ENV === 'production';
  private logCount = 0;
  private maxLogs = 100; // Limit logs in production
  private storageKey = 'app_error_logs';
  
  private config: Record<LogLevel, LogConfig> = {
    debug: {
      enabledInProduction: false,
      enabledInDevelopment: true,
      logToConsole: true
    },
    info: {
      enabledInProduction: false,
      enabledInDevelopment: true,
      logToConsole: true
    },
    warn: {
      enabledInProduction: true,
      enabledInDevelopment: true,
      maxLogsPerSession: 10,
      logToConsole: true,
      logToStorage: true
    },
    error: {
      enabledInProduction: true,
      enabledInDevelopment: true,
      maxLogsPerSession: 50,
      logToConsole: true,
      logToStorage: true
    }
  };

  private shouldLog(level: LogLevel): boolean {
    const config = this.config[level];
    
    if (this.isProduction) {
      if (!config.enabledInProduction) return false;
      if (config.maxLogsPerSession && this.logCount >= config.maxLogsPerSession) return false;
    } else {
      if (!config.enabledInDevelopment) return false;
    }
    
    return true;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return;
    
    this.logCount++;
    const config = this.config[level];
    
    if (config.logToConsole) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, ...args);
          break;
        case 'info':
          console.info(prefix, message, ...args);
          break;
        case 'warn':
          console.warn(prefix, message, ...args);
          break;
        case 'error':
          console.error(prefix, message, ...args);
          break;
      }
    }
    
    // Store critical logs for debugging
    if (config.logToStorage && (level === 'warn' || level === 'error')) {
      this.storeLog(level, message, args);
    }
  }

  private storeLog(level: LogLevel, message: string, args: any[]) {
    try {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const logEntry = {
        level,
        message,
        args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)),
        timestamp: Date.now(),
        url: window.location.href
      };
      
      logs.push(logEntry);
      
      // Keep only last 50 logs
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  // Public API
  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  // Get stored logs for debugging
  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Silently fail
    }
  }

  // Get current session stats
  getSessionStats() {
    return {
      logCount: this.logCount,
      isProduction: this.isProduction,
      maxLogs: this.maxLogs
    };
  }
}

export const logger = new ProductionLogger();

// For backward compatibility - gradually replace console.log with logger
export const console = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  log: logger.info.bind(logger), // Map log to info
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger)
};
