
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
 * Hook para restauração de posição de scroll entre navegações
 * Versão corrigida para evitar scroll incorreto
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const initialRenderRef = useRef(true);
  const isRestoringRef = useRef(false);
  const lastPathRef = useRef<string>('');

  // Restaura a posição de scroll quando retornamos a uma página (POP)
  const restoreScrollPosition = useCallback((path: string, context: string) => {
    const savedPosition = getSavedScrollPosition(path);
    console.log(`[useScrollRestoration v7 - ${context}] Attempting restore for ${path}. Found saved position:`, savedPosition);

    if (savedPosition) {
      const now = Date.now();
      const expirationTime = 10 * 60 * 1000; // 10 minutos em ms (reduzido)

      if (now - savedPosition.timestamp < expirationTime) {
        // Só restaura se a posição salva for significativa (> 50px)
        if (savedPosition.y > 50) {
          setIsRestoring(true);
          isRestoringRef.current = true;
          console.log(`[useScrollRestoration v7 - ${context}] Setting isRestoring = true for ${path}`);

          // Usar setTimeout para garantir que o DOM esteja pronto
          setTimeout(() => {
            window.scrollTo({
              left: savedPosition.x,
              top: savedPosition.y,
              behavior: 'auto'
            });

            // Verificar se a posição foi alcançada
            setTimeout(() => {
              const currentY = window.scrollY;
              const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 50;
              console.log(`[useScrollRestoration v7 - ${context}] Restore result: currentY=${currentY}, targetY=${savedPosition.y}, success=${isCloseEnough}`);
              
              setIsRestoring(false);
              isRestoringRef.current = false;
            }, 150);
          }, 100);
        } else {
          console.log(`[useScrollRestoration v7 - ${context}] Position for ${path} too small (${savedPosition.y}px), not restoring.`);
        }
      } else {
        console.log(`[useScrollRestoration v7 - ${context}] Position for ${path} expired.`);
        removeScrollPosition(path);
      }
    } else {
      console.log(`[useScrollRestoration v7 - ${context}] No saved position for ${path}.`);
    }
  }, []);

  // Efeito principal que gerencia a restauração de scroll
  useLayoutEffect(() => {
    const { pathname } = location;
    console.log(`[useScrollRestoration v7] LayoutEffect triggered for path: ${pathname}, navigationType: ${navigationType}, lastPath: ${lastPathRef.current}`);

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      lastPathRef.current = pathname;
      console.log('[useScrollRestoration v7] Initial render, skipping logic.');
      return;
    }

    // Só restaura em navegação POP (voltar) e se não estamos vindo de uma página de produto
    if (navigationType === 'POP') {
      const isComingFromProduct = lastPathRef.current.includes('/produto/');
      const isGoingToHome = pathname === '/';
      
      if (isComingFromProduct && isGoingToHome) {
        console.log('[useScrollRestoration v7] Coming from product to home - forcing top position');
        // Força scroll para o topo quando volta de produto para home
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'auto'
          });
        }, 50);
      } else if (!isComingFromProduct) {
        console.log('[useScrollRestoration v7] Navigation type: POP - Requesting scroll restoration');
        setTimeout(() => restoreScrollPosition(pathname, 'LayoutEffect POP'), 100);
      } else {
        console.log('[useScrollRestoration v7] Skipping restoration - coming from product page');
      }
    } else {
      console.log(`[useScrollRestoration v7] Navigation type: ${navigationType} - New navigation to ${pathname}.`);
      // Para navegações PUSH/REPLACE, o browser já vai para o topo
    }

    // Atualiza o último path
    const currentPath = pathname;
    lastPathRef.current = currentPath;

    // Função de limpeza: Salva a posição ANTES de desmontar
    return () => {
      console.log(`[useScrollRestoration v7] Cleanup function running for path: ${currentPath}. isRestoring: ${getIsRestoring()}`);
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
      }, 300);
    };

    console.log(`[useScrollRestoration v7] Adding scroll listener for path: ${pathname}`);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log(`[useScrollRestoration v7] Removing scroll listener for path: ${pathname}`);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Listener de visibilidade para salvar ao sair da aba
  useEffect(() => {
    const { pathname } = location;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !getIsRestoring() && !isRestoringRef.current) {
        managerSaveScrollPosition(pathname, 'visibility hidden');
        console.log(`[useScrollRestoration v7] Saved on visibility change for: ${pathname}`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log(`[useScrollRestoration v7] Added visibility listener for path: ${pathname}`);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log(`[useScrollRestoration v7] Removed visibility listener for path: ${pathname}`);
    };
  }, [location.pathname]);
};
