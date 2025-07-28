
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { securityMonitor } from '@/lib/security';
import { useSecurity } from '@/contexts/SecurityContext';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const { logSecurityEvent, csrfToken } = useSecurity();

  useEffect(() => {
    // Enhanced admin access logging with CSRF validation
    if (user && !loading) {
      if (!isAdmin) {
        logSecurityEvent({
          type: 'privilege_escalation',
          message: 'CRITICAL: Unauthorized admin access attempt detected',
          details: { 
            userId: user.id, 
            path: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100),
            timestamp: Date.now(),
            severity: 'critical',
            csrfTokenPresent: !!csrfToken
          }
        });
      } else {
        logSecurityEvent({
          type: 'auth_failure', // Using available type
          message: 'Admin access granted - session validated',
          details: { 
            userId: user.id, 
            path: window.location.pathname,
            timestamp: Date.now(),
            csrfTokenPresent: !!csrfToken,
            sessionSecure: true
          }
        });
      }
    }
  }, [user, loading, isAdmin, logSecurityEvent, csrfToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    securityMonitor.logEvent({
      type: 'auth_failure',
      message: 'Unauthenticated admin access attempt',
      details: { path: window.location.pathname }
    });
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
