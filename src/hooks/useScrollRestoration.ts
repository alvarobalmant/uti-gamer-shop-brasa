import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Limpa posições expiradas (mais de 24h)
const cleanupExpiredPositions = (positions: ScrollPositionMap): ScrollPositionMap => {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms
  const cleanedPositions: ScrollPositionMap = {};
  for (const key in positions) {
    if (now - positions[key].timestamp < expirationTime) {
      cleanedPositions[key] = positions[key];
    }
  }
  return cleanedPositions;
};

/**
 * Hook para restauração de posição de scroll.
 * VERSÃO 3: Simplificada para maior consistência e performance, especialmente no mobile.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const initialRenderRef = useRef(true);

  // Carrega e limpa posições salvas do localStorage na inicialização
  useEffect(() => {
    try {
      const savedPositions = localStorage.getItem('utiGamesScrollPositions');
      if (savedPositions) {
        const parsedPositions = JSON.parse(savedPositions);
        scrollPositions.current = cleanupExpiredPositions(parsedPositions);
        console.log('Loaded and cleaned scroll positions:', scrollPositions.current);
        // Persiste as posições limpas de volta
        persistScrollPositions();
      }
    } catch (error) {
      console.warn('Failed to load/clean scroll positions:', error);
      localStorage.removeItem('utiGamesScrollPositions');
    }

    // Salva posições no localStorage ao desmontar (melhor esforço)
    return () => {
      persistScrollPositions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executa apenas uma vez na montagem

  // Função para persistir posições no localStorage
  const persistScrollPositions = useCallback(() => {
    try {
      localStorage.setItem('utiGamesScrollPositions', JSON.stringify(scrollPositions.current));
    } catch (error) {
      // Ignora erros de quota exceeded, etc.
      console.warn('Failed to save scroll positions to localStorage:', error);
    }
  }, []);

  // Salva a posição de scroll atual (com debounce)
  const saveScrollPosition = useCallback((path: string) => {
    if (isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };

    // Só salva se realmente houver scroll
    if (scrollPos.y > 5 || scrollPos.x > 5) { // Threshold baixo
      scrollPositions.current[path] = scrollPos;
      // Não loga cada salvamento para evitar poluir console
      // console.log(`Saved scroll position for ${path}:`, scrollPos);
      persistScrollPositions(); // Persiste imediatamente após salvar
    }
  }, [persistScrollPositions]);

  // Restaura a posição de scroll (simplificado)
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions.current[path];

    if (savedPosition) {
      isRestoringRef.current = true;
      // Tenta restaurar imediatamente
      window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'auto' });
      console.log(`Attempted scroll restoration for ${path} to`, savedPosition);

      // Tenta novamente após um pequeno delay, caso o DOM não estivesse pronto
      // Isso é um fallback simples, sem loop complexo
      setTimeout(() => {
        const currentY = window.scrollY;
        if (Math.abs(currentY - savedPosition.y) > 10) { // Se ainda estiver longe
          window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'auto' });
          console.log(`Re-attempted scroll restoration for ${path}`);
        }
        // Libera a flag de restauração após o delay
        isRestoringRef.current = false;
      }, 100); // Delay curto para a segunda tentativa

    } else {
      console.log(`No saved scroll position for ${path}.`);
      // Não faz nada, deixa o navegador decidir (geralmente topo)
    }
  }, []);

  // Efeito principal que gerencia a restauração/salvamento
  useLayoutEffect(() => {
    const { pathname } = location;

    // Pula a primeira renderização
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      // Garante que a página comece no topo na primeira carga
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }

    if (navigationType === 'POP') {
      // Navegação para trás/frente: tenta restaurar
      restoreScrollPosition(pathname);
    } else {
      // Nova navegação (PUSH/REPLACE): rola para o topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Salva a posição da página ANTERIOR antes da transição
    // A chave é o pathname *antes* da mudança de location
    const previousPath = pathname; // Captura o pathname atual antes do return
    return () => {
      saveScrollPosition(previousPath);
    };
  }, [location, navigationType, restoreScrollPosition, saveScrollPosition]);

  // Listener de scroll para salvar posição (com debounce)
  useEffect(() => {
    const { pathname } = location;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(pathname);
      }, 200); // Debounce de 200ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location, saveScrollPosition]);

  // Salva antes de descarregar (melhor esforço)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
      persistScrollPositions(); // Garante a persistência
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname, saveScrollPosition, persistScrollPositions]);

  // Listener de visibilidade (tentativa de restaurar ao voltar para aba)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigationType === 'POP') {
        // Tenta restaurar com um pequeno delay ao voltar para a aba
        setTimeout(() => restoreScrollPosition(location.pathname), 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [location.pathname, navigationType, restoreScrollPosition]);

};

