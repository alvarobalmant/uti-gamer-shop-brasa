import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  saveScrollPosition as managerSaveScrollPosition,
  getSavedScrollPosition,
  removeScrollPosition,
  setIsRestoring,
  getIsRestoring
} from '@/lib/scrollRestorationManager'; // Import functions from the manager

/**
 * Hook avançado para restauração de posição de scroll entre navegações
 * Garante que navegações PUSH/REPLACE (como para páginas de produto) iniciem no topo.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const initialRenderRef = useRef(true);

  // Restaura a posição de scroll quando retornamos a uma página (POP)
  // (Mantendo a lógica anterior para POP, pode ser refinada depois se necessário)
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = getSavedScrollPosition(path);
    console.log(`[useScrollRestoration v3] Attempting restore for ${path}. Found saved position:`, savedPosition);

    if (savedPosition) {
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms

      if (now - savedPosition.timestamp < expirationTime) {
        setIsRestoring(true);
        console.log(`[useScrollRestoration v3] Setting isRestoring = true for ${path}`);

        // Lógica de tentativas mantida por enquanto
        let attempts = 0;
        const maxAttempts = 20;
        const initialDelay = 100;
        const attemptDelayBase = 150;

        const attemptScroll = () => {
          console.log(`[useScrollRestoration v3] Attempt ${attempts + 1}/${maxAttempts} to scroll to y=${savedPosition.y} for ${path}`);
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto'
          });

          setTimeout(() => {
            const currentY = window.scrollY;
            const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 10;
            console.log(`[useScrollRestoration v3] After attempt ${attempts + 1}: currentY=${currentY}, targetY=${savedPosition.y}, isCloseEnough=${isCloseEnough}`);

            if (!isCloseEnough && attempts < maxAttempts) {
              attempts++;
              const nextDelay = attemptDelayBase * Math.min(attempts, 6);
              console.log(`[useScrollRestoration v3] Retrying in ${nextDelay}ms...`);
              setTimeout(attemptScroll, nextDelay);
            } else {
              setTimeout(() => {
                setIsRestoring(false);
                console.log(`[useScrollRestoration v3] Setting isRestoring = false for ${path}. Final state: ${isCloseEnough ? 'succeeded' : 'gave up'}`);
              }, 250);
            }
          }, 50);
        };
        setTimeout(attemptScroll, initialDelay);
      } else {
        console.log(`[useScrollRestoration v3] Position for ${path} expired.`);
        removeScrollPosition(path);
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      console.log(`[useScrollRestoration v3] No saved position for ${path}, scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
  }, []);

  // Efeito principal que gerencia a restauração de scroll
  useLayoutEffect(() => {
    const { pathname } = location;
    console.log(`[useScrollRestoration v3] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);

    // Garante que history.scrollRestoration esteja manual
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Pula a primeira renderização
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('[useScrollRestoration v3] Initial render, skipping logic.');
      // Não força scroll aqui na primeira renderização
      return;
    }

    // Comportamento baseado no tipo de navegação
    if (navigationType === 'POP') {
      // Voltando para uma página (POP)
      console.log('[useScrollRestoration v3] Navigation type: POP - Attempting scroll restoration');
      // Tenta restaurar usando a lógica existente (pode ser refinada depois)
      // Usar requestAnimationFrame pode ajudar a evitar o "flash" visual
      requestAnimationFrame(() => {
        console.log('[useScrollRestoration v3] requestAnimationFrame callback executing restoreScrollPosition');
        restoreScrollPosition(pathname);
      });
    } else {
      // PUSH ou REPLACE (Navegação para uma nova página, ex: página de produto)
      // **SEMPRE** rola para o topo
      console.log(`[useScrollRestoration v3] Navigation type: ${navigationType} - New navigation to ${pathname}. Scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Função de limpeza: Salva a posição ANTES de desmontar
    // (Mantendo a lógica anterior de salvar para qualquer path, pode ser refinada depois)
    const currentPath = pathname;
    return () => {
      console.log(`[useScrollRestoration v3] Cleanup function running for path: ${currentPath}. isRestoring: ${getIsRestoring()}`);
      managerSaveScrollPosition(currentPath, 'LayoutEffect cleanup');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigationType, restoreScrollPosition]);

  // Salva periodicamente durante a rolagem na página (com debounce)
  // (Mantendo a lógica anterior de salvar para qualquer path, pode ser refinada depois)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (getIsRestoring()) return;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        managerSaveScrollPosition(pathname, 'debounced scroll');
      }, 350) as unknown as number;
    };

    console.log(`[useScrollRestoration v3] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration v3] Removing scroll listener for path: ${pathname}`);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Listener de visibilidade mantido por enquanto
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigationType === 'POP') {
        console.log('[useScrollRestoration v3] Visibility changed to visible on POP navigation, requesting animation frame for restore.');
        requestAnimationFrame(() => {
            console.log('[useScrollRestoration v3] requestAnimationFrame callback executing restoreScrollPosition from visibility change');
            setTimeout(() => restoreScrollPosition(location.pathname), 50);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, navigationType, restoreScrollPosition]);

};

