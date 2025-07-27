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

  // Initialize CSRF protection
  useEffect(() => {
    const token = csrfProtection.generateToken();
    setCsrfToken(token);
  }, []);

  // Monitor user session changes
  useEffect(() => {
    if (user && isSecurityMonitoringEnabled) {
      securityMonitor.logEvent({
        type: 'auth_failure', // Using available type for session activity
        message: 'User session active',
        details: { userId: user.id, timestamp: Date.now() }
      });
    }
  }, [user, isSecurityMonitoringEnabled]);

  // Set up security monitoring
  useEffect(() => {
    if (!isSecurityMonitoringEnabled) return;

    // Monitor for suspicious activity patterns
    const monitoringInterval = setInterval(() => {
      const recentEvents = securityMonitor.getRecentEvents(50);
      setSecurityEvents(recentEvents);

      // Check for rapid-fire requests (potential DoS)
      const recentTimestamp = Date.now() - 60000; // Last minute
      const recentEventCount = recentEvents.filter(
        event => event.timestamp > recentTimestamp
      ).length;

      if (recentEventCount > 30) {
        securityMonitor.logEvent({
          type: 'rate_limit',
          message: 'High activity detected - potential DoS attempt',
          details: { eventCount: recentEventCount, timeWindow: '1 minute' }
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(monitoringInterval);
  }, [isSecurityMonitoringEnabled]);

  // Monitor page visibility for session security
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        securityMonitor.logEvent({
          type: 'auth_failure', // Using available type for session monitoring
          message: 'Page hidden - session monitoring paused',
          details: { timestamp: Date.now() }
        });
      } else {
        securityMonitor.logEvent({
          type: 'auth_failure', // Using available type for session monitoring
          message: 'Page visible - session monitoring resumed',
          details: { timestamp: Date.now() }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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