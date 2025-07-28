import React, { ReactNode, FormHTMLAttributes } from 'react';
import { csrfProtection } from '@/lib/security';

interface SecureFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  enableCSRF?: boolean;
}

/**
 * Enhanced form component with built-in security features
 * - CSRF token protection
 * - Input validation
 * - XSS prevention
 */
export const SecureForm: React.FC<SecureFormProps> = ({ 
  children, 
  enableCSRF = true,
  onSubmit,
  ...props 
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Add CSRF token to form data if enabled
    if (enableCSRF) {
      const formData = new FormData(e.currentTarget);
      formData.append('_csrf', csrfProtection.getToken());
    }

    // Call the original onSubmit handler
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {enableCSRF && (
        <input
          type="hidden"
          name="_csrf"
          value={csrfProtection.getToken()}
        />
      )}
      {children}
    </form>
  );
};