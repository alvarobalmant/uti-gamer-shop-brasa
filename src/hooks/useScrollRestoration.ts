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
  const restoreScrollPosition = useCallback((path: string, context: string) => {
    const savedPosition = getSavedScrollPosition(path);
    console.log(`[useScrollRestoration v5 - ${context}] Attempting restore for ${path}. Found saved position:`, savedPosition);

    if (savedPosition) {
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms

      if (now - savedPosition.timestamp < expirationTime) {
        setIsRestoring(true);
        console.log(`[useScrollRestoration v5 - ${context}] Setting isRestoring = true for ${path}`);

        // Lógica de tentativas mantida por enquanto
        let attempts = 0;
        const maxAttempts = 15; // Reduced max attempts
        const initialDelay = 50; // Reduced initial delay
        const attemptDelayBase = 100; // Reduced base delay

        const attemptScroll = () => {
          console.log(`[useScrollRestoration v5 - ${context}] Attempt ${attempts + 1}/${maxAttempts} to scroll to y=${savedPosition.y} for ${path}`);
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto'
          });

          // Check immediately after scroll command
          setTimeout(() => {
            const currentY = window.scrollY;
            const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 15; // Increased tolerance slightly
            console.log(`[useScrollRestoration v5 - ${context}] After attempt ${attempts + 1}: currentY=${currentY}, targetY=${savedPosition.y}, isCloseEnough=${isCloseEnough}`);

            if (!isCloseEnough && attempts < maxAttempts) {
              attempts++;
              const nextDelay = attemptDelayBase * Math.min(attempts, 5); // Capped multiplier
              console.log(`[useScrollRestoration v5 - ${context}] Retrying in ${nextDelay}ms...`);
              setTimeout(attemptScroll, nextDelay);
            } else {
              // Add a final small delay before setting isRestoring to false
              setTimeout(() => {
                setIsRestoring(false);
                console.log(`[useScrollRestoration v5 - ${context}] Setting isRestoring = false for ${path}. Final state: ${isCloseEnough ? 'succeeded' : 'gave up'}`);
              }, 150); // Delay before releasing the flag
            }
          }, 30); // Short delay to check scroll position
        };
        // Use requestAnimationFrame for the initial attempt
        requestAnimationFrame(() => {
            console.log(`[useScrollRestoration v5 - ${context}] Initial scroll attempt via rAF`);
            attemptScroll();
        });

      } else {
        console.log(`[useScrollRestoration v5 - ${context}] Position for ${path} expired.`);
        removeScrollPosition(path);
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      console.log(`[useScrollRestoration v5 - ${context}] No saved position for ${path}, scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
  }, []);

  // Efeito principal que gerencia a restauração de scroll
  useLayoutEffect(() => {
    const { pathname } = location;
<<<<<<< HEAD
    console.log(`[useScrollRestoration v5] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);
=======
    console.log(`[useScrollRestoration v4] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);
>>>>>>> f854002784bfe0d1be3ada196fbb323c37497499

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('[useScrollRestoration v5] Initial render, skipping logic.');
      // Ensure top on initial load if no position exists?
      // Maybe not needed if default browser behavior is top.
      return;
    }

    if (navigationType === 'POP') {
      console.log('[useScrollRestoration v5] Navigation type: POP - Requesting scroll restoration');
      // Delay slightly to allow layout changes?
      setTimeout(() => restoreScrollPosition(pathname, 'LayoutEffect POP'), 50); 
    } else {
<<<<<<< HEAD
      console.log(`[useScrollRestoration v5] Navigation type: ${navigationType} - New navigation to ${pathname}. Scrolling to top.`);
=======
      console.log(`[useScrollRestoration v4] Navigation type: ${navigationType} - New navigation to ${pathname}. Scrolling to top.`);
>>>>>>> f854002784bfe0d1be3ada196fbb323c37497499
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Função de limpeza: Salva a posição ANTES de desmontar
    const currentPath = pathname;
    return () => {
      console.log(`[useScrollRestoration v5] Cleanup function running for path: ${currentPath}. isRestoring: ${getIsRestoring()}`);
      // Only save if not currently in the process of restoring scroll
      if (!getIsRestoring()) {
          managerSaveScrollPosition(currentPath, 'LayoutEffect cleanup');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigationType]); // Removed restoreScrollPosition from deps as it's stable

  // Salva periodicamente durante a rolagem na página (com debounce)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      // DO NOT SAVE if currently restoring or if document is hidden
      if (getIsRestoring() || document.visibilityState === 'hidden') {
          // console.log(`[useScrollRestoration v5] Scroll event ignored. isRestoring: ${getIsRestoring()}, visibility: ${document.visibilityState}`);
          return;
      }

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        managerSaveScrollPosition(pathname, 'debounced scroll');
      }, 300); // Slightly reduced debounce time
    };

<<<<<<< HEAD
    console.log(`[useScrollRestoration v5] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration v5] Removing scroll listener for path: ${pathname}`);
=======
    console.log(`[useScrollRestoration v4] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration v4] Removing scroll listener for path: ${pathname}`);
>>>>>>> f854002784bfe0d1be3ada196fbb323c37497499
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Listener de visibilidade - REMOVIDA A RESTAURAÇÃO AUTOMÁTICA
  useEffect(() => {
    const { pathname } = location;
    const handleVisibilityChange = () => {
<<<<<<< HEAD
      console.log(`[useScrollRestoration v5] Visibility changed to: ${document.visibilityState}`);
      // REMOVED: Automatic restore on visibility change
      // if (document.visibilityState === 'visible' && navigationType === 'POP' && !getIsRestoring()) {
      //   console.log('[useScrollRestoration v5] Visibility changed to visible on POP navigation, requesting restore.');
      //   setTimeout(() => restoreScrollPosition(pathname, 'VisibilityChange'), 100); 
      // }
      
      // Optionally, save position when becoming hidden?
      // if (document.visibilityState === 'hidden' && !getIsRestoring()) {
      //   console.log('[useScrollRestoration v5] Saving position on becoming hidden.');
      //   managerSaveScrollPosition(pathname, 'visibility hidden');
      // }
=======
      console.log(`[useScrollRestoration v4] Visibility changed to: ${document.visibilityState}`);
      // Only attempt restore if: becoming visible, was a POP navigation, and NOT currently restoring
      if (document.visibilityState === 'visible' && navigationType === 'POP' && !getIsRestoring()) {
        console.log('[useScrollRestoration v4] Visibility changed to visible on POP navigation, requesting restore.');
        // Add a small delay before attempting restore on visibility change
        setTimeout(() => restoreScrollPosition(pathname, 'VisibilityChange'), 100); 
      }
      // If page becomes hidden, maybe save the current position immediately?
      // Let's rely on the cleanup and debounced scroll for now to avoid over-saving.
>>>>>>> f854002784bfe0d1be3ada196fbb323c37497499
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log(`[useScrollRestoration v5] Added visibility listener for path: ${pathname}`);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log(`[useScrollRestoration v5] Removed visibility listener for path: ${pathname}`);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigationType]); // Removed restoreScrollPosition from deps

};

