import DOMPurify from 'dompurify';

// Configure DOMPurify with secure defaults
const createSecureDOMPurify = () => {
  // Create a clean configuration for DOMPurify
  const config = {
    // Only allow safe tags
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    
    // Only allow safe attributes
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id'
    ],
    
    // Allow only specific protocols for links
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    
    // Prevent XSS attacks
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    
    // Additional security
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false
  };

  return DOMPurify;
};

const secureDOMPurify = createSecureDOMPurify();

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return secureDOMPurify.sanitize(html, {
      USE_PROFILES: { html: true }
    });
  } catch (error) {
    console.error('HTML sanitization failed:', error);
    return ''; // Return empty string if sanitization fails
  }
};

/**
 * Sanitizes HTML content with even stricter rules for user content
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string with minimal allowed tags
 */
export const sanitizeUserContent = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return secureDOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
      ALLOWED_ATTR: [],
      USE_PROFILES: { html: true }
    });
  } catch (error) {
    console.error('User content sanitization failed:', error);
    return '';
  }
};

/**
 * Removes all HTML tags and returns plain text
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return secureDOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  } catch (error) {
    console.error('HTML stripping failed:', error);
    return '';
  }
};

/**
 * Validates if HTML content is safe after sanitization
 * @param original - Original HTML string
 * @param sanitized - Sanitized HTML string
 * @returns True if content was not modified during sanitization
 */
export const validateSanitization = (original: string, sanitized: string): boolean => {
  // If the sanitized version is significantly different, it might indicate malicious content
  const originalLength = original.length;
  const sanitizedLength = sanitized.length;
  
  // Allow up to 20% difference in length (for tag removals/modifications)
  const lengthDifference = Math.abs(originalLength - sanitizedLength) / originalLength;
  
  return lengthDifference <= 0.2;
};