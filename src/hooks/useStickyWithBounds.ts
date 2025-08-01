import { useEffect, useRef, useCallback } from 'react';
import { StickyManager, throttle, debounce } from '@/lib/stickyHelpers';

interface UseStickyWithBoundsProps {
  enabled?: boolean;
  referenceElementId: string; // ID of the element that defines the bottom boundary
  naturalOffset?: number; // Offset natural do elemento para não grudar no header
}

export const useStickyWithBounds = ({ 
  enabled = true, 
  referenceElementId,
  naturalOffset = 100 // Offset padrão de 100px do header
}: UseStickyWithBoundsProps) => {
  const managerRef = useRef<StickyManager | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isInitializedRef = useRef(false);
  const lastBreakpointRef = useRef<string>('');
  const isMobileLockedRef = useRef(false);
  const initialPositionsRef = useRef<Map<string, { top: number; left: number }>>(new Map());

  // Detectar breakpoint atual
  const getCurrentBreakpoint = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  // Verificar se é mobile
  const isMobile = useCallback(() => {
    return getCurrentBreakpoint() === 'mobile';
  }, [getCurrentBreakpoint]);

  // Salvar posições iniciais dos elementos
  const saveInitialPositions = useCallback(() => {
    elementsRef.current.forEach((element, id) => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      initialPositionsRef.current.set(id, {
        top: rect.top + scrollTop,
        left: rect.left
      });
    });
    console.log('[MOBILE LOCK] Posições iniciais salvas:', Array.from(initialPositionsRef.current.entries()));
  }, []);

  // Travar elementos na posição inicial (modo mobile)
  const lockElementsToInitialPosition = useCallback(() => {
    if (isMobileLockedRef.current) return;
    
    console.log('[MOBILE LOCK] Travando elementos na posição inicial...');
    isMobileLockedRef.current = true;

    elementsRef.current.forEach((element, id) => {
      const initialPos = initialPositionsRef.current.get(id);
      if (initialPos) {
        // Travar na posição inicial absoluta
        element.style.position = 'absolute';
        element.style.top = `${initialPos.top}px`;
        element.style.left = `${initialPos.left}px`;
        element.style.transform = '';
        element.style.willChange = '';
        element.style.zIndex = '10';
        console.log(`[MOBILE LOCK] Elemento ${id} travado em top: ${initialPos.top}px`);
      }
    });
  }, []);

  // Destravar elementos e reativar sticky (modo desktop)
  const unlockElementsAndReactivateSticky = useCallback(() => {
    if (!isMobileLockedRef.current) return;
    
    console.log('[MOBILE LOCK] Destravando elementos e reativando sticky...');
    isMobileLockedRef.current = false;

    // Limpar estilos de travamento
    elementsRef.current.forEach((element) => {
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.transform = '';
      element.style.willChange = '';
      element.style.zIndex = '';
    });

    // Reativar sistema sticky após um frame
    requestAnimationFrame(() => {
      if (managerRef.current) {
        // Re-registrar elementos
        const referenceElement = document.getElementById(referenceElementId);
        if (referenceElement) {
          elementsRef.current.forEach((element, id) => {
            const bounds = managerRef.current!.calculateBounds(element, referenceElement);
            managerRef.current!.removeElement(id);
            managerRef.current!.addElement(id, element, bounds, naturalOffset);
          });
          
          // Atualizar posição baseada no scroll atual
          managerRef.current.updateScroll(window.scrollY);
          console.log('[MOBILE LOCK] Sistema sticky reativado!');
        }
      }
    });
  }, [referenceElementId, naturalOffset]);

  // Initialize the sticky manager
  useEffect(() => {
    if (!enabled) return;

    managerRef.current = new StickyManager();
    lastBreakpointRef.current = getCurrentBreakpoint();
    
    // Se iniciar em mobile, já travar
    if (isMobile()) {
      // Aguardar um frame para elementos estarem renderizados
      requestAnimationFrame(() => {
        saveInitialPositions();
        lockElementsToInitialPosition();
      });
    }
    
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [enabled, getCurrentBreakpoint, isMobile, saveInitialPositions, lockElementsToInitialPosition]);

  // Setup scroll and resize listeners
  useEffect(() => {
    if (!enabled || !managerRef.current) return;

    const handleScroll = throttle(() => {
      // Se estiver em modo mobile travado, não processar scroll
      if (isMobileLockedRef.current) return;
      
      if (managerRef.current) {
        managerRef.current.updateScroll(window.scrollY);
      }
    }, 8); // ~120fps for ultra smooth scrolling

    const handleResize = debounce(() => {
      if (!managerRef.current) return;
      
      const currentBreakpoint = getCurrentBreakpoint();
      const breakpointChanged = currentBreakpoint !== lastBreakpointRef.current;
      
      if (breakpointChanged) {
        console.log(`[MOBILE LOCK] Breakpoint changed: ${lastBreakpointRef.current} → ${currentBreakpoint}`);
        
        if (currentBreakpoint === 'mobile') {
          // Mudou para mobile: salvar posições e travar
          saveInitialPositions();
          lockElementsToInitialPosition();
        } else if (lastBreakpointRef.current === 'mobile') {
          // Saiu do mobile: destravar e reativar sticky
          unlockElementsAndReactivateSticky();
        } else {
          // Mudança entre tablet/desktop: reset normal
          resetAllElementsAndRecalculate();
        }
        
        lastBreakpointRef.current = currentBreakpoint;
      } else if (!isMobileLockedRef.current) {
        // Resize normal em desktop/tablet - apenas atualizar bounds
        updateAllBounds();
      }
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, getCurrentBreakpoint, saveInitialPositions, lockElementsToInitialPosition, unlockElementsAndReactivateSticky]);

  // Reset completo quando muda breakpoint (CORREÇÃO DO BUG)
  const resetAllElementsAndRecalculate = useCallback(() => {
    if (!managerRef.current) return;

    console.log('[STICKY FIX] Fazendo reset completo dos elementos...');
    
    // 1. Reset visual de todos os elementos
    elementsRef.current.forEach((element) => {
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';
      element.style.transform = '';
      element.style.zIndex = '';
    });

    // 2. Limpar manager
    managerRef.current.clearAllStates();

    // 3. Aguardar dois frames para o DOM se estabilizar completamente
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 4. Re-registrar todos os elementos com novos bounds
        const referenceElement = document.getElementById(referenceElementId);
        if (!referenceElement || !managerRef.current) return;

        elementsRef.current.forEach((element, id) => {
          const bounds = managerRef.current!.calculateBounds(element, referenceElement);
          managerRef.current!.addElement(id, element, bounds, naturalOffset);
        });

        // 5. CORREÇÃO CRÍTICA: Forçar múltiplas atualizações para garantir posição correta
        const currentScroll = window.scrollY;
        console.log(`[STICKY FIX] Aplicando scroll atual: ${currentScroll}px`);
        
        // Primeira atualização
        managerRef.current.updateScroll(currentScroll);
        
        // Segunda atualização após um frame (para garantir)
        requestAnimationFrame(() => {
          if (managerRef.current) {
            managerRef.current.updateScroll(window.scrollY);
            console.log('[STICKY FIX] Reset completo finalizado com dupla atualização!');
          }
        });
      });
    });
  }, [referenceElementId, naturalOffset]);

  // Update bounds for all registered elements
  const updateAllBounds = useCallback(() => {
    const referenceElement = document.getElementById(referenceElementId);
    if (!referenceElement || !managerRef.current) return;

    elementsRef.current.forEach((element, id) => {
      const bounds = managerRef.current!.calculateBounds(element, referenceElement);
      
      managerRef.current!.removeElement(id);
      managerRef.current!.addElement(id, element, bounds, naturalOffset);
    });
  }, [referenceElementId, naturalOffset]);

  // Register a sticky element
  const registerStickyElement = useCallback((id: string, element: HTMLElement | null) => {
    if (!enabled || !element || !managerRef.current) return;

    const referenceElement = document.getElementById(referenceElementId);
    if (!referenceElement) {
      console.warn(`Reference element with id "${referenceElementId}" not found`);
      return;
    }

    // Store the element
    elementsRef.current.set(id, element);

    // Se estiver em mobile, apenas salvar posição inicial e travar
    if (isMobile()) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      initialPositionsRef.current.set(id, {
        top: rect.top + scrollTop,
        left: rect.left
      });
      
      // Travar na posição inicial
      element.style.position = 'absolute';
      element.style.top = `${rect.top + scrollTop}px`;
      element.style.left = `${rect.left}px`;
      element.style.zIndex = '10';
      isMobileLockedRef.current = true;
      
      console.log(`[MOBILE LOCK] Elemento ${id} registrado e travado em mobile`);
      return;
    }

    // Calculate bounds para desktop/tablet
    const bounds = managerRef.current.calculateBounds(element, referenceElement);

    // Add to manager
    managerRef.current.addElement(id, element, bounds, naturalOffset);

    // Initial position update
    managerRef.current.updateScroll(window.scrollY);
  }, [enabled, referenceElementId, naturalOffset, isMobile]);

  // Unregister a sticky element
  const unregisterStickyElement = useCallback((id: string) => {
    if (!managerRef.current) return;

    managerRef.current.removeElement(id);
    elementsRef.current.delete(id);
    initialPositionsRef.current.delete(id);
  }, []);

  // Refresh bounds (useful when layout changes)
  const refreshBounds = useCallback(() => {
    if (!isMobileLockedRef.current) {
      updateAllBounds();
    }
  }, [updateAllBounds]);

  // Reset all transforms (useful for cleanup)
  const resetTransforms = useCallback(() => {
    elementsRef.current.forEach((element) => {
      element.style.transform = '';
      element.style.willChange = '';
    });
  }, []);

  return {
    registerStickyElement,
    unregisterStickyElement,
    refreshBounds,
    resetTransforms,
    resetAllElementsAndRecalculate, // Nova função para debug
    isEnabled: enabled,
    isMobileLocked: isMobileLockedRef.current // Para debug
  };
};