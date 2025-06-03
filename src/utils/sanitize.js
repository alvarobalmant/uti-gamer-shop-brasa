// Utilitário para sanitização de HTML
import DOMPurify from 'dompurify';

/**
 * Sanitiza conteúdo HTML para prevenir ataques XSS
 * 
 * @param {string} html - O conteúdo HTML a ser sanitizado
 * @param {Object} options - Opções adicionais de configuração
 * @returns {string} - HTML sanitizado
 */
export const sanitizeHtml = (html, options = {}) => {
  if (!html) return '';
  
  // Configurações padrão para sanitização
  const defaultOptions = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'b', 'i', 'strong', 
      'em', 'ul', 'ol', 'li', 'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'id', 'style'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    ...options
  };
  
  // Sanitizar o HTML
  return DOMPurify.sanitize(html, defaultOptions);
};

/**
 * Sanitiza texto simples (remove tags HTML)
 * 
 * @param {string} text - O texto a ser sanitizado
 * @returns {string} - Texto sanitizado
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  
  // Remover todas as tags HTML
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitiza URL para prevenir ataques de injeção
 * 
 * @param {string} url - A URL a ser sanitizada
 * @returns {string} - URL sanitizada ou vazia se inválida
 */
export const sanitizeUrl = (url) => {
  if (!url) return '';
  
  try {
    // Verificar se é uma URL válida
    const parsedUrl = new URL(url);
    
    // Permitir apenas protocolos seguros
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '';
    }
    
    return parsedUrl.toString();
  } catch (error) {
    // URL inválida
    return '';
  }
};

/**
 * Sanitiza dados de entrada para prevenir injeção SQL
 * 
 * @param {string} input - O texto a ser sanitizado
 * @returns {string} - Texto sanitizado
 */
export const sanitizeSqlInput = (input) => {
  if (!input) return '';
  
  // Escapar caracteres especiais SQL
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, "\\\\")
    .replace(/\0/g, "\\0")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\x1a/g, "\\Z");
};

/**
 * Sanitiza dados para uso em JSON
 * 
 * @param {any} data - Os dados a serem sanitizados
 * @returns {any} - Dados sanitizados
 */
export const sanitizeJsonData = (data) => {
  if (!data) return null;
  
  // Se for string, sanitizar como texto
  if (typeof data === 'string') {
    return sanitizeText(data);
  }
  
  // Se for objeto ou array, processar recursivamente
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeJsonData(item));
    } else {
      const result = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result[key] = sanitizeJsonData(data[key]);
        }
      }
      return result;
    }
  }
  
  // Outros tipos primitivos são seguros
  return data;
};
