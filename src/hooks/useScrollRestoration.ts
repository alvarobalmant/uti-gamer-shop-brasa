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
const SESSION_STORAGE_KEY = 'utiGamesScrollPositions_v3'; // Incrementar versão da chave
// Tempo máximo de validade da posição salva (em milissegundos) - 1 hora
const SCROLL_POSITION_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Hook robusto para restauração de posição de scroll entre navegações.
 * Utiliza sessionStorage para persistência na sessão.
 * Inclui verificações de ambiente e lógica aprimorada para restauração.
 * Versão focada em corrigir a funcionalidade de scroll.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const restoreTimeoutRef = useRef<number | null>(null);
  const lastSavedKey = useRef<string | null>(null);

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
        // console.log('Posições de scroll carregadas:', validPositions);
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
      // console.log('Posições de scroll persistidas:', scrollPositions.current);
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

    // Salva apenas se houver algum scroll (evita salvar 0,0 desnecessariamente)
    if (scrollPos.y > 10 || scrollPos.x > 10) {
      scrollPositions.current[key] = scrollPos;
      lastSavedKey.current = key; // Guarda a última chave salva
      persistPositions();
      // console.log(`Posição salva para ${key}:`, scrollPos);
    }
  }, [getWindow, persistPositions]);

  const restoreScrollPosition = useCallback((key: string) => {
    const win = getWindow();
    if (!win) return;

    const savedPosition = scrollPositions.current[key];

    if (savedPosition && (Date.now() - savedPosition.timestamp < SCROLL_POSITION_EXPIRATION_MS)) {
      isRestoringRef.current = true;
      // console.log(`Restaurando para ${key}:`, savedPosition);
      win.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'auto' });

      // Limpa o timeout anterior se houver
      if (restoreTimeoutRef.current) {
        win.clearTimeout(restoreTimeoutRef.current);
      }

      // Define um timeout para resetar o flag isRestoringRef
      // Isso é crucial para permitir que o scroll seja salvo novamente após a restauração
      restoreTimeoutRef.current = win.setTimeout(() => {
        isRestoringRef.current = false;
        restoreTimeoutRef.current = null;
        // console.log(`Flag isRestoring resetado para ${key}`);
      }, 150); // Tempo para permitir que o scroll ocorra e eventos se estabilizem
    } else {
      // Se não há posição válida ou está expirada, rola para o topo
      // console.log(`Sem posição válida para ${key} ou expirada, rolando para o topo.`);
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

    // Usa location.key se disponível, senão uma combinação de pathname/search
    // location.key é mais confiável para diferenciar entradas no histórico
    const currentKey = location.key === 'default' ? location.pathname + location.search : location.key;

    if (navigationType === 'POP') {
      // console.log(`Navegação POP detectada para ${currentKey}`);
      restoreScrollPosition(currentKey);
    } else {
      // Garante scroll para o topo em navegações PUSH/REPLACE
      // console.log(`Navegação ${navigationType} detectada para ${currentKey}, rolando para o topo.`);
      win.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Função de limpeza: Salva a posição da página ANTERIOR
    // Usa a chave guardada em lastSavedKey.current
    return () => {
      if (lastSavedKey.current) {
         // console.log(`Salvando posição na limpeza para ${lastSavedKey.current}`);
         saveScrollPosition(lastSavedKey.current);
      }
    };
  // Dependências revisadas para garantir execução correta
  }, [location.key, location.pathname, location.search, navigationType, restoreScrollPosition, saveScrollPosition, getWindow]);

  // Salva posição antes de descarregar a página (fechar aba/navegador)
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
      // Limpa timeout ao desmontar o componente principal
      if (restoreTimeoutRef.current) {
        win.clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, [location.key, location.pathname, location.search, saveScrollPosition, getWindow]);

}; // Fim do hook

