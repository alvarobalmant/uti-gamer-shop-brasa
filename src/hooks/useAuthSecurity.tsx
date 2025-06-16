import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityMetrics } from '@/types/security';

export const useAuthSecurity = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    failedAttempts: 0,
    isBlocked: false,
    lastAttempt: null,
    blockExpiresAt: null
  });

  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  // Log security events usando a nova função do banco
  const logSecurityEvent = async (eventType: string, details: any = {}) => {
    try {
      // Usar a função RPC criada na migração
      const { error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      });

      if (error) {
        console.warn('Erro ao registrar evento de segurança via RPC:', error);
        
        // Fallback: tentar inserção direta na tabela
        await supabase
          .from('security_audit_log')
          .insert({
            event_type: eventType,
            details: {
              ...details,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href
            }
          });
      }
    } catch (error) {
      console.warn('Erro ao registrar evento de segurança:', error);
    }
  };

  // Check if user is currently blocked
  const checkBlockStatus = () => {
    const stored = localStorage.getItem('auth_security_metrics');
    if (stored) {
      const metrics: SecurityMetrics = JSON.parse(stored);
      const now = new Date();
      
      if (metrics.blockExpiresAt && new Date(metrics.blockExpiresAt) > now) {
        setSecurityMetrics({
          ...metrics,
          blockExpiresAt: new Date(metrics.blockExpiresAt),
          lastAttempt: metrics.lastAttempt ? new Date(metrics.lastAttempt) : null
        });
        return true;
      } else if (metrics.isBlocked) {
        // Block expired, reset
        resetSecurityMetrics();
        return false;
      }
    }
    return false;
  };

  // Record failed login attempt
  const recordFailedAttempt = async (email: string, error: string) => {
    const now = new Date();
    const newAttempts = securityMetrics.failedAttempts + 1;
    
    await logSecurityEvent('failed_login_attempt', {
      email,
      attempt_number: newAttempts,
      error_message: error,
      ip_info: 'client_side' // Could be enhanced with actual IP detection
    });

    const newMetrics: SecurityMetrics = {
      failedAttempts: newAttempts,
      isBlocked: newAttempts >= MAX_ATTEMPTS,
      lastAttempt: now,
      blockExpiresAt: newAttempts >= MAX_ATTEMPTS ? new Date(now.getTime() + BLOCK_DURATION) : null
    };

    setSecurityMetrics(newMetrics);
    localStorage.setItem('auth_security_metrics', JSON.stringify(newMetrics));

    if (newAttempts >= MAX_ATTEMPTS) {
      await logSecurityEvent('account_temporarily_blocked', {
        email,
        total_attempts: newAttempts,
        block_duration_minutes: BLOCK_DURATION / 60000
      });
    }

    return newMetrics;
  };

  // Record successful login
  const recordSuccessfulLogin = async (email: string, isAdmin: boolean = false) => {
    await logSecurityEvent(isAdmin ? 'admin_login_success' : 'user_login_success', {
      email,
      session_start: new Date().toISOString()
    });

    // Reset security metrics on successful login
    resetSecurityMetrics();
  };

  // Reset security metrics
  const resetSecurityMetrics = () => {
    const resetMetrics: SecurityMetrics = {
      failedAttempts: 0,
      isBlocked: false,
      lastAttempt: null,
      blockExpiresAt: null
    };
    setSecurityMetrics(resetMetrics);
    localStorage.removeItem('auth_security_metrics');
  };

  // Get time remaining in block
  const getBlockTimeRemaining = (): number => {
    if (!securityMetrics.blockExpiresAt) return 0;
    const remaining = securityMetrics.blockExpiresAt.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
  };

  // Check and update block status on component mount
  useEffect(() => {
    checkBlockStatus();
    
    // Set up interval to check block expiry
    const interval = setInterval(() => {
      if (securityMetrics.isBlocked && securityMetrics.blockExpiresAt) {
        if (new Date() >= securityMetrics.blockExpiresAt) {
          resetSecurityMetrics();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [securityMetrics.isBlocked, securityMetrics.blockExpiresAt]);

  return {
    securityMetrics,
    recordFailedAttempt,
    recordSuccessfulLogin,
    resetSecurityMetrics,
    getBlockTimeRemaining,
    logSecurityEvent,
    isBlocked: securityMetrics.isBlocked,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - securityMetrics.failedAttempts)
  };
};
