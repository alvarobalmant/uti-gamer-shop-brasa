
import { useCallback } from 'react';

/**
 * Hook simplificado para operações manuais de scroll
 * Funciona em conjunto com useScrollRestoration
 */
export const useScrollPosition = () => {
  // Função para salvar posição manualmente (para casos específicos)
  const saveScrollPosition = useCallback(() => {
    const scrollPos = {
      x: window.scrollX,
      y: window.scrollY,
      path: window.location.pathname,
      timestamp: Date.now()
    };
    
    try {
      const key = `utiGamesScrollPos_${window.location.pathname}`;
      localStorage.setItem(key, JSON.stringify(scrollPos));
      console.log(`Manual scroll position save: ${scrollPos.y} for ${window.location.pathname}`);
    } catch (error) {
      console.warn('Failed to manually save scroll position:', error);
    }
  }, []);

  // Função para restaurar posição manualmente
  const restoreScrollPosition = useCallback(() => {
    try {
      const key = `utiGamesScrollPos_${window.location.pathname}`;
      const scrollPosData = localStorage.getItem(key);
      
      if (scrollPosData) {
        const scrollPos = JSON.parse(scrollPosData);
        
        setTimeout(() => {
          window.scrollTo({
            left: scrollPos.x,
            top: scrollPos.y,
            behavior: 'auto'
          });
          console.log(`Manual scroll restore: ${scrollPos.y}`);
        }, 100);
      }
    } catch (error) {
      console.warn('Failed to manually restore scroll position:', error);
    }
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};
