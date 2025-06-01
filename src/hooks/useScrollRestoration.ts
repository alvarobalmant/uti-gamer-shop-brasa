import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Interface para armazenar a posição de scroll e timestamp
interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

// Tipo para o mapa de posições de scroll
type ScrollPositionMap = Record<string, ScrollPositionEntry>;

// Chave para armazenar no sessionStorage
const SESSION_STORAGE_KEY = 'utiGamesScrollPositions_v2'; // Nova chave para evitar conflitos
// Tempo máximo de validade da posição salva (em milissegundos) - 1 hora
const SCROLL_POSITION_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Hook robusto para restauração de posição de scroll entre navegações.
 * Utiliza sessionStorage para persistência na sessão.
 * Inclui verificações de ambiente para maior segurança em runtime.
 * Versão simplificada e focada em estabilidade.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const restoreTimeoutRef = useRef<number | null>(null);

  // --- Funções Auxiliares ---

  const getSessionStorage = useCallback(() => {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage;
    }
    return null;
  }, []);

  const getWindow = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window;
    }
    return null;
  }, []);

  const loadPositions = useCallback(() => {
    const storage = getSessionStorage();
    if (!storage) return;
    try {
      const savedPositions = storage.getItem(SESSION_STORAGE_KEY);
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
      console.warn('Falha ao carregar posições de scroll:', error);
      try {
        storage.removeItem(SESSION_STORAGE_KEY);
      } catch (removeError) {
        console.warn('Falha ao remover item inválido:', removeError);
      }
    }
  }, [getSessionStorage]);

  const persistPositions = useCallback(() => {
    const storage = getSessionStorage();
    if (!storage) return;
    try {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('Falha ao salvar posições de scroll:', error);
    }
  }, [getSessionStorage]);

  const saveScrollPosition = useCallback((key: string) => {
    const win = getWindow();
    if (!win || isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: win.scrollX,
      y: win.scrollY,
      timestamp: Date.now(),
    };

    // Salva apenas se houver algum scroll
    if (scrollPos.y > 0 || scrollPos.x > 0) {
      scrollPositions.current[key] = scrollPos;
      persistPositions();
    }
  }, [getWindow, persistPositions]);

  const restoreScrollPosition = useCallback((key: string) => {
    const win = getWindow();
    if (!win) return;

    const savedPosition = scrollPositions.current[key];

    if (savedPosition && (Date.now() - savedPosition.timestamp < SCROLL_POSITION_EXPIRATION_MS)) {
      isRestoringRef.current = true;
      win.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'auto' });

      // Limpa o timeout anterior se houver
      if (restoreTimeoutRef.current) {
        win.clearTimeout(restoreTimeoutRef.current);
      }

      // Define um timeout para resetar o flag isRestoringRef
      restoreTimeoutRef.current = win.setTimeout(() => {
        isRestoringRef.current = false;
        restoreTimeoutRef.current = null;
      }, 150); // Tempo para permitir que o scroll ocorra
    } else {
      // Se não há posição válida, rola para o topo
      win.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      if (savedPosition) {
        // Remove a posição expirada
        delete scrollPositions.current[key];
        persistPositions();
      }
    }
  }, [getWindow, persistPositions]);

  // --- Efeitos ---

  // Carrega posições na montagem inicial
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  // Efeito principal para salvar/restaurar baseado na navegação
  useLayoutEffect(() => {
    const win = getWindow();
    if (!win) return;

    const currentKey = location.key || location.pathname + location.search;

    if (navigationType === 'POP') {
      restoreScrollPosition(currentKey);
    } else {
      // Garante scroll para o topo em navegações PUSH/REPLACE
      win.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Salva a posição da chave *anterior* na limpeza do efeito
    // Isso captura a posição antes da navegação ocorrer
    const previousKey = currentKey;
    return () => {
      saveScrollPosition(previousKey);
    };
  }, [location.key, location.pathname, location.search, navigationType, restoreScrollPosition, saveScrollPosition, getWindow]);

  // Salva posição antes de descarregar a página
  useEffect(() => {
    const win = getWindow();
    if (!win) return;

    const handleBeforeUnload = () => {
      const currentKey = location.key || location.pathname + location.search;
      saveScrollPosition(currentKey);
    };

    win.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      win.removeEventListener('beforeunload', handleBeforeUnload);
      // Limpa timeout ao desmontar o componente principal
      if (restoreTimeoutRef.current) {
        win.clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, [location.key, location.pathname, location.search, saveScrollPosition, getWindow]);

}; // Fim do hook

