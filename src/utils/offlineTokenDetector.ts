import { supabase } from '@/integrations/supabase/client';
import { sessionMonitor } from './sessionMonitor';

// Detector for tokens that expired while offline
class OfflineTokenDetector {
  private isOnline = navigator.onLine;
  private wasOffline = false;
  private lastOnlineTime = Date.now();
  private tokenValidationPending = false;

  constructor() {
    this.setupOnlineOfflineListeners();
    this.setupVisibilityChangeListener();
    this.setupFocusListener();
  }

  private setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 [OfflineDetector] Connection restored');
      this.isOnline = true;
      this.handleConnectionRestored();
    });

    window.addEventListener('offline', () => {
      console.log('📴 [OfflineDetector] Connection lost');
      this.isOnline = false;
      this.wasOffline = true;
      this.lastOnlineTime = Date.now();
    });
  }

  private setupVisibilityChangeListener() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.wasOffline) {
        console.log('👁️ [OfflineDetector] Tab visible after offline period');
        this.handleReturnFromOffline();
      }
    });
  }

  private setupFocusListener() {
    window.addEventListener('focus', () => {
      console.log('🎯 [OfflineDetector] Window focused');
      this.validateSessionOnFocus();
    });
  }

  private async handleConnectionRestored() {
    if (this.wasOffline) {
      console.log('🔍 [OfflineDetector] Validating session after offline period');
      await this.validateTokenAfterOffline();
      this.wasOffline = false;
    }
  }

  private async handleReturnFromOffline() {
    if (this.wasOffline && this.isOnline) {
      console.log('🔄 [OfflineDetector] Checking token after returning from offline');
      await this.validateTokenAfterOffline();
      this.wasOffline = false;
    }
  }

  private async validateSessionOnFocus() {
    // Avoid multiple concurrent validations
    if (this.tokenValidationPending) return;

    try {
      this.tokenValidationPending = true;
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('✅ [OfflineDetector] No session to validate');
        return;
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = session.expires_at || 0;
      
      if (tokenExp <= now) {
        console.warn('⚠️ [OfflineDetector] Token expired on focus - forcing application reset');
        sessionMonitor.logJWTExpiration('focus-validation');
        this.forceApplicationReset('token-expired-on-focus');
        return;
      }

      // Test if token actually works
      const { error: testError } = await supabase.auth.getUser();
      
      if (testError) {
        console.warn('🚨 [OfflineDetector] Token validation failed on focus - forcing application reset');
        sessionMonitor.logJWTExpiration('focus-test');
        this.forceApplicationReset('token-validation-failed-on-focus');
      } else {
        console.log('✅ [OfflineDetector] Session validated successfully on focus');
      }

    } catch (error) {
      console.error('❌ [OfflineDetector] Error during focus validation:', error);
      this.forceApplicationReset('focus-validation-error');
    } finally {
      this.tokenValidationPending = false;
    }
  }

  private async validateTokenAfterOffline(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [OfflineDetector] Error getting session:', error);
        this.forceApplicationReset('session-error-after-offline');
        return false;
      }

      if (!session) {
        console.log('ℹ️ [OfflineDetector] No session found');
        return true; // No session is valid
      }

      // Check if token expired while offline
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = session.expires_at || 0;
      const offlineDuration = Date.now() - this.lastOnlineTime;

      console.log(`🔍 [OfflineDetector] Token expires at: ${new Date(tokenExp * 1000).toLocaleString()}`);
      console.log(`🔍 [OfflineDetector] Current time: ${new Date(now * 1000).toLocaleString()}`);
      console.log(`🔍 [OfflineDetector] Offline duration: ${Math.round(offlineDuration / 1000)}s`);

      if (tokenExp <= now) {
        console.warn('⏰ [OfflineDetector] Token expired while offline - forcing application reset');
        sessionMonitor.logJWTExpiration('offline-expiration');
        this.forceApplicationReset('token-expired-offline');
        return false;
      }

      // Test if token actually works (ghost state detection)
      const { error: testError } = await supabase.auth.getUser();
      
      if (testError) {
        console.warn('👻 [OfflineDetector] Ghost state detected after offline period - forcing application reset');
        sessionMonitor.logJWTExpiration('offline-ghost-state');
        this.forceApplicationReset('ghost-state-offline');
        return false;
      }

      console.log('✅ [OfflineDetector] Token is valid after offline period');
      return true;

    } catch (error) {
      console.error('❌ [OfflineDetector] Error validating token after offline:', error);
      this.forceApplicationReset('validation-error-offline');
      return false;
    }
  }

  private async attemptTokenRefresh(): Promise<boolean> {
    try {
      console.log('🔄 [OfflineDetector] Attempting token refresh...');
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ [OfflineDetector] Token refresh failed:', error);
        
        // Force sign out if refresh fails
        console.log('🚪 [OfflineDetector] Forcing sign out due to refresh failure');
        await supabase.auth.signOut();
        return false;
      }

      if (session) {
        console.log('✅ [OfflineDetector] Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [OfflineDetector] Error during token refresh:', error);
      return false;
    }
  }

  // Get current offline status
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      wasOffline: this.wasOffline,
      lastOnlineTime: this.lastOnlineTime,
      offlineDuration: this.wasOffline ? Date.now() - this.lastOnlineTime : 0
    };
  }

  // Force application reset for offline-related session issues
  private forceApplicationReset(reason: string) {
    console.warn(`🔄 [OfflineDetector] Forcing application reset due to: ${reason}`);
    
    // Clear all session storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Clear Supabase client cache
    try {
      supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.warn('Failed to sign out locally:', error);
    }
    
    // Force page reload to reset application state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  // Force validation (useful for manual triggers)
  async forceValidation(): Promise<boolean> {
    console.log('🔄 [OfflineDetector] Force validation triggered');
    return await this.validateTokenAfterOffline();
  }
}

export const offlineTokenDetector = new OfflineTokenDetector();