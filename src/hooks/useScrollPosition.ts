
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();

  // Função para salvar a posição de scroll antes da navegação
  const saveScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem(`scrollPosition_${currentPath}`, String(scrollY));
    console.log(`Scroll position ${scrollY} saved for path ${currentPath}`);
  }, []);

  // Função para restaurar a posição de scroll
  const restoreScrollPosition = useCallback(() => {
    const currentPath = window.location.pathname + window.location.search;
    const savedScrollY = sessionStorage.getItem(`scrollPosition_${currentPath}`);

    if (savedScrollY !== null) {
      const scrollPosition = parseInt(savedScrollY, 10);
      console.log(`Found saved scroll position ${scrollPosition} for path ${currentPath}`);

      // Delay para aguardar a renderização
      setTimeout(() => {
        console.log(`Attempting to scroll to ${scrollPosition}`);
        window.scrollTo(0, scrollPosition);
      }, 100);
    } else {
      console.log(`No saved scroll position found for path ${currentPath}`);
      // Se não houver posição salva, rolar para o topo
      setTimeout(() => { 
        window.scrollTo(0, 0); 
      }, 0);
    }
  }, []);

  // Handler para o evento popstate
  const handlePopState = useCallback(() => {
    console.log("Popstate event detected");
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  // Setup da restauração de scroll
  const setupScrollRestoration = useCallback(() => {
    // Tenta restaurar imediatamente caso a página seja carregada diretamente
    restoreScrollPosition();

    // Adiciona o listener para futuras navegações 'voltar'/'avançar'
    window.addEventListener("popstate", handlePopState);

    // Função de limpeza
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState, restoreScrollPosition]);

  return { 
    saveScrollPosition,
    setupScrollRestoration,
    restoreScrollPosition
  };
};
