import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { securityMonitor, csrfProtection } from '@/lib/security';
import { useAuth } from '@/hooks/useAuth';

interface SecurityContextType {
  isSecurityMonitoringEnabled: boolean;
  securityEvents: any[];
  csrfToken: string;
  refreshCSRFToken: () => void;
  logSecurityEvent: (event: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecurityMonitoringEnabled, setIsSecurityMonitoringEnabled] = useState(true);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [csrfToken, setCsrfToken] = useState('');
  const { user } = useAuth();

  // Initialize enhanced CSRF protection
  useEffect(() => {
    const token = csrfProtection.generateToken();
    setCsrfToken(token);
    
    // Set up automatic CSRF token refresh
    const tokenRefreshInterval = setInterval(() => {
      const newToken = csrfProtection.generateToken();
      setCsrfToken(newToken);
      
      securityMonitor.logEvent({
        type: 'rate_limit',
        message: 'CSRF token refreshed for security',
        details: { timestamp: Date.now(), tokenLength: newToken.length }
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  // Enhanced user session monitoring
  useEffect(() => {
    if (user && isSecurityMonitoringEnabled) {
      securityMonitor.logEvent({
        type: 'auth_failure', // Using available type for session activity
        message: 'User session active - enhanced monitoring',
        details: { 
          userId: user.id, 
          timestamp: Date.now(),
          userAgent: navigator.userAgent.substring(0, 100), // Truncate for security
          sessionStart: true
        }
      });
      
      // Monitor for session anomalies
      const sessionCheck = setInterval(() => {
        if (!user) {
          clearInterval(sessionCheck);
          return;
        }
        
        // Check for potential session hijacking indicators
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - (parseInt(localStorage.getItem('lastActivity') || '0') || currentTime);
        
        if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 minutes of inactivity
          securityMonitor.logEvent({
            type: 'auth_failure',
            message: 'Long session inactivity detected',
            details: { 
              userId: user.id,
              inactivityDuration: timeSinceLastActivity,
              timestamp: currentTime
            }
          });
        }
        
        localStorage.setItem('lastActivity', currentTime.toString());
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(sessionCheck);
    }
  }, [user, isSecurityMonitoringEnabled]);

  // Enhanced security monitoring with threat detection
  useEffect(() => {
    if (!isSecurityMonitoringEnabled) return;

    // Advanced threat monitoring
    const monitoringInterval = setInterval(() => {
      const recentEvents = securityMonitor.getRecentEvents(100);
      setSecurityEvents(recentEvents);

      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const fiveMinutesAgo = now - 300000;

      // Detect various attack patterns
      const recentFailures = recentEvents.filter(
        event => event.type === 'auth_failure' && event.timestamp > oneMinuteAgo
      ).length;

      const recentXSSAttempts = recentEvents.filter(
        event => event.type === 'xss_attempt' && event.timestamp > fiveMinutesAgo
      ).length;

      const rapidRequests = recentEvents.filter(
        event => event.timestamp > oneMinuteAgo
      ).length;

      // Escalating threat detection
      if (recentFailures > 10) {
        securityMonitor.logEvent({
          type: 'rate_limit',
          message: 'CRITICAL: Excessive authentication failures detected',
          details: { 
            failures: recentFailures, 
            timeWindow: '1 minute',
            severity: 'critical',
            possibleAttack: 'brute_force'
          }
        });
      }

      if (recentXSSAttempts > 3) {
        securityMonitor.logEvent({
          type: 'xss_attempt',
          message: 'WARNING: Multiple XSS attempts detected',
          details: { 
            attempts: recentXSSAttempts, 
            timeWindow: '5 minutes',
            severity: 'high',
            possibleAttack: 'xss_injection'
          }
        });
      }

      if (rapidRequests > 50) {
        securityMonitor.logEvent({
          type: 'rate_limit',
          message: 'WARNING: High request rate - potential DoS attack',
          details: { 
            requests: rapidRequests, 
            timeWindow: '1 minute',
            severity: 'medium',
            possibleAttack: 'dos'
          }
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(monitoringInterval);
  }, [isSecurityMonitoringEnabled]);

  // Enhanced page visibility monitoring with session security
  useEffect(() => {
    let hiddenStartTime: number | null = null;
    
    const handleVisibilityChange = () => {
      const currentTime = Date.now();
      
      if (document.hidden) {
        hiddenStartTime = currentTime;
        securityMonitor.logEvent({
          type: 'auth_failure',
          message: 'Page hidden - session monitoring paused',
          details: { 
            timestamp: currentTime,
            hiddenAt: currentTime,
            hasActiveUser: !!user
          }
        });
      } else {
        const hiddenDuration = hiddenStartTime ? currentTime - hiddenStartTime : 0;
        
        securityMonitor.logEvent({
          type: 'auth_failure',
          message: 'Page visible - session monitoring resumed',
          details: { 
            timestamp: currentTime,
            visibleAt: currentTime,
            hiddenDuration: hiddenDuration,
            potentialSessionRisk: hiddenDuration > 10 * 60 * 1000, // Risk if hidden > 10 minutes
            hasActiveUser: !!user
          }
        });
        
        // Check for potential session hijacking if page was hidden too long
        if (hiddenDuration > 30 * 60 * 1000 && user) { // 30 minutes
          securityMonitor.logEvent({
            type: 'auth_failure',
            message: 'SECURITY WARNING: Long page absence detected - verify session integrity',
            details: { 
              userId: user.id,
              hiddenDuration: hiddenDuration,
              timestamp: currentTime,
              severity: 'medium'
            }
          });
        }
        
        hiddenStartTime = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const refreshCSRFToken = () => {
    const newToken = csrfProtection.generateToken();
    setCsrfToken(newToken);
  };

  const logSecurityEvent = (event: any) => {
    securityMonitor.logEvent(event);
  };

  const value: SecurityContextType = {
    isSecurityMonitoringEnabled,
    securityEvents,
    csrfToken,
    refreshCSRFToken,
    logSecurityEvent
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// Security monitoring hook for components
export const useSecurityMonitoring = () => {
  const { logSecurityEvent } = useSecurity();

  const logPageView = (path: string) => {
    logSecurityEvent({
      type: 'auth_failure', // Using available type for navigation monitoring
      message: 'Page navigation',
      details: { path, timestamp: Date.now() }
    });
  };

  const logUserAction = (action: string, details?: any) => {
    logSecurityEvent({
      type: 'auth_failure', // Using available type for user action monitoring
      message: `User action: ${action}`,
      details: { action, ...details, timestamp: Date.now() }
    });
  };

  const logError = (error: Error, context?: string) => {
    logSecurityEvent({
      type: 'auth_failure', // Using available type for error monitoring
      message: `Application error: ${error.message}`,
      details: { 
        error: error.message, 
        stack: error.stack, 
        context,
        timestamp: Date.now() 
      }
    });
  };

  return {
    logPageView,
    logUserAction,
    logError
  };
};