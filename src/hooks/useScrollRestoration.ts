import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface ScrollPositionEntry {
  x: number;
  y: number;
  timestamp: number;
}

type ScrollPositionMap = Record<string, ScrollPositionEntry>;

/**
 * Hook avançado para restauração de posição de scroll entre navegações
 * Funciona com navegação para frente, para trás e cliques em links
 * AJUSTADO PARA MELHORAR COMPORTAMENTO MOBILE
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false);
  const initialRenderRef = useRef(true);

  // Carrega posições salvas do localStorage na inicialização
  useEffect(() => {
    try {
      const savedPositions = localStorage.getItem('utiGamesScrollPositions');
      if (savedPositions) {
        scrollPositions.current = JSON.parse(savedPositions);
        console.log('Loaded scroll positions from localStorage:', scrollPositions.current);
      }
    } catch (error) {
      console.warn('Failed to load scroll positions from localStorage:', error);
      localStorage.removeItem('utiGamesScrollPositions');
    }

    // Salva posições no localStorage ao desmontar
    return () => {
      persistScrollPositions();
    };
  }, []);

  // Função para persistir posições no localStorage
  const persistScrollPositions = useCallback(() => {
    try {
      localStorage.setItem('utiGamesScrollPositions', JSON.stringify(scrollPositions.current));
    } catch (error) {
      console.warn('Failed to save scroll positions to localStorage:', error);
    }
  }, []);

  // Salva a posição de scroll atual
  const saveScrollPosition = useCallback((path: string) => {
    // Não salva se estamos no processo de restauração
    if (isRestoringRef.current) return;

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };

    // Só salva se realmente houver scroll significativo (evita salvar 0,0)
    if (scrollPos.y > 10 || scrollPos.x > 10) { // Aumentado o threshold para evitar salvar posições triviais
      scrollPositions.current[path] = scrollPos;
      console.log(`Saved scroll position for ${path}:`, scrollPos);

      // Atualiza localStorage para persistência
      persistScrollPositions();
    }
  }, [persistScrollPositions]);

  // Restaura a posição de scroll quando retornamos a uma página
  const restoreScrollPosition = useCallback((path: string) => {
    const savedPosition = scrollPositions.current[path];

    if (savedPosition) {
      // Verifica se a posição não está expirada (24 horas)
      const now = Date.now();
      const expirationTime = 24 * 60 * 60 * 1000; // 24 horas em ms

      if (now - savedPosition.timestamp < expirationTime) {
        isRestoringRef.current = true;

        // Usa uma série de tentativas para garantir que o conteúdo esteja carregado
        let attempts = 0;
        const maxAttempts = 20; // Aumentado para mais tentativas
        const initialDelay = 100; // Aumentado delay inicial
        const attemptDelayBase = 150; // Aumentado delay base entre tentativas

        const attemptScroll = () => {
          // Tenta restaurar a posição
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto' // Instantâneo para evitar animações estranhas
          });

          // Verifica se conseguimos restaurar a posição corretamente após um pequeno delay
          // Isso dá tempo para o navegador processar o scroll, especialmente no mobile
          setTimeout(() => {
            const currentY = window.scrollY;
            const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 10; // Aumentada a tolerância

            if (!isCloseEnough && attempts < maxAttempts) {
              attempts++;
              // Tenta novamente após um delay, aumentando o tempo entre tentativas
              setTimeout(attemptScroll, attemptDelayBase * Math.min(attempts, 6)); // Aumentado multiplicador máximo
            } else {
              // Finaliza o processo de restauração após um pequeno delay
              setTimeout(() => {
                isRestoringRef.current = false;
              }, 250); // Aumentado delay final

              console.log(`Scroll restoration ${isCloseEnough ? 'succeeded' : 'gave up'} after ${attempts} attempts for ${path}`);
            }
          }, 50); // Pequeno delay para verificar a posição após o scrollTo
        };

        // Inicia a primeira tentativa com um delay maior para garantir que o DOM esteja mais pronto
        setTimeout(attemptScroll, initialDelay);
        console.log(`Attempting to restore scroll position for ${path}:`, savedPosition);
      } else {
        // Remove posições expiradas
        delete scrollPositions.current[path];
        persistScrollPositions();
        console.log(`Scroll position for ${path} expired and was removed`);
      }
    } else {
      // Se não houver posição salva, rola para o topo como fallback
      // Isso evita ficar no meio da página em casos inesperados
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      console.log(`No saved scroll position for ${path}, scrolling to top.`);
    }
  }, [persistScrollPositions]);

  // Efeito principal que gerencia a restauração de scroll
  // Usando useLayoutEffect para tentar restaurar antes da pintura, se possível
  useLayoutEffect(() => {
    const { pathname } = location;

    // Pula a primeira renderização para evitar problemas com o carregamento inicial
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      // Na primeira renderização, garante que a página comece no topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }

    // Comportamento diferente baseado no tipo de navegação
    if (navigationType === 'POP') {
      // Navegação para trás/frente (botões do navegador)
      console.log('Navigation type: POP - Attempting scroll restoration');
      // Chama a função de restauração diretamente (ela contém os delays internos)
      restoreScrollPosition(pathname);
    } else {
      // PUSH ou REPLACE (clique em link ou navegação programática)
      console.log('Navigation type:', navigationType, '- New navigation, scrolling to top');
      // Para nova navegação, sempre rola para o topo
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }

    // Salva a posição ANTES de desmontar (mudança de página)
    // Isso garante que a posição salva seja a correta antes da transição
    const currentPath = pathname;
    return () => {
      if (!isRestoringRef.current) {
        saveScrollPosition(currentPath);
      }
    };
  // Adicionado restoreScrollPosition e saveScrollPosition às dependências
  }, [location, navigationType, restoreScrollPosition, saveScrollPosition]);

  // Salva periodicamente durante a navegação na página (com debounce)
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
      }, 350) as unknown as number; // Aumentado debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location, saveScrollPosition]);

  // Salva posição antes de descarregar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
      persistScrollPositions();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, saveScrollPosition, persistScrollPositions]);

  // Listener de visibilidade (útil para voltar de outra aba)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigationType === 'POP') {
        // Atraso adicional ao voltar de outra aba, pois a renderização pode ser mais lenta
        setTimeout(() => restoreScrollPosition(location.pathname), 150);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, navigationType, restoreScrollPosition]);
};

