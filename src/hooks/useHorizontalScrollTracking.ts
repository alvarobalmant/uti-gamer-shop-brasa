import { useRef } from 'react';

/**
 * PLACEHOLDER: Hook simplificado para compatibilidade
 * Sistema horizontal removido para evitar conflitos de scroll
 */
export const useHorizontalScrollTracking = (sectionId?: string, enabled: boolean = true) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // Sistema horizontal desabilitado para resolver conflitos
  console.log('[HorizontalScrollTracking] Sistema desabilitado para resolver conflitos de scroll');

  return elementRef;
};
