import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionRenewal = () => {
  const { toast } = useToast();

  const renewSession = useCallback(async () => {
    try {
      console.log('🔄 [SessionRenewal] Attempting session renewal...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ [SessionRenewal] Failed to refresh session:', error);
        return false;
      }
      
      if (data?.session) {
        console.log('✅ [SessionRenewal] Session renewed successfully');
        toast({
          title: "Sessão renovada",
          description: "Sua sessão foi renovada automaticamente.",
          duration: 3000,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ [SessionRenewal] Renewal error:', error);
      return false;
    }
  }, [toast]);

  const checkAndRenewIfNeeded = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('🚫 [SessionRenewal] No session to renew');
        return false;
      }
      
      // Check if token is close to expiring (within 5 minutes)
      const tokenPayload = JSON.parse(atob(session.access_token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expirationTime - now;
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeUntilExpiry < fiveMinutes) {
        console.log(`⏰ [SessionRenewal] Token expires in ${Math.round(timeUntilExpiry / 1000)}s, renewing...`);
        return await renewSession();
      }
      
      return true;
    } catch (error) {
      console.error('❌ [SessionRenewal] Error checking token:', error);
      return false;
    }
  }, [renewSession]);

  // Set up automatic session checking
  useEffect(() => {
    // Check session every 10 minutes
    const interval = setInterval(checkAndRenewIfNeeded, 10 * 60 * 1000);
    
    // Initial check
    checkAndRenewIfNeeded();
    
    return () => clearInterval(interval);
  }, [checkAndRenewIfNeeded]);

  return {
    renewSession,
    checkAndRenewIfNeeded
  };
};