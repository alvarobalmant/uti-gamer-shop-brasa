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

// Predefined validation patterns for common use cases
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, // Minimum complexity
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/
};

// Common blocked patterns for security
export const BlockedPatterns = {
  script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  iframe: /<iframe\b[^>]*>/gi,
  object: /<object\b[^>]*>/gi,
  embed: /<embed\b[^>]*>/gi,
  style: /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  javascript: /javascript:/gi,
  vbscript: /vbscript:/gi,
  onEvents: /on\w+\s*=/gi
};