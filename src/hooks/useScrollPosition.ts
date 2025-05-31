
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

  // Função para gerar uma chave única para cada rota
  const getScrollKey = useCallback((path: string) => {
    return `utiGamesScrollPos_${path}`;
  }, []);

  // Função para salvar a posição de scroll para qualquer página
  const saveScrollPosition = useCallback(() => {
    const scrollPos: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
      path: window.location.pathname,
      timestamp: new Date().getTime()
    };
    
    try {
      const key = getScrollKey(window.location.pathname);
      localStorage.setItem(key, JSON.stringify(scrollPos));
      console.log(`Scroll position ${scrollPos.y} saved for ${window.location.pathname}`);
    } catch (error) {
      console.warn('Failed to save scroll position:', error);
    }
  }, [getScrollKey]);

  // Função para restaurar a posição de scroll para qualquer página
  const restoreScrollPosition = useCallback(() => {
    try {
      const key = getScrollKey(window.location.pathname);
      const scrollPosData = localStorage.getItem(key);
      
      if (scrollPosData) {
        const scrollPos: ScrollPosition = JSON.parse(scrollPosData);
        
        // Verificar se o dado não está expirado (30 minutos)
        const now = new Date().getTime();
        const timeLimit = 30 * 60 * 1000; // 30 minutos em milissegundos
        
        if (now - scrollPos.timestamp < timeLimit) {
          console.log(`Found saved scroll position ${scrollPos.y} for ${window.location.pathname}`);
          
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
          localStorage.removeItem(key);
          console.log('Scroll position data expired, cleared from storage');
        }
      } else {
        console.log(`No saved scroll position found for ${window.location.pathname}`);
      }
    } catch (error) {
      console.warn('Failed to restore scroll position:', error);
      // Limpar dados corrompidos
      const key = getScrollKey(window.location.pathname);
      localStorage.removeItem(key);
    }
  }, [getScrollKey]);

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
    // Restaurar posição ao carregar a página
    restoreScrollPosition();
    
    // Adicionar listener para salvar posição durante scroll
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
  }, [restoreScrollPosition, debouncedSavePosition, saveScrollPosition, handlePopState]);

  return { 
    saveScrollPosition,
    setupScrollRestoration,
    restoreScrollPosition
  };
};
