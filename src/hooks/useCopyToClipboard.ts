import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface CopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
}

export const useCopyToClipboard = (options: CopyToClipboardOptions = {}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    successMessage = 'Código copiado!',
    errorMessage = 'Erro ao copiar código'
  } = options;

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return false;

    setIsLoading(true);
    setIsCopied(false);

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      toast({
        title: successMessage,
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast({
        title: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [successMessage, errorMessage]);

  return {
    copyToClipboard,
    isCopied,
    isLoading
  };
};