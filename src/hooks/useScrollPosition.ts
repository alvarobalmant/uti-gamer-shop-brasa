
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPositions {
  [path: string]: number;
}

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollPositions = useRef<ScrollPositions>({});
  const isNavigatingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isRestoringRef = useRef(false);

  // Detectar se é uma navegação de volta (back navigation)
  const isBackNavigation = useRef(false);

  const saveScrollPosition = useCallback((path?: string) => {
    const currentPath = path || location.pathname;
    const currentPosition = window.scrollY;
    
    // Salvar na memória
    scrollPositions.current[currentPath] = currentPosition;
    
    // Salvar no sessionStorage como backup
    sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
    
    console.log(`💾 Salvando posição ${currentPosition} para ${currentPath}`);
  }, [location.pathname]);

  const restoreScrollPosition = useCallback((path?: string, force = false) => {
    if (isRestoringRef.current && !force) return;
    
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
      isRestoringRef.current = true;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.log(`🔄 Tentando restaurar posição ${savedPosition} para ${targetPath}`);
      
      // Usar múltiplas tentativas para garantir que a restauração funcione
      const attemptRestore = (attempts = 0) => {
        if (attempts >= 5) {
          isRestoringRef.current = false;
          return;
        }
        
        window.scrollTo(0, savedPosition);
        
        // Verificar se a posição foi definida corretamente
        setTimeout(() => {
          const currentScroll = window.scrollY;
          const difference = Math.abs(currentScroll - savedPosition);
          
          if (difference > 50 && attempts < 4) {
            console.log(`📍 Posição não restaurada corretamente (atual: ${currentScroll}, esperada: ${savedPosition}), tentativa ${attempts + 1}`);
            attemptRestore(attempts + 1);
          } else {
            console.log(`✅ Posição restaurada com sucesso: ${currentScroll}`);
            isRestoringRef.current = false;
            isNavigatingRef.current = false;
          }
        }, 100);
      };
      
      // Iniciar tentativas de restauração após um pequeno delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          attemptRestore();
        }, 50);
      });
    } else {
      isRestoringRef.current = false;
      isNavigatingRef.current = false;
    }
  }, [location.pathname]);

  // Detectar navegação de volta usando popstate
  useEffect(() => {
    const handlePopState = () => {
      console.log('🔙 Detectada navegação de volta (popstate)');
      isBackNavigation.current = true;
      isNavigatingRef.current = false;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition]);

  // Restaurar posição ao entrar na página
  useEffect(() => {
    // Se foi uma navegação de volta, restaurar a posição
    if (isBackNavigation.current) {
      console.log('🎯 Navegação de volta detectada, restaurando posição...');
      setTimeout(() => {
        restoreScrollPosition(location.pathname, true);
      }, 100);
      isBackNavigation.current = false;
    } else if (!isNavigatingRef.current) {
      // Delay pequeno para garantir que o conteúdo foi carregado
      setTimeout(() => {
        restoreScrollPosition();
      }, 50);
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

  return { 
    saveCurrentPosition, 
    savePositionForPath,
    restoreScrollPosition 
  };
};
