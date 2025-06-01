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

<<<<<<< HEAD
// Chave para armazenar no sessionStorage
const SESSION_STORAGE_KEY = 'utiGamesScrollPositions';
// Tempo máximo de validade da posição salva (em milissegundos) - 1 hora
const SCROLL_POSITION_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Hook robusto para restauração de posição de scroll entre navegações.
 * Utiliza sessionStorage para persistência na sessão e history.state para dados mais recentes.
 * Foca em confiabilidade e performance, especialmente em mobile.
=======
/**
 * Hook avançado para restauração de posição de scroll entre navegações
 * Funciona com navegação para frente, para trás e cliques em links
 * AJUSTADO PARA MELHORAR COMPORTAMENTO MOBILE
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP', 'PUSH', ou 'REPLACE'
  const scrollPositions = useRef<ScrollPositionMap>({});
  const isRestoringRef = useRef(false); // Flag para evitar salvar scroll durante a restauração
  const restoreTimeoutRef = useRef<number | null>(null); // Ref para o timeout de restauração

<<<<<<< HEAD
  // --- Funções Auxiliares ---

  // Carrega posições do sessionStorage na inicialização
  const loadPositionsFromSessionStorage = useCallback(() => {
=======
  // Carrega posições salvas do localStorage na inicialização
  useEffect(() => {
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182
    try {
      const savedPositions = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedPositions) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182

    const scrollPos: ScrollPositionEntry = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };

<<<<<<< HEAD
    // Salva apenas se houver scroll significativo para evitar ruído
    if (scrollPos.y > 50 || scrollPos.x > 10) {
      scrollPositions.current[key] = scrollPos;
      // console.log(`Saved scroll position for key ${key}:`, scrollPos);
      // Atualiza sessionStorage para persistência na sessão
      persistPositionsToSessionStorage();
=======
    // Só salva se realmente houver scroll significativo (evita salvar 0,0)
    if (scrollPos.y > 10 || scrollPos.x > 10) { // Aumentado o threshold para evitar salvar posições triviais
      scrollPositions.current[path] = scrollPos;
      console.log(`Saved scroll position for ${path}:`, scrollPos);

      // Atualiza localStorage para persistência
      persistScrollPositions();
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182
    }
  }, [persistPositionsToSessionStorage]);

<<<<<<< HEAD
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
=======
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
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182

    // Comportamento diferente baseado no tipo de navegação
    if (navigationType === 'POP') {
<<<<<<< HEAD
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
=======
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
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182
  useEffect(() => {
    const currentKey = location.key || 'initial';
    let scrollTimer: number | null = null;

    const handleScroll = () => {
<<<<<<< HEAD
      if (isRestoringRef.current) return; // Não salva durante a restauração
=======
      if (isRestoringRef.current) return;
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

<<<<<<< HEAD
      // Debounce para salvar a posição após o usuário parar de rolar
      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(currentKey);
      }, 200); // Debounce de 200ms
=======
      scrollTimer = window.setTimeout(() => {
        saveScrollPosition(pathname);
      }, 350) as unknown as number; // Aumentado debounce
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      window.removeEventListener('scroll', handleScroll);
    };
<<<<<<< HEAD
  }, [location.key, saveScrollPosition]); // Depende da key da localização
=======
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
>>>>>>> 1531b23549b2355a39fe8456adb69cfcd2b66182

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, navigationType, restoreScrollPosition]);
};

