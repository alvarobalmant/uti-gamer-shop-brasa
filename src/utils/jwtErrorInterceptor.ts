import { supabase } from '@/integrations/supabase/client';
import { sessionMonitor } from './sessionMonitor';

// Global JWT error interceptor that catches and handles JWT errors across the entire app
class JWTErrorInterceptor {
  private isInitialized = false;
  private onSessionRecoveryCallback: (() => void) | null = null;

  // Initialize the global error interceptor
  initialize(onSessionRecovery?: () => void) {
    if (this.isInitialized) return;

    this.onSessionRecoveryCallback = onSessionRecovery || null;
    this.setupGlobalErrorHandlers();
    this.setupSupabaseErrorInterception();
    this.isInitialized = true;

    console.log('🛡️ [JWTInterceptor] Global JWT error interceptor initialized');
  }

  // Set up global error handlers for unhandled JWT errors
  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isJWTError(event.reason)) {
        console.warn('🚨 [JWTInterceptor] Caught unhandled JWT rejection:', event.reason);
        this.handleJWTError(event.reason, 'unhandled-rejection');
        event.preventDefault(); // Prevent console error
      }
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      if (this.isJWTError(event.error)) {
        console.warn('🚨 [JWTInterceptor] Caught global JWT error:', event.error);
        this.handleJWTError(event.error, 'global-error');
      }
    });

    // Intercept console.error to catch JWT errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if any argument indicates a JWT error
      const hasJWTError = args.some(arg => this.isJWTError(arg));
      
      if (hasJWTError) {
        console.warn('🚨 [JWTInterceptor] JWT error detected in console.error');
        this.handleJWTError(args[0], 'console-error');
      }
      
      originalConsoleError.apply(console, args);
    };
  }

  // Set up Supabase-specific error interception
  private setupSupabaseErrorInterception() {
    // Monitor auth state changes for session issues
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ [JWTInterceptor] Token refreshed successfully');
        this.onSessionRecovered();
      } else if (event === 'SIGNED_OUT' && session === null) {
        console.log('🚪 [JWTInterceptor] User signed out');
        this.handleSessionLoss();
      }
    });
  }

  // Check if an error is JWT-related
  private isJWTError(error: any): boolean {
    if (!error) return false;

    const errorString = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    const lowerError = errorString.toLowerCase();

    const jwtPatterns = [
      'jwt', 'token', 'unauthorized', 'invalid claim',
      'missing sub claim', 'bad_jwt', 'expired', 'invalid signature',
      'token has expired', 'authentication required', 'pgrst301'
    ];

    return jwtPatterns.some(pattern => lowerError.includes(pattern));
  }

  // Handle JWT errors with appropriate recovery actions
  private async handleJWTError(error: any, source: string) {
    console.error(`🔥 [JWTInterceptor] JWT error from ${source}:`, error);
    
    // Log to session monitor
    sessionMonitor.logJWTExpiration(source);

    // Attempt immediate session recovery
    await this.attemptSessionRecovery();
  }

  // Attempt to recover the session
  private async attemptSessionRecovery(): Promise<boolean> {
    try {
      console.log('🔄 [JWTInterceptor] Attempting session recovery...');

      // First try to refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (!error && session) {
        console.log('✅ [JWTInterceptor] Session recovered successfully');
        this.onSessionRecovered();
        return true;
      }

      // If refresh fails, check if user is still logged in
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn('⚠️ [JWTInterceptor] No valid user session found');
        this.handleSessionLoss();
        return false;
      }

      // User exists but session is problematic - try one more refresh
      const { data: { session: newSession }, error: retryError } = await supabase.auth.refreshSession();

      if (!retryError && newSession) {
        console.log('✅ [JWTInterceptor] Session recovered on retry');
        this.onSessionRecovered();
        return true;
      }

      console.error('❌ [JWTInterceptor] Session recovery failed');
      this.handleSessionLoss();
      return false;

    } catch (error) {
      console.error('❌ [JWTInterceptor] Session recovery error:', error);
      this.handleSessionLoss();
      return false;
    }
  }

  // Handle successful session recovery
  private onSessionRecovered() {
    console.log('🎉 [JWTInterceptor] Session recovery completed');
    
    if (this.onSessionRecoveryCallback) {
      this.onSessionRecoveryCallback();
    }

    // Optionally reload the page to reset application state
    if (sessionMonitor.needsAttention()) {
      console.log('🔄 [JWTInterceptor] Reloading page to reset application state');
      window.location.reload();
    }
  }

  // Handle complete session loss
  private handleSessionLoss() {
    console.warn('⚠️ [JWTInterceptor] Session lost - user needs to re-authenticate');
    
    // Clear any cached data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();

    // Redirect to login if not already there
    if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/login')) {
      console.log('🚪 [JWTInterceptor] Redirecting to authentication');
      window.location.href = '/auth';
    }
  }

  // Check if interceptor is active
  isActive(): boolean {
    return this.isInitialized;
  }

  // Clean up interceptor
  destroy() {
    this.isInitialized = false;
    this.onSessionRecoveryCallback = null;
    console.log('🛡️ [JWTInterceptor] Interceptor destroyed');
  }
}

export const jwtErrorInterceptor = new JWTErrorInterceptor();