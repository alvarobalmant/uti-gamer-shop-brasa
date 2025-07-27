/**
 * Security utilities and monitoring functions
 * Helps prevent and detect security vulnerabilities
 */

interface SecurityEvent {
  type: 'xss_attempt' | 'invalid_input' | 'privilege_escalation' | 'rate_limit' | 'auth_failure';
  message: string;
  details?: Record<string, any>;
  timestamp: number;
  userAgent?: string;
  ip?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private rateLimitAttempts: Map<string, number[]> = new Map();

  /**
   * Log a security event for monitoring
   */
  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator?.userAgent,
    };
    
    this.events.push(securityEvent);
    
    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Security Event]', securityEvent);
    }
  }

  /**
   * Check for potential XSS patterns in user input
   */
  detectXSSAttempt(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ];

    const hasXSS = xssPatterns.some(pattern => pattern.test(input));
    
    if (hasXSS) {
      this.logEvent({
        type: 'xss_attempt',
        message: 'Potential XSS attempt detected in user input',
        details: { input: input.substring(0, 100) } // Only log first 100 chars
      });
    }
    
    return hasXSS;
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.rateLimitAttempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      this.logEvent({
        type: 'rate_limit',
        message: `Rate limit exceeded for identifier: ${identifier}`,
        details: { attempts: validAttempts.length, maxAttempts }
      });
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.rateLimitAttempts.set(identifier, validAttempts);
    
    return true;
  }

  /**
   * Validate input to prevent common injection attacks
   */
  validateInput(input: string, options: {
    maxLength?: number;
    allowHtml?: boolean;
    allowSpecialChars?: boolean;
  } = {}): { isValid: boolean; reason?: string } {
    const { maxLength = 10000, allowHtml = false, allowSpecialChars = true } = options;
    
    // Check length
    if (input.length > maxLength) {
      this.logEvent({
        type: 'invalid_input',
        message: 'Input exceeds maximum length',
        details: { length: input.length, maxLength }
      });
      return { isValid: false, reason: 'Input too long' };
    }
    
    // Check for XSS if HTML is not allowed
    if (!allowHtml && this.detectXSSAttempt(input)) {
      return { isValid: false, reason: 'Potentially malicious content detected' };
    }
    
    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/gi,
      /union\s+select/gi,
      /insert\s+into/gi,
      /delete\s+from/gi,
      /drop\s+table/gi,
      /update\s+\w+\s+set/gi
    ];
    
    const hasSQLInjection = sqlPatterns.some(pattern => pattern.test(input));
    if (hasSQLInjection) {
      this.logEvent({
        type: 'invalid_input',
        message: 'Potential SQL injection attempt detected',
        details: { input: input.substring(0, 100) }
      });
      return { isValid: false, reason: 'Potentially malicious SQL content detected' };
    }
    
    return { isValid: true };
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Clear stored events (useful for privacy)
   */
  clearEvents(): void {
    this.events = [];
    this.rateLimitAttempts.clear();
  }
}

// Global security monitor instance
export const securityMonitor = new SecurityMonitor();

/**
 * CSRF token management
 */
class CSRFProtection {
  private token: string | null = null;
  
  /**
   * Generate a new CSRF token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return this.token;
  }
  
  /**
   * Get the current CSRF token
   */
  getToken(): string {
    if (!this.token) {
      return this.generateToken();
    }
    return this.token;
  }
  
  /**
   * Validate a CSRF token
   */
  validateToken(token: string): boolean {
    if (!this.token) {
      return false;
    }
    return token === this.token;
  }
  
  /**
   * Clear the current token
   */
  clearToken(): void {
    this.token = null;
  }
}

export const csrfProtection = new CSRFProtection();

/**
 * Secure headers for requests
 */
export const getSecureHeaders = (): Record<string, string> => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-CSRF-Token': csrfProtection.getToken(),
});

/**
 * Content Security Policy helpers
 */
export const CSP_DIRECTIVES = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' https://pmxnfpnnvtuuiedoxuxc.supabase.co",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: https: blob:",
  'font-src': "'self' data:",
  'connect-src': "'self' https://pmxnfpnnvtuuiedoxuxc.supabase.co wss://pmxnfpnnvtuuiedoxuxc.supabase.co",
  'frame-ancestors': "'none'",
  'object-src': "'none'",
  'base-uri': "'self'"
};

export const getCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ');
};
