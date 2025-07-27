
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { securityMonitor } from '@/lib/security';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    // Log admin access attempts for security monitoring
    if (user && !loading) {
      if (!isAdmin) {
        securityMonitor.logEvent({
          type: 'privilege_escalation',
          message: 'Unauthorized admin access attempt',
          details: { userId: user.id, path: window.location.pathname }
        });
      } else {
        securityMonitor.logEvent({
          type: 'auth_failure', // Using available type
          message: 'Admin access granted',
          details: { userId: user.id, path: window.location.pathname }
        });
      }
    }
  }, [user, loading, isAdmin]);

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
