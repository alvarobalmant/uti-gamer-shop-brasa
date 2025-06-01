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
const SESSION_STORAGE_KEY = 'utiGamesScrollPositions_v4'; // Incrementar versão da chave
// Tempo máximo de validade da posição salva (em milissegundos) - 1 hora
const SCROLL_POSITION_EXPIRATION_MS = 60 * 60 * 1000;
// Máximo de tentativas para restaurar o scroll
const MAX_RESTORE_ATTEMPTS = 15;
// Delay inicial antes da primeira tentativa de restauração (ms)
const INITIAL_RESTORE_DELAY = 100;
// Delay base entre tentativas de restauração (ms)
const RESTORE_ATTEMPT_DELAY = 50;
// Tolerância para considerar a restauração bem-sucedida (pixels)
const RESTORE_TOLERANCE = 10;

/**
 * Hook robusto para restauração de posição de scroll entre navegações.
 * Utiliza sessionStorage e múltiplas tentativas de restauração.
 * Versão focada em corrigir a funcionalidade de scroll ao voltar.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const restoreAttemptTimeoutRef = useRef<number | null>(null);
  const lastNavigationType = useRef<string | null>(null);

  // --- Funções Auxiliares Seguras ---
  const getSessionStorage = useCallback(() => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        return sessionStorage;
      }
    } catch (e) {
      console.warn('SessionStorage não está acessível:', e);
    }
    return null;
  }, []);

  const getWindow = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        return window;
      }
    } catch (e) {
      console.warn('Window não está acessível:', e);
    }
    return null;
  }, []);

  // --- Lógica de Carregamento/Persistência ---
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

  // --- Lógica de Salvar/Restaurar ---
  const saveScrollPosition = useCallback((key: string) => {
    const win = getWindow();
    if (!win || isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: win.scrollX,
      y: win.scrollY,
      timestamp: Date.now(),
    };

    // Salva apenas se houver algum scroll
    if (scrollPos.y > 10 || scrollPos.x > 10) {
      scrollPositions.current[key] = scrollPos;
      persistPositions();
    }
  }, [getWindow, persistPositions]);

  // Função de restauração com múltiplas tentativas
  const attemptRestoreScroll = useCallback((key: string, targetY: number, targetX: number, attempt = 1) => {
    const win = getWindow();
    if (!win) return;

    win.scrollTo({ left: targetX, top: targetY, behavior: 'auto' });

    // Limpa timeout anterior
    if (restoreAttemptTimeoutRef.current) {
      win.clearTimeout(restoreAttemptTimeoutRef.current);
    }

    restoreAttemptTimeoutRef.current = win.setTimeout(() => {
      const currentY = win.scrollY;
      const isCloseEnough = Math.abs(currentY - targetY) <= RESTORE_TOLERANCE;

      if (isCloseEnough || attempt >= MAX_RESTORE_ATTEMPTS) {
        // console.log(`Restauração para ${key} ${isCloseEnough ? 'bem-sucedida' : 'falhou'} após ${attempt} tentativas.`);
        isRestoringRef.current = false; // Libera o salvamento de scroll
        restoreAttemptTimeoutRef.current = null;
      } else {
        // Tenta novamente
        // console.log(`Tentativa ${attempt} para ${key} falhou (atual: ${currentY}, alvo: ${targetY}). Tentando novamente.`);
        attemptRestoreScroll(key, targetY, targetX, attempt + 1);
      }
    }, RESTORE_ATTEMPT_DELAY * attempt); // Aumenta o delay a cada tentativa

  }, [getWindow]);

  const restoreScrollPosition = useCallback((key: string) => {
    const win = getWindow();
    if (!win) return;

    const savedPosition = scrollPositions.current[key];

    if (savedPosition && (Date.now() - savedPosition.timestamp < SCROLL_POSITION_EXPIRATION_MS)) {
      isRestoringRef.current = true;
      // console.log(`Iniciando restauração para ${key}:`, savedPosition);

      // Limpa qualquer tentativa anterior pendente
      if (restoreAttemptTimeoutRef.current) {
        win.clearTimeout(restoreAttemptTimeoutRef.current);
        restoreAttemptTimeoutRef.current = null;
      }

      // Inicia a primeira tentativa após um delay inicial
      restoreAttemptTimeoutRef.current = win.setTimeout(() => {
        attemptRestoreScroll(key, savedPosition.y, savedPosition.x, 1);
      }, INITIAL_RESTORE_DELAY);

    } else {
      // console.log(`Sem posição válida para ${key} ou expirada, rolando para o topo.`);
      win.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      if (savedPosition) {
        delete scrollPositions.current[key];
        persistPositions();
      }
    }
  }, [getWindow, persistPositions, attemptRestoreScroll]);

  // --- Efeitos ---

  // Carrega posições na montagem inicial
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  // Efeito principal para salvar/restaurar baseado na navegação
  useLayoutEffect(() => {
    const win = getWindow();
    if (!win) return;

    const currentKey = location.key === 'default' ? location.pathname + location.search : location.key;

    // Salva a posição da página ANTERIOR antes de decidir o que fazer com a atual
    // Isso é crucial para capturar a posição antes da transição
    if (lastNavigationType.current && lastNavigationType.current !== 'POP') {
        const previousKey = win.history.state?.key;
        if (previousKey && previousKey !== currentKey) {
             // console.log(`Salvando posição da chave anterior ${previousKey} antes da navegação ${navigationType}`);
             saveScrollPosition(previousKey);
        }
    }

    if (navigationType === 'POP') {
      // console.log(`Navegação POP detectada para ${currentKey}`);
      restoreScrollPosition(currentKey);
    } else {
      // Garante scroll para o topo em navegações PUSH/REPLACE
      // console.log(`Navegação ${navigationType} detectada para ${currentKey}, rolando para o topo.`);
      win.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Atualiza o último tipo de navegação
    lastNavigationType.current = navigationType;

  }, [location.key, location.pathname, location.search, navigationType, restoreScrollPosition, saveScrollPosition, getWindow]);

  // Salva posição antes de descarregar a página
  useEffect(() => {
    const win = getWindow();
    if (!win) return;

    const handleBeforeUnload = () => {
      const currentKey = location.key === 'default' ? location.pathname + location.search : location.key;
      // console.log(`Salvando posição antes de descarregar para ${currentKey}`);
      saveScrollPosition(currentKey);
    };

    win.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      win.removeEventListener('beforeunload', handleBeforeUnload);
      if (restoreAttemptTimeoutRef.current) {
        win.clearTimeout(restoreAttemptTimeoutRef.current);
      }
    };
  }, [location.key, location.pathname, location.search, saveScrollPosition, getWindow]);

}; // Fim do hook

