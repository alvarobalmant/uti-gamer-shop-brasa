import { useEffect, useRef } from 'react';
import preLoadHorizontalScrollManager from '@/lib/preLoadHorizontalScrollManager';

/**
 * Hook que OBRIGATORIAMENTE consulta posição anterior ANTES do carregamento
 * e registra a seção para salvamento contínuo
 */
export const usePreLoadHorizontalScroll = (sectionId: string, enabled: boolean = true) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef<number | null>(null);

  // PRIMEIRO: Consulta posição salva ANTES de qualquer renderização
  if (enabled && initialPositionRef.current === null) {
    initialPositionRef.current = preLoadHorizontalScrollManager.getInitialScrollPosition(sectionId);
    console.log(`[usePreLoadHorizontalScroll] 🔍 Consultando posição para ${sectionId}: ${initialPositionRef.current}px`);
  }

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    
    // Registra a seção para salvamento contínuo
    preLoadHorizontalScrollManager.registerSection(sectionId, element);
    
    // Aplica posição inicial se não foi aplicada ainda
    const savedPosition = initialPositionRef.current || 0;
    if (savedPosition > 0 && element.scrollLeft === 0) {
      console.log(`[usePreLoadHorizontalScroll] ⚡ Aplicando posição inicial para ${sectionId}: ${savedPosition}px`);
      element.scrollLeft = savedPosition;
    }

    return () => {
      preLoadHorizontalScrollManager.unregisterSection(sectionId);
    };
  }, [sectionId, enabled]);

  return {
    elementRef,
    initialScrollLeft: initialPositionRef.current || 0
  };
};

/**
 * Hook para múltiplas seções com prefixo
 */
export const useMultiplePreLoadHorizontalScroll = (
  baseSectionId: string,
  count: number,
  enabled: boolean = true
) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const initialPositions = useRef<number[]>([]);

  // Consulta todas as posições ANTES da renderização
  if (enabled && initialPositions.current.length === 0) {
    for (let i = 0; i < count; i++) {
      const sectionId = `${baseSectionId}-${i}`;
      const position = preLoadHorizontalScrollManager.getInitialScrollPosition(sectionId);
      initialPositions.current.push(position);
    }
  }

  useEffect(() => {
    if (!enabled) return;

    const cleanupFunctions: (() => void)[] = [];

    refs.current.forEach((element, index) => {
      if (element) {
        const sectionId = `${baseSectionId}-${index}`;
        preLoadHorizontalScrollManager.registerSection(sectionId, element);
        
        // Aplica posição inicial
        const savedPosition = initialPositions.current[index] || 0;
        if (savedPosition > 0) {
          element.scrollLeft = savedPosition;
        }

        cleanupFunctions.push(() => {
          preLoadHorizontalScrollManager.unregisterSection(sectionId);
        });
      }
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [baseSectionId, count, enabled]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  return {
    setRef,
    initialPositions: initialPositions.current
  };
};