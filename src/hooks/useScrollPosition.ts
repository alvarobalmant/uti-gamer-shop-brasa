
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
  path: string;
  timestamp: number;
}

export const useScrollPosition = () => {
  const location = useLocation();

  // Função para verificar se estamos na página inicial
  const isHomePage = useCallback(() => {
    return location.pathname === '/' || location.pathname === '/index.html';
  }, [location.pathname]);

  // Função para salvar a posição de scroll (apenas na página inicial)
  const saveScrollPosition = useCallback(() => {
    if (isHomePage()) {
      const scrollPos: ScrollPosition = {
        x: window.scrollX,
        y: window.scrollY,
        path: window.location.pathname,
        timestamp: new Date().getTime()
      };
      
      try {
        localStorage.setItem('utiGamesScrollPos', JSON.stringify(scrollPos));
        console.log(`Scroll position ${scrollPos.y} saved for home page`);
      } catch (error) {
        console.warn('Failed to save scroll position:', error);
      }
    }
  }, [isHomePage]);

  // Função para restaurar a posição de scroll (apenas na página inicial)
  const restoreScrollPosition = useCallback(() => {
    if (isHomePage()) {
      try {
        const scrollPosData = localStorage.getItem('utiGamesScrollPos');
        
        if (scrollPosData) {
          const scrollPos: ScrollPosition = JSON.parse(scrollPosData);
          
          // Verificar se o dado não está expirado (30 minutos)
          const now = new Date().getTime();
          const timeLimit = 30 * 60 * 1000; // 30 minutos em milissegundos
          
          if (now - scrollPos.timestamp < timeLimit) {
            console.log(`Found saved scroll position ${scrollPos.y} for home page`);
            
            // Usar setTimeout para garantir que a página esteja totalmente carregada
            setTimeout(() => {
              console.log(`Attempting to scroll to ${scrollPos.y}`);
              window.scrollTo({
                left: scrollPos.x,
                top: scrollPos.y,
                behavior: 'auto' // Usar 'auto' para evitar animação estranha
              });
            }, 100);
          } else {
            // Limpar dados expirados
            localStorage.removeItem('utiGamesScrollPos');
            console.log('Scroll position data expired, cleared from storage');
          }
        } else {
          console.log('No saved scroll position found for home page');
        }
      } catch (error) {
        console.warn('Failed to restore scroll position:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('utiGamesScrollPos');
      }
    }
  }, [isHomePage]);

  // Função debounce para salvar posição durante scroll
  const debouncedSavePosition = useCallback(() => {
    let timeout: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        saveScrollPosition();
      }, 200);
    };
  }, [saveScrollPosition]);

  // Handler para o evento popstate (botão voltar do navegador)
  const handlePopState = useCallback(() => {
    console.log("Popstate event detected");
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  // Setup da restauração de scroll e eventos
  const setupScrollRestoration = useCallback(() => {
    // Restaurar posição ao carregar a página inicial
    if (isHomePage()) {
      restoreScrollPosition();
      
      // Adicionar listener para salvar posição durante scroll (apenas na página inicial)
      const debouncedSave = debouncedSavePosition();
      window.addEventListener('scroll', debouncedSave);
      
      // Salvar posição ao sair da página
      const handleBeforeUnload = () => {
        saveScrollPosition();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Adicionar listener para popstate
      window.addEventListener("popstate", handlePopState);

      // Função de limpeza
      return () => {
        window.removeEventListener('scroll', debouncedSave);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    } else {
      // Para outras páginas, apenas adicionar listener para popstate
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isHomePage, restoreScrollPosition, debouncedSavePosition, saveScrollPosition, handlePopState]);

  return { 
    saveScrollPosition,
    setupScrollRestoration,
    restoreScrollPosition
  };
};
