
import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  saveScrollPosition as managerSaveScrollPosition,
  getSavedScrollPosition,
  removeScrollPosition,
  setIsRestoring,
  getIsRestoring
} from '@/lib/scrollRestorationManager';

/**
 * Hook avançado para restauração de posição de scroll entre navegações
 * Versão otimizada para eliminar o "flash" ao topo
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const initialRenderRef = useRef(true);
  const isRestoringRef = useRef(false);

  // Restaura a posição de scroll quando retornamos a uma página (POP)
  const restoreScrollPosition = useCallback((path: string, context: string) => {
    const savedPosition = getSavedScrollPosition(path);
    console.log(`[useScrollRestoration v6 - ${context}] Attempting restore for ${path}. Found saved position:`, savedPosition);

    if (savedPosition) {
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms

      if (now - savedPosition.timestamp < expirationTime) {
        setIsRestoring(true);
        isRestoringRef.current = true;
        console.log(`[useScrollRestoration v6 - ${context}] Setting isRestoring = true for ${path}`);

        // Usar requestAnimationFrame para garantir que a restauração aconteça no próximo frame
        requestAnimationFrame(() => {
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto'
          });

          // Verificar se a posição foi alcançada com timeout reduzido
          setTimeout(() => {
            const currentY = window.scrollY;
            const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 20;
            console.log(`[useScrollRestoration v6 - ${context}] Restore result: currentY=${currentY}, targetY=${savedPosition.y}, success=${isCloseEnough}`);
            
            setIsRestoring(false);
            isRestoringRef.current = false;
          }, 100);
        });

      } else {
        console.log(`[useScrollRestoration v6 - ${context}] Position for ${path} expired.`);
        removeScrollPosition(path);
      }
    } else {
      console.log(`[useScrollRestoration v6 - ${context}] No saved position for ${path}.`);
    }
  }, []);

  // Efeito principal que gerencia a restauração de scroll
  useLayoutEffect(() => {
    const { pathname } = location;
    console.log(`[useScrollRestoration v6] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('[useScrollRestoration v6] Initial render, skipping logic.');
      return;
    }

    if (navigationType === 'POP') {
      console.log('[useScrollRestoration v6] Navigation type: POP - Requesting scroll restoration');
      // Pequeno delay para permitir que o layout se estabilize
      setTimeout(() => restoreScrollPosition(pathname, 'LayoutEffect POP'), 50);
    } else {
      console.log(`[useScrollRestoration v6] Navigation type: ${navigationType} - New navigation to ${pathname}.`);
      // REMOVIDO: window.scrollTo para evitar o "flash"
      // O browser já inicia no topo por padrão em navegações PUSH/REPLACE
    }

    // Função de limpeza: Salva a posição ANTES de desmontar
    const currentPath = pathname;
    return () => {
      console.log(`[useScrollRestoration v6] Cleanup function running for path: ${currentPath}. isRestoring: ${getIsRestoring()}`);
      if (!getIsRestoring() && !isRestoringRef.current) {
        managerSaveScrollPosition(currentPath, 'LayoutEffect cleanup');
      }
    };
  }, [location, navigationType, restoreScrollPosition]);

  // Salva periodicamente durante a rolagem na página (com debounce)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (getIsRestoring() || isRestoringRef.current || document.visibilityState === 'hidden') {
        return;
      }

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        managerSaveScrollPosition(pathname, 'debounced scroll');
      }, 250);
    };

    console.log(`[useScrollRestoration v6] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration v6] Removing scroll listener for path: ${pathname}`);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Listener de visibilidade simplificado
  useEffect(() => {
    const { pathname } = location;
    const handleVisibilityChange = () => {
      console.log(`[useScrollRestoration v6] Visibility changed to: ${document.visibilityState}`);
      // Apenas log, sem ações automáticas
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log(`[useScrollRestoration v6] Added visibility listener for path: ${pathname}`);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log(`[useScrollRestoration v6] Removed visibility listener for path: ${pathname}`);
    };
  }, [location.pathname, navigationType]);
};
