import { useEffect, useRef, useCallback } from 'react';
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
    
    // Só salva se realmente houver scroll
    if (scrollPos.y > 0 || scrollPos.x > 0) {
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
        const maxAttempts = 15; // Aumentado para mais tentativas
        
        const attemptScroll = () => {
          // Tenta restaurar a posição
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto' // Instantâneo para evitar animações estranhas
          });
          
          // Verifica se conseguimos restaurar a posição corretamente
          const currentY = window.scrollY;
          const isCloseEnough = Math.abs(currentY - savedPosition.y) <= 5;
          
          if (!isCloseEnough && attempts < maxAttempts) {
            attempts++;
            // Tenta novamente após um pequeno delay, aumentando o tempo entre tentativas
            setTimeout(attemptScroll, 100 * Math.min(attempts, 5));
          } else {
            // Finaliza o processo de restauração após um pequeno delay
            setTimeout(() => {
              isRestoringRef.current = false;
            }, 200);
            
            console.log(`Scroll restoration ${isCloseEnough ? 'succeeded' : 'gave up'} after ${attempts} attempts`);
          }
        };
        
        // Inicia a primeira tentativa com um pequeno delay para garantir que o DOM esteja pronto
        setTimeout(attemptScroll, 50);
        console.log(`Attempting to restore scroll position for ${path}:`, savedPosition);
      } else {
        // Remove posições expiradas
        delete scrollPositions.current[path];
        persistScrollPositions();
        console.log(`Scroll position for ${path} expired and was removed`);
      }
    } else {
      // Se não houver posição salva, não faz nada (mantém a posição atual)
      console.log(`No saved scroll position for ${path}`);
    }
  }, [persistScrollPositions]);

  // Efeito principal que gerencia a restauração de scroll
  useEffect(() => {
    const { pathname } = location;
    
    // Pula a primeira renderização para evitar problemas com o carregamento inicial
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Comportamento diferente baseado no tipo de navegação
    if (navigationType === 'POP') {
      // Navegação para trás/frente (botões do navegador)
      console.log('Navigation type: POP - Restoring scroll position');
      
      // Pequeno delay para garantir que o DOM comece a renderizar
      setTimeout(() => {
        restoreScrollPosition(pathname);
      }, 50);
    } else {
      // PUSH ou REPLACE (clique em link ou navegação programática)
      console.log('Navigation type:', navigationType, '- New navigation');
      
      // Para navegação normal, não fazemos nada com o scroll
      // O comportamento padrão do navegador será mantido
    }
    
    // Salva a posição quando o componente é desmontado (mudança de página)
    return () => {
      if (!isRestoringRef.current) {
        saveScrollPosition(pathname);
      }
    };
  }, [location, navigationType, saveScrollPosition, restoreScrollPosition]);

  // Também salva periodicamente durante a navegação na página
  useEffect(() => {
    const { pathname } = location;
    
    // Usa um debounce para não salvar a cada pixel de scroll
    let scrollTimer: number | null = null;
    
    const handleScroll = () => {
      // Não processa eventos de scroll durante restauração
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
  
  // Adiciona um listener para o evento de visibilidade da página
  // Isso ajuda a capturar quando o usuário volta para a página após mudar de aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigationType === 'POP') {
        restoreScrollPosition(location.pathname);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, navigationType, restoreScrollPosition]);
};
