
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

  const saveScrollPosition = useCallback((path?: string) => {
    const currentPath = path || location.pathname;
    const currentPosition = window.scrollY;
    scrollPositions.current[currentPath] = currentPosition;
    console.log(`Salvando posição ${currentPosition} para ${currentPath}`);
  }, [location.pathname]);

  const restoreScrollPosition = useCallback((path?: string) => {
    const targetPath = path || location.pathname;
    const savedPosition = scrollPositions.current[targetPath];
    
    if (savedPosition !== undefined && !isNavigatingRef.current) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Use multiple timeouts to ensure restoration works
      timeoutRef.current = setTimeout(() => {
        window.scrollTo(0, savedPosition);
        console.log(`Restaurando posição ${savedPosition} para ${targetPath}`);
        
        // Verify the scroll position was set correctly
        setTimeout(() => {
          if (Math.abs(window.scrollY - savedPosition) > 50) {
            window.scrollTo(0, savedPosition);
            console.log(`Re-aplicando posição ${savedPosition} para ${targetPath}`);
          }
          isNavigatingRef.current = false;
        }, 100);
      }, 50);
    } else {
      isNavigatingRef.current = false;
    }
  }, [location.pathname]);

  // Save position when leaving a page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // Save position on scroll (debounced)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveScrollPosition();
      }, 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      saveScrollPosition(); // Save current position when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition]);

  // Restore position when entering a page
  useEffect(() => {
    restoreScrollPosition();
  }, [location.pathname, restoreScrollPosition]);

  const saveCurrentPosition = useCallback(() => {
    saveScrollPosition();
    isNavigatingRef.current = true;
  }, [saveScrollPosition]);

  const savePositionForPath = useCallback((path: string) => {
    saveScrollPosition(path);
    isNavigatingRef.current = true;
  }, [saveScrollPosition]);

  return { 
    saveCurrentPosition, 
    savePositionForPath,
    restoreScrollPosition 
  };
};
