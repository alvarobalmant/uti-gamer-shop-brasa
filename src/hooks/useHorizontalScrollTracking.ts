import { useEffect, useRef } from 'react';
import horizontalScrollManager from '@/lib/horizontalScrollManager';

/**
 * Hook para rastrear manualmente elementos com scroll horizontal
 * Útil para carrosséis de produtos específicos
 */
export const useHorizontalScrollTracking = (enabled: boolean = true) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    
    // Adiciona elemento ao rastreamento
    horizontalScrollManager.trackElement(element);
    
    return () => {
      // Remove elemento do rastreamento
      horizontalScrollManager.untrackElement(element);
    };
  }, [enabled]);

  return elementRef;
};

/**
 * Hook para forçar rastreamento de múltiplos elementos por seletor
 * Útil para seções dinâmicas
 */
export const useMultipleHorizontalScrollTracking = (
  selectors: string[],
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const elements: HTMLElement[] = [];
    
    // Encontra e rastreia todos os elementos
    selectors.forEach(selector => {
      const foundElements = document.querySelectorAll(selector);
      foundElements.forEach(el => {
        const htmlElement = el as HTMLElement;
        elements.push(htmlElement);
        horizontalScrollManager.trackElement(htmlElement);
      });
    });

    return () => {
      // Remove todos os elementos do rastreamento
      elements.forEach(element => {
        horizontalScrollManager.untrackElement(element);
      });
    };
  }, [selectors.join(','), enabled]);
};