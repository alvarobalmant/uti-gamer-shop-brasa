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
 * Utiliza o scrollRestorationManager para estado compartilhado e lógica centralizada.
 * Incorpora sugestões do Lovable (condicional POP e requestAnimationFrame).
 * REMOVIDO scrollTo(0,0) explícito em PUSH/REPLACE.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const initialRenderRef = useRef(true);

  // Restaura a posição de scroll quando retornamos a uma página (POP)
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = getSavedScrollPosition(path);
    console.log(`[useScrollRestoration] Attempting restore for ${path}. Found saved position:`, savedPosition);

    if (savedPosition) {
      // Verifica se a posição não está expirada (24 horas)
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms

      if (now - savedPosition.timestamp < expirationTime) {
        setIsRestoring(true);
        console.log(`[useScrollRestoration] Setting isRestoring = true for ${path}`);

        // Usa uma série de tentativas para garantir que o conteúdo esteja carregado
        let attempts = 0;
        const maxAttempts = 20;
        const initialDelay = 100;
        const attemptDelayBase = 150;

        const attemptScroll = () => {
          console.log(`[useScrollRestoration] Attempt ${attempts + 1}/${maxAttempts} to scroll to y=${savedPosition.y} for ${path}`);
          // Tenta restaurar a posição
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto' // Instantâneo
          });

          // Verifica se conseguimos restaurar a posição corretamente após um pequeno delay
          setTimeout(() => {
            const currentY = window.scrollY;
            const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 10;
            console.log(`[useScrollRestoration] After attempt ${attempts + 1}: currentY=${currentY}, targetY=${savedPosition.y}, isCloseEnough=${isCloseEnough}`);

            if (!isCloseEnough && attempts < maxAttempts) {
              attempts++;
              // Tenta novamente após um delay, aumentando o tempo entre tentativas
              const nextDelay = attemptDelayBase * Math.min(attempts, 6);
              console.log(`[useScrollRestoration] Retrying in ${nextDelay}ms...`);
              setTimeout(attemptScroll, nextDelay);
            } else {
              // Finaliza o processo de restauração após um pequeno delay
              setTimeout(() => {
                setIsRestoring(false);
                console.log(`[useScrollRestoration] Setting isRestoring = false for ${path}. Final state: ${isCloseEnough ? 'succeeded' : 'gave up'}`);
              }, 250);
            }
          }, 50);
        };

        // Inicia a primeira tentativa com um delay maior
        setTimeout(attemptScroll, initialDelay);
      } else {
        // Remove posições expiradas
        console.log(`[useScrollRestoration] Position for ${path} expired.`);
        removeScrollPosition(path);
        // Scroll to top if position expired
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      // Se não houver posição salva, rola para o topo como fallback
      console.log(`[useScrollRestoration] No saved position for ${path}, scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
  }, []);

  // Efeito principal que gerencia a restauração de scroll
  useLayoutEffect(() => {
    const { pathname } = location;
    console.log(`[useScrollRestoration] useLayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}`);

    // Pula a primeira renderização
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log('[useScrollRestoration] Initial render, scrolling to top.');
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }

    // Comportamento baseado no tipo de navegação
    if (navigationType === 'POP') {
      console.log('[useScrollRestoration] Navigation type: POP - Requesting animation frame for scroll restoration');
      // Usa requestAnimationFrame para garantir que a restauração ocorra após a renderização
      requestAnimationFrame(() => {
        console.log('[useScrollRestoration] requestAnimationFrame callback executing restoreScrollPosition');
        restoreScrollPosition(pathname);
      });
    } else {
      // PUSH ou REPLACE (clique em link ou navegação programática)
      // *** REMOVIDO O SCROLL PARA O TOPO EXPLÍCITO DAQUI ***
      console.log(`[useScrollRestoration] Navigation type: ${navigationType} - New navigation. Letting browser/router handle initial scroll.`);
      // window.scrollTo({ left: 0, top: 0, behavior: 'auto' }); // <-- LINHA REMOVIDA
    }

    // Função de limpeza: Salva a posição ANTES de desmontar
    const currentPath = pathname;
    return () => {
      console.log(`[useScrollRestoration] Cleanup function running for path: ${currentPath}. isRestoring: ${getIsRestoring()}`);
      // Chama a função de salvamento do manager
      managerSaveScrollPosition(currentPath, 'useLayoutEffect cleanup');
    };
  }, [location, navigationType, restoreScrollPosition]); // restoreScrollPosition is stable due to useCallback([])

  // Salva periodicamente durante a rolagem na página (com debounce)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (getIsRestoring()) return; // Usa getter do manager

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        // console.log('[useScrollRestoration] Debounced scroll event triggered save.');
        managerSaveScrollPosition(pathname, 'debounced scroll');
      }, 350) as unknown as number;
    };

    console.log(`[useScrollRestoration] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration] Removing scroll listener for path: ${pathname}`);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]); // Apenas location como dependência

  // Listener de visibilidade (útil para voltar de outra aba)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigationType === 'POP') {
        console.log('[useScrollRestoration] Visibility changed to visible on POP navigation, requesting animation frame for restore.');
        // Usa requestAnimationFrame aqui também para consistência
        requestAnimationFrame(() => {
            console.log('[useScrollRestoration] requestAnimationFrame callback executing restoreScrollPosition from visibility change');
            // Atraso adicional pode não ser mais necessário com requestAnimationFrame, mas mantemos por segurança
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

