
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const scrollPositions = useRef<{ [key: string]: number }>({});
  const location = useLocation();

  // Salvar posição do scroll antes de navegar
  const saveScrollPosition = (pathname: string) => {
    scrollPositions.current[pathname] = window.scrollY;
  };

  // Restaurar posição do scroll
  const restoreScrollPosition = (pathname: string) => {
    const savedPosition = scrollPositions.current[pathname];
    if (savedPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 100);
    }
  };

  // Salvar posição atual quando a rota mudar
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveScrollPosition(location.pathname);
    };
  }, [location.pathname]);

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};
