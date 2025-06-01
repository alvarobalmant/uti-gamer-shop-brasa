import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType, Location } from 'react-router-dom';

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
 * Utiliza sessionStorage para persistência na sessão e history.state para dados mais recentes.
 * Foca em confiabilidade e performance, especialmente em mobile.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false); // Flag para evitar salvar scroll durante a restauração
  const restoreTimeoutRef = useRef<number | null>(null); // Ref para o timeout de restauração

  // --- Funções Auxiliares ---

  // Carrega posições do sessionStorage na inicialização
  const loadPositionsFromSessionStorage = useCallback(() => {
    try {
      const savedPositions = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedPositions) {
        const parsedPositions: ScrollPositionMap = JSON.parse(savedPositions);
        // Filtra posições expiradas
        const now = Date.now();
        const validPositions: ScrollPositionMap = {};
        for (const key in parsedPositions) {
          if (now - parsedPositions[key].timestamp < SCROLL_POSITION_EXPIRATION_MS) {
            validPositions[key] = parsedPositions[key];
          }
        }
        scrollPositions.current = validPositions;
        // console.log('Loaded valid scroll positions from sessionStorage:', scrollPositions.current);
      }
    } catch (error) {
      console.warn('Failed to load scroll positions from sessionStorage:', error);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  // Salva posições no sessionStorage
  const persistPositionsToSessionStorage = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('Failed to save scroll positions to sessionStorage:', error);
    }
  }, []);

  // Salva a posição de scroll atual para uma dada chave (geralmente location.key)
  const saveScrollPosition = useCallback((key: string) => {
    if (isRestoringRef.current) return; // Não salva durante a restauração

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };

    // Salva apenas se houver scroll significativo para evitar ruído
    if (scrollPos.y > 50 || scrollPos.x > 10) {
      scrollPositions.current[key] = scrollPos;
      // console.log(`Saved scroll position for key ${key}:`, scrollPos);
      // Atualiza sessionStorage para persistência na sessão
      persistPositionsToSessionStorage();
    }
  }, [persistPositionsToSessionStorage]);

  // Tenta restaurar a posição de scroll para uma dada chave
  const restoreScrollPosition = useCallback((key: string) => {
    const savedPosition = scrollPositions.current[key];

    if (savedPosition) {
      const now = Date.now();
      // Verifica se a posição não expirou
      if (now - savedPosition.timestamp < SCROLL_POSITION_EXPIRATION_MS) {
        isRestoringRef.current = true;

        // Limpa timeout anterior, se houver
        if (restoreTimeoutRef.current) {
          clearTimeout(restoreTimeoutRef.current);
        }

        // Tenta restaurar usando requestAnimationFrame para sincronizar com a renderização
        // Isso é geralmente mais confiável que setTimeout
        const attemptScroll = () => {
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto', // Usa 'auto' para scroll instantâneo
          });

          // Verifica após um pequeno delay se o scroll funcionou
          restoreTimeoutRef.current = window.setTimeout(() => {
            const currentY = window.scrollY;
            const tolerance = 10; // Tolerância para a verificação
            if (Math.abs(currentY - savedPosition.y) > tolerance) {
              // Se não funcionou, tenta novamente (poderia adicionar lógica de retry aqui se necessário)
              // console.warn(`Scroll restoration attempt for key ${key} might not be precise. Target: ${savedPosition.y}, Current: ${currentY}`);
            }
            // Marca como não restaurando mais após a tentativa
            isRestoringRef.current = false;
            restoreTimeoutRef.current = null;
            // console.log(`Scroll restoration attempt finished for key ${key}.`);
          }, 100); // Delay para verificação pós-scroll
        };

        // Adia a tentativa de scroll para garantir que o DOM esteja mais estável
        requestAnimationFrame(() => {
            // Adiciona um pequeno delay adicional antes de tentar o scroll
            setTimeout(attemptScroll, 50);
        });

        // console.log(`Attempting to restore scroll position for key ${key}:`, savedPosition);
      } else {
        // Remove a posição expirada
        delete scrollPositions.current[key];
        persistPositionsToSessionStorage();
        // console.log(`Scroll position for key ${key} expired and removed.`);
        // Rola para o topo se a posição expirou
        window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      }
    } else {
      // Se não há posição salva, rola para o topo
      // console.log(`No saved scroll position for key ${key}, scrolling to top.`);
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }
  }, [persistPositionsToSessionStorage]);

  // --- Efeitos ---

  // Carrega posições do sessionStorage na montagem inicial
  useEffect(() => {
    loadPositionsFromSessionStorage();

    // Adiciona listener para salvar antes de descarregar a página
    const handleBeforeUnload = () => {
      // Salva a posição da localização atual antes de sair
      if (location.key) {
        saveScrollPosition(location.key);
      }
      persistPositionsToSessionStorage(); // Garante que tudo seja salvo
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Limpa timeout de restauração ao desmontar
      if (restoreTimeoutRef.current) {
        clearTimeout(restoreTimeoutRef.current);
      }
    };
    // Executa apenas uma vez na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efeito principal para salvar e restaurar scroll baseado na navegação
  useLayoutEffect(() => {
    // Usa location.key como identificador único da entrada no histórico
    const currentKey = location.key || 'initial'; // 'initial' para a primeira renderização sem key

    if (navigationType === 'POP') {
      // Navegação para trás/frente: restaura a posição salva para esta key
      restoreScrollPosition(currentKey);
    } else {
      // Navegação PUSH ou REPLACE: rola para o topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Função de cleanup: salva a posição da PÁGINA ANTERIOR antes da transição
    // Precisamos capturar a key da localização *anterior*
    let previousKey = currentKey;
    return () => {
      saveScrollPosition(previousKey);
    };
  }, [location.key, navigationType, saveScrollPosition, restoreScrollPosition]); // Depende da key da localização

  // Efeito para salvar scroll durante a rolagem (com debounce)
  useEffect(() => {
    const currentKey = location.key || 'initial';
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isRestoringRef.current) return; // Não salva durante a restauração

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      // Debounce para salvar a posição após o usuário parar de rolar
      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentKey);
      }, 200); // Debounce de 200ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key, saveScrollPosition]); // Depende da key da localização

};

