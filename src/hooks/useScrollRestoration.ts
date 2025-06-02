
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

type ScrollPositionMap = Record<string, ScrollPositionEntry>;

/**
 * Hook simplificado para restauração de posição de scroll
 * Remove duplicações e conflitos de implementação
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);

  // Carrega posições salvas do localStorage
  useEffect(() => {
    try {
      const savedPositions = localStorage.getItem('utiGamesScrollPositions');
      if (savedPositions) {
        scrollPositions.current = JSON.parse(savedPositions);
      }
    } catch (error) {
      console.warn('Failed to load scroll positions:', error);
      localStorage.removeItem('utiGamesScrollPositions');
    }
  }, []);

  // Salva posições no localStorage
  const persistScrollPositions = useCallback(() => {
    try {
      localStorage.setItem('utiGamesScrollPositions', JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('Failed to save scroll positions:', error);
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

    if (scrollPos.y > 50) { // Só salva se realmente scrollou
      scrollPositions.current[path] = scrollPos;
      persistScrollPositions();
      console.log(`Saved scroll position ${scrollPos.y} for ${path}`);
    }
  }, [persistScrollPositions]);

  // Restaura a posição
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions.current[path];
    
    if (!savedPosition) {
      // Sem posição salva, volta ao topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }

    // Verifica se não expirou (1 hora)
    const now = Date.now();
    const expirationTime = 60 * 60 * 1000; // 1 hora
    
    if (now - savedPosition.timestamp > expirationTime) {
      delete scrollPositions.current[path];
      persistScrollPositions();
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }

    isRestoringRef.current = true;
    
    // Tenta restaurar com um pequeno delay
    setTimeout(() => {
      window.scrollTo({
        left: savedPosition.x,
        top: savedPosition.y,
        behavior: 'auto'
      });
      
      // Verifica se funcionou após um momento
      setTimeout(() => {
        isRestoringRef.current = false;
        console.log(`Restored scroll position ${savedPosition.y} for ${path}`);
      }, 100);
    }, 50);
  }, [persistScrollPositions]);

  // Efeito principal para mudanças de rota
  useEffect(() => {
    const { pathname } = location;
    
    // Reset flag ao mudar de página
    hasRestoredRef.current = false;
    
    if (navigationType === 'POP') {
      // Navegação para trás - restaura posição
      console.log('POP navigation - restoring scroll for:', pathname);
      restoreScrollPosition(pathname);
    } else {
      // Nova navegação - vai para o topo
      console.log('New navigation - scrolling to top for:', pathname);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Cleanup: salva posição ao sair da página
    return () => {
      if (!isRestoringRef.current) {
        saveScrollPosition(pathname);
      }
    };
  }, [location, navigationType, restoreScrollPosition, saveScrollPosition]);

  // Salva durante scroll (com debounce)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(pathname);
      }, 300) as unknown as number;
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
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
      persistScrollPositions();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname, saveScrollPosition, persistScrollPositions]);

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};
