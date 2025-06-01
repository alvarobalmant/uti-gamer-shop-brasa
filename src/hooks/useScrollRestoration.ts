import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Interface para armazenar a posição de scroll e timestamp
interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

// Tipo para o mapa de posições de scroll, usando a chave da localização como identificador
type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Chave para armazenar no sessionStorage
const SESSION_STORAGE_KEY = 'utiGamesScrollPositions';
// Tempo máximo de validade da posição salva (em milissegundos) - 1 hora
const SCROLL_POSITION_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Hook robusto para restauração de posição de scroll entre navegações.
 * Utiliza sessionStorage para persistência na sessão.
 * Inclui verificações de ambiente para maior segurança em runtime.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const restoreTimeoutRef = useRef<number | null>(null);

  // --- Funções Auxiliares ---

  const loadPositionsFromSessionStorage = useCallback(() => {
    // Verifica se sessionStorage está disponível
    if (typeof sessionStorage === 'undefined') return;
    try {
      const savedPositions = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedPositions) {
        const parsedPositions: ScrollPositionMap = JSON.parse(savedPositions);
        const now = Date.now();
        const validPositions: ScrollPositionMap = {};
        for (const key in parsedPositions) {
          if (now - parsedPositions[key].timestamp < SCROLL_POSITION_EXPIRATION_MS) {
            validPositions[key] = parsedPositions[key];
          }
        }
        scrollPositions.current = validPositions;
      }
    } catch (error) {
      console.warn('Falha ao carregar posições de scroll do sessionStorage:', error);
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (removeError) {
        console.warn('Falha ao remover item inválido do sessionStorage:', removeError);
      }
    }
  }, []);

  const persistPositionsToSessionStorage = useCallback(() => {
    // Verifica se sessionStorage está disponível
    if (typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('Falha ao salvar posições de scroll no sessionStorage:', error);
    }
  }, []);

  const saveScrollPosition = useCallback((key: string) => {
    // Verifica se window está disponível
    if (typeof window === 'undefined' || isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };

    if (scrollPos.y > 50 || scrollPos.x > 10) {
      scrollPositions.current[key] = scrollPos;
      persistPositionsToSessionStorage();
    }
  }, [persistPositionsToSessionStorage]);

  const restoreScrollPosition = useCallback((key: string) => {
    // Verifica se window está disponível
    if (typeof window === 'undefined') return;

    const savedPosition = scrollPositions.current[key];

    if (savedPosition) {
      const now = Date.now();
      if (now - savedPosition.timestamp < SCROLL_POSITION_EXPIRATION_MS) {
        isRestoringRef.current = true;
        if (restoreTimeoutRef.current) {
          clearTimeout(restoreTimeoutRef.current);
        }

        const attemptScroll = () => {
          // Verifica window novamente antes de usar
          if (typeof window === 'undefined') {
            isRestoringRef.current = false;
            return;
          }
          window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'auto' });

          restoreTimeoutRef.current = window.setTimeout(() => {
            if (typeof window === 'undefined') {
              isRestoringRef.current = false;
              restoreTimeoutRef.current = null;
              return;
            }
            // const currentY = window.scrollY;
            // console.log(`Scroll restoration attempt for key ${key}. Target: ${savedPosition.y}, Current: ${currentY}`);
            isRestoringRef.current = false;
            restoreTimeoutRef.current = null;
          }, 150); // Aumentado delay para verificação/finalização
        };

        // Usa requestAnimationFrame se disponível, senão setTimeout
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(() => {
            if (typeof setTimeout !== 'undefined') {
              setTimeout(attemptScroll, 50);
            } else {
              attemptScroll();
            }
          });
        } else if (typeof setTimeout !== 'undefined') {
          setTimeout(attemptScroll, 50);
        } else {
          attemptScroll();
        }
      } else {
        delete scrollPositions.current[key];
        persistPositionsToSessionStorage();
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
  }, [persistPositionsToSessionStorage]);

  // --- Efeitos ---

  // Carrega posições na montagem inicial e configura listener de unload
  useEffect(() => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;

    loadPositionsFromSessionStorage();

    const handleBeforeUnload = () => {
      const keyToSave = location.key || location.pathname + location.search;
      saveScrollPosition(keyToSave);
      persistPositionsToSessionStorage();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
    };
  // Dependências corretas para execução única na montagem/desmontagem
  }, [loadPositionsFromSessionStorage, saveScrollPosition, persistPositionsToSessionStorage, location.key, location.pathname, location.search]);

  // Efeito principal para salvar/restaurar baseado na navegação
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Gera uma chave mais única para o estado inicial
    const currentKey = location.key || `initial_${location.pathname}${location.search}`;

    if (navigationType === 'POP') {
      restoreScrollPosition(currentKey);
    } else {
      // Garante scroll para o topo em navegações PUSH/REPLACE
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Salva a posição da chave *anterior* na limpeza
    const keyForCleanup = currentKey;
    return () => {
      saveScrollPosition(keyForCleanup);
    };
  // Dependências incluem tudo que afeta a lógica do efeito
  }, [location.key, location.pathname, location.search, navigationType, restoreScrollPosition, saveScrollPosition]);

  // Efeito para salvar scroll durante a rolagem (com debounce)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentKey = location.key || `initial_${location.pathname}${location.search}`;
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentKey);
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  // Dependências incluem tudo que afeta a lógica do efeito
  }, [location.key, location.pathname, location.search, saveScrollPosition]);

}; // Fim do hook

