
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { securityMonitor } from '@/lib/security';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      securityMonitor.logEvent({
        type: 'privilege_escalation',
        message: 'User accessed protected route',
        details: { userId: user.id, path: window.location.pathname }
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    securityMonitor.logEvent({
      type: 'auth_failure',
      message: 'Unauthorized access attempt to protected route',
      details: { path: window.location.pathname }
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
