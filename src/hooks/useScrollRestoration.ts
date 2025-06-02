
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

type ScrollPositionMap = Record<string, ScrollPositionEntry>;

/**
 * Hook principal para restauração automática de posição de scroll
 * Versão simplificada e robusta
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const lastPathRef = useRef<string>('');

  // Carrega posições salvas do sessionStorage
  useEffect(() => {
    try {
      const savedPositions = sessionStorage.getItem('appScrollPositions');
      if (savedPositions) {
        const parsed = JSON.parse(savedPositions);
        // Filtra posições expiradas (30 minutos)
        const now = Date.now();
        const expirationTime = 30 * 60 * 1000;
        
        const validPositions: ScrollPositionMap = {};
        Object.entries(parsed).forEach(([path, data]: [string, any]) => {
          if (data && data.timestamp && (now - data.timestamp) <= expirationTime) {
            validPositions[path] = data;
          }
        });
        
        scrollPositions.current = validPositions;
        console.log('[ScrollRestoration] Loaded positions:', Object.keys(validPositions));
      }
    } catch (error) {
      console.warn('[ScrollRestoration] Failed to load positions:', error);
      sessionStorage.removeItem('appScrollPositions');
    }
  }, []);

  // Salva posições no sessionStorage
  const persistScrollPositions = useCallback(() => {
    try {
      sessionStorage.setItem('appScrollPositions', JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('[ScrollRestoration] Failed to save positions:', error);
    }
  }, []);

  // Salva a posição atual
  const saveScrollPosition = useCallback((path: string) => {
    if (isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };

    // Só salva se scrollou significativamente
    if (scrollPos.y > 100) {
      scrollPositions.current[path] = scrollPos;
      persistScrollPositions();
      console.log(`[ScrollRestoration] Saved ${scrollPos.y} for ${path}`);
    }
  }, [persistScrollPositions]);

  // Restaura a posição
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions.current[path];
    
    if (!savedPosition) {
      // Sem posição salva, vai para o topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      console.log(`[ScrollRestoration] No saved position for ${path}, scrolling to top`);
      return;
    }

    isRestoringRef.current = true;
    
    // Aguarda um pouco para o DOM estar pronto
    setTimeout(() => {
      window.scrollTo({
        left: savedPosition.x,
        top: savedPosition.y,
        behavior: 'auto'
      });
      
      console.log(`[ScrollRestoration] Restored ${savedPosition.y} for ${path}`);
      
      // Reset flag após um momento
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 200);
    }, 100);
  }, []);

  // Efeito principal para mudanças de rota
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = lastPathRef.current;
    
    console.log(`[ScrollRestoration] Navigation: ${previousPath} -> ${currentPath}, type: ${navigationType}`);
    
    // Salva posição da página anterior se houver
    if (previousPath && previousPath !== currentPath) {
      saveScrollPosition(previousPath);
    }
    
    if (navigationType === 'POP') {
      // Navegação para trás - restaura posição
      console.log('[ScrollRestoration] POP navigation - restoring scroll');
      restoreScrollPosition(currentPath);
    } else {
      // Nova navegação - vai para o topo
      console.log('[ScrollRestoration] New navigation - scrolling to top');
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Atualiza referência do path atual
    lastPathRef.current = currentPath;
  }, [location.pathname, navigationType, restoreScrollPosition, saveScrollPosition]);

  // Salva durante scroll (com throttle)
  useEffect(() => {
    const currentPath = location.pathname;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentPath);
      }, 500) as unknown as number; // Throttle aumentado para 500ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, saveScrollPosition]);

  // Salva antes de sair da página
  useEffect(() => {
    const currentPath = location.pathname;
    
    const handleBeforeUnload = () => {
      saveScrollPosition(currentPath);
      persistScrollPositions();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Salva ao desmontar também
      if (!isRestoringRef.current) {
        saveScrollPosition(currentPath);
        persistScrollPositions();
      }
    };
  }, [location.pathname, saveScrollPosition, persistScrollPositions]);

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};
