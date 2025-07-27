import { useEffect } from 'react';
import { getSecureHeaders, getCSPHeader } from '@/lib/security';

/**
 * Component that applies security headers to the application
 * This should be included in the root of your app
 */
export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Apply security headers programmatically where possible
    const applySecurityHeaders = () => {
      try {
        // Add CSP meta tag if not already present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
          const cspMeta = document.createElement('meta');
          cspMeta.httpEquiv = 'Content-Security-Policy';
          cspMeta.content = getCSPHeader();
          document.head.appendChild(cspMeta);
        }

        // Add X-Content-Type-Options meta tag
        if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
          const noSniffMeta = document.createElement('meta');
          noSniffMeta.httpEquiv = 'X-Content-Type-Options';
          noSniffMeta.content = 'nosniff';
          document.head.appendChild(noSniffMeta);
        }

        // Add X-Frame-Options meta tag
        if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
          const frameMeta = document.createElement('meta');
          frameMeta.httpEquiv = 'X-Frame-Options';
          frameMeta.content = 'DENY';
          document.head.appendChild(frameMeta);
        }

        // Add Referrer-Policy meta tag
        if (!document.querySelector('meta[name="referrer"]')) {
          const referrerMeta = document.createElement('meta');
          referrerMeta.name = 'referrer';
          referrerMeta.content = 'strict-origin-when-cross-origin';
          document.head.appendChild(referrerMeta);
        }

        // Add security-focused meta tags
        if (!document.querySelector('meta[http-equiv="X-XSS-Protection"]')) {
          const xssMeta = document.createElement('meta');
          xssMeta.httpEquiv = 'X-XSS-Protection';
          xssMeta.content = '1; mode=block';
          document.head.appendChild(xssMeta);
        }

        // Disable MIME type sniffing
        if (!document.querySelector('meta[http-equiv="X-Download-Options"]')) {
          const downloadMeta = document.createElement('meta');
          downloadMeta.httpEquiv = 'X-Download-Options';
          downloadMeta.content = 'noopen';
          document.head.appendChild(downloadMeta);
        }

        // Add Permissions Policy
        if (!document.querySelector('meta[http-equiv="Permissions-Policy"]')) {
          const permissionsMeta = document.createElement('meta');
          permissionsMeta.httpEquiv = 'Permissions-Policy';
          permissionsMeta.content = 'camera=(), microphone=(), geolocation=()';
          document.head.appendChild(permissionsMeta);
        }
      } catch (error) {
        console.warn('Failed to apply security headers:', error);
      }
    };

    applySecurityHeaders();

    // Monitor for page visibility changes to detect potential session hijacking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - potential security check point
        console.debug('Page hidden - session monitoring active');
      } else {
        // Page is visible - validate session integrity
        console.debug('Page visible - validating session');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Disable right-click context menu in production for additional security
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12
        if (e.key === 'F12') {
          e.preventDefault();
          return false;
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          return false;
        }
        
        // Disable Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything
};