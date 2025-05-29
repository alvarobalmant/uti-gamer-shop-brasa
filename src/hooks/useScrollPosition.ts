
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPositions {
  [path: string]: number;
}

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollPositions = useRef<ScrollPositions>({});
  const isNavigatingRef = useRef(false);
  const isRestoringRef = useRef(false);
  const pendingRestoreRef = useRef<{ path: string; position: number } | null>(null);

  const saveScrollPosition = useCallback((path?: string) => {
    const currentPath = path || location.pathname;
    const currentPosition = window.scrollY;
    
    // Salvar na memória
    scrollPositions.current[currentPath] = currentPosition;
    
    // Salvar no sessionStorage como backup
    sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
    
    console.log(`💾 Salvando posição ${currentPosition} para ${currentPath}`);
  }, [location.pathname]);

  const restoreScrollPosition = useCallback((path?: string, retryCount = 0) => {
    if (isRestoringRef.current && retryCount === 0) return;
    
    const targetPath = path || location.pathname;
    let savedPosition = scrollPositions.current[targetPath];
    
    // Se não encontrou na memória, tentar sessionStorage
    if (savedPosition === undefined) {
      const sessionPos = sessionStorage.getItem(`scroll_${targetPath}`);
      if (sessionPos) {
        savedPosition = parseInt(sessionPos, 10);
        scrollPositions.current[targetPath] = savedPosition;
      }
    }
    
    if (savedPosition !== undefined && savedPosition > 0) {
      console.log(`🔄 Tentando restaurar posição ${savedPosition} para ${targetPath} (tentativa ${retryCount + 1})`);
      
      // Aguardar que o documento esteja pronto e o layout estabilizado
      const attemptRestore = () => {
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScrollPosition = documentHeight - viewportHeight;
        
        // Verificar se há conteúdo suficiente para fazer scroll
        if (maxScrollPosition < savedPosition) {
          console.log(`📏 Altura insuficiente (max: ${maxScrollPosition}, wanted: ${savedPosition}), aguardando...`);
          
          // Se ainda não temos altura suficiente e é uma das primeiras tentativas, aguardar mais
          if (retryCount < 10) {
            setTimeout(() => {
              restoreScrollPosition(targetPath, retryCount + 1);
            }, 200 + (retryCount * 100)); // Delay crescente
            return;
          }
        }
        
        // Executar a restauração
        isRestoringRef.current = true;
        window.scrollTo({
          top: Math.min(savedPosition, maxScrollPosition),
          behavior: 'auto' // Instantâneo para melhor UX
        });
        
        // Verificar se funcionou
        setTimeout(() => {
          const currentScroll = window.scrollY;
          const difference = Math.abs(currentScroll - savedPosition);
          
          if (difference > 50 && retryCount < 5) {
            console.log(`📍 Posição não restaurada corretamente (atual: ${currentScroll}, esperada: ${savedPosition}), tentando novamente...`);
            restoreScrollPosition(targetPath, retryCount + 1);
          } else {
            console.log(`✅ Posição restaurada com sucesso: ${currentScroll}`);
            isRestoringRef.current = false;
            isNavigatingRef.current = false;
            pendingRestoreRef.current = null;
          }
        }, 50);
      };
      
      // Usar múltiplos métodos para aguardar a renderização
      if (retryCount === 0) {
        // Primeira tentativa: aguardar frame de renderização
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(attemptRestore, 50);
          });
        });
      } else {
        // Tentativas subsequentes: delay imediato
        attemptRestore();
      }
    } else {
      isRestoringRef.current = false;
      isNavigatingRef.current = false;
      pendingRestoreRef.current = null;
    }
  }, [location.pathname]);

  // Detectar navegação de volta usando popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('🔙 Detectada navegação de volta (popstate)');
      isNavigatingRef.current = false;
      
      // Salvar informações para restauração posterior
      const targetPath = location.pathname;
      const savedPosition = scrollPositions.current[targetPath] || 
        parseInt(sessionStorage.getItem(`scroll_${targetPath}`) || '0', 10);
      
      if (savedPosition > 0) {
        pendingRestoreRef.current = { path: targetPath, position: savedPosition };
        console.log(`📌 Agendando restauração para ${targetPath} na posição ${savedPosition}`);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname]);

  // Salvar posição durante o scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isNavigatingRef.current && !isRestoringRef.current) {
          saveScrollPosition();
        }
      }, 150);
    };

    // Salvar posição quando a aba fica oculta
    const handleVisibilityChange = () => {
      if (document.hidden && !isRestoringRef.current) {
        saveScrollPosition();
      }
    };

    // Salvar posição antes de sair da página
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      saveScrollPosition();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition]);

  // Restaurar posição quando apropriado
  useEffect(() => {
    // Se há uma restauração pendente, executar
    if (pendingRestoreRef.current) {
      const { path, position } = pendingRestoreRef.current;
      console.log(`🎯 Executando restauração pendente para ${path}`);
      
      // Delay adicional para garantir que o React Router terminou
      setTimeout(() => {
        restoreScrollPosition(path);
      }, 100);
    }
  }, [location.pathname, restoreScrollPosition]);

  const saveCurrentPosition = useCallback(() => {
    saveScrollPosition();
    isNavigatingRef.current = true;
    console.log('🚀 Navegação iniciada, posição salva');
  }, [saveScrollPosition]);

  const savePositionForPath = useCallback((path: string) => {
    saveScrollPosition(path);
    isNavigatingRef.current = true;
    console.log(`🚀 Navegação iniciada para ${path}, posição salva`);
  }, [saveScrollPosition]);

  // Método para forçar restauração (para uso com loading states)
  const tryRestoreAfterLoad = useCallback(() => {
    if (pendingRestoreRef.current) {
      const { path } = pendingRestoreRef.current;
      console.log(`🔄 Tentando restaurar após carregamento para ${path}`);
      setTimeout(() => {
        restoreScrollPosition(path);
      }, 50);
    }
  }, [restoreScrollPosition]);

  return { 
    saveCurrentPosition, 
    savePositionForPath,
    restoreScrollPosition,
    tryRestoreAfterLoad
  };
};
