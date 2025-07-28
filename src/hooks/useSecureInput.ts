import { useState, useCallback } from 'react';
import { securityMonitor } from '@/lib/security';
import { sanitizeHtml, stripHtml } from '@/lib/sanitizer';

interface ValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowHtml?: boolean;
  allowSpecialChars?: boolean;
  patterns?: RegExp[];
  blockedPatterns?: RegExp[];
  sanitize?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
}

export const useSecureInput = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validateInput = useCallback((
    fieldName: string,
    value: string,
    options: ValidationOptions = {}
  ): ValidationResult => {
    const {
      maxLength = 1000,
      minLength = 0,
      allowHtml = false,
      allowSpecialChars = true,
      patterns = [],
      blockedPatterns = [],
      sanitize = true
    } = options;

    const errors: string[] = [];
    let sanitizedValue = value;

    // Basic length validation
    if (value.length < minLength) {
      errors.push(`Must be at least ${minLength} characters`);
    }

    if (value.length > maxLength) {
      errors.push(`Must not exceed ${maxLength} characters`);
    }

    // Use security monitor for validation
    const validation = securityMonitor.validateInput(value, {
      maxLength,
      minLength,
      allowHtml,
      allowSpecialChars,
      patterns,
      blockedPatterns
    });

    if (!validation.isValid) {
      errors.push(validation.reason || 'Invalid input');
      
      // Log security event for suspicious input
      securityMonitor.logEvent({
        type: 'invalid_input',
        message: `Invalid input detected in field: ${fieldName}`,
        details: { field: fieldName, reason: validation.reason, inputLength: value.length }
      });
    }

    // Sanitize based on options
    if (sanitize) {
      if (allowHtml) {
        sanitizedValue = sanitizeHtml(value);
      } else {
        sanitizedValue = stripHtml(value);
      }
    }

    // XSS detection
    if (securityMonitor.detectXSSAttempt(value)) {
      errors.push('Potentially malicious content detected');
      securityMonitor.logEvent({
        type: 'xss_attempt',
        message: `XSS attempt detected in field: ${fieldName}`,
        details: { field: fieldName, inputLength: value.length }
      });
    }

    const isValid = errors.length === 0;
    
    // Update field errors
    setErrors(prev => ({
      ...prev,
      [fieldName]: errors
    }));

    return {
      isValid,
      sanitizedValue,
      errors
    };
  }, []);

  const clearErrors = useCallback((fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  const getFieldErrors = useCallback((fieldName: string): string[] => {
    return errors[fieldName] || [];
  }, [errors]);

  const hasErrors = useCallback((fieldName?: string): boolean => {
    if (fieldName) {
      return (errors[fieldName] || []).length > 0;
    }
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    validateInput,
    clearErrors,
    getFieldErrors,
    hasErrors,
    errors
  };
};

// Enhanced validation patterns with stronger security
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/, // Increased to 12 chars minimum
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/, // Very strong 16+ chars
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  secureUrl: /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, // HTTPS only
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  safeText: /^[a-zA-Z0-9\s\-_.,:;!?()\[\]]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/,
  safeFilename: /^[a-zA-Z0-9._-]+$/
};

// Enhanced patterns for detecting malicious input and common attack vectors
export const BlockedPatterns = {
  // XSS Prevention
  script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  iframe: /<iframe\b[^>]*>/gi,
  object: /<object\b[^>]*>/gi,
  embed: /<embed\b[^>]*>/gi,
  link: /<link\b[^>]*>/gi,
  style: /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  meta: /<meta\b[^>]*>/gi,
  base: /<base\b[^>]*>/gi,
  
  // Event handlers and protocols
  javascript: /javascript\s*:/gi,
  vbscript: /vbscript\s*:/gi,
  dataUrl: /data\s*:/gi,
  onEvents: /on\w+\s*=/gi,
  inlineStyles: /style\s*=/gi,
  
  // SQL Injection
  sqlInjection: /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s+/gi,
  sqlComments: /(\/\*[\s\S]*?\*\/|--[^\r\n]*)/gi,
  
  // Path Traversal
  pathTraversal: /\.\.[\/\\]/gi,
  absolutePaths: /^(\/|\\|[a-zA-Z]:\\)/gi,
  
  // Command Injection
  commandChars: /[;&|`$(){}[\]]/gi,
  shellCommands: /(cat|ls|dir|type|copy|del|rm|mv|cp|chmod|ps|kill|wget|curl)\s+/gi,
  
  // Additional security patterns
  htmlComments: /<!--[\s\S]*?-->/gi,
  base64Suspicious: /data:[\w\/\+]+;base64,/gi,
  xmlEntities: /<!ENTITY/gi,
  ssiInclusion: /<!--\s*#\s*(include|exec|echo)\s+/gi
};