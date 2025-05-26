
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
    
    // Also save to sessionStorage as backup
    sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
    console.log(`Salvando posição ${currentPosition} para ${currentPath}`);
  }, [location.pathname]);

  const restoreScrollPosition = useCallback((path?: string) => {
    const targetPath = path || location.pathname;
    let savedPosition = scrollPositions.current[targetPath];
    
    // If not found in memory, try sessionStorage
    if (savedPosition === undefined) {
      const sessionPos = sessionStorage.getItem(`scroll_${targetPath}`);
      if (sessionPos) {
        savedPosition = parseInt(sessionPos, 10);
        scrollPositions.current[targetPath] = savedPosition;
      }
    }
    
    if (savedPosition !== undefined && savedPosition > 0) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(() => {
          window.scrollTo(0, savedPosition);
          console.log(`Restaurando posição ${savedPosition} para ${targetPath}`);
          
          // Verify the scroll position was set correctly after a brief delay
          setTimeout(() => {
            if (Math.abs(window.scrollY - savedPosition) > 50) {
              window.scrollTo(0, savedPosition);
              console.log(`Re-aplicando posição ${savedPosition} para ${targetPath}`);
            }
            isNavigatingRef.current = false;
          }, 200);
        }, 100);
      });
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
        if (!isNavigatingRef.current) {
          saveScrollPosition();
        }
      }, 150);
    };

    // Save position on visibility change (when tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      saveScrollPosition(); // Save current position when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition]);

  // Restore position when entering a page
  useEffect(() => {
    // Only restore if we're not currently navigating
    if (!isNavigatingRef.current) {
      // Add a small delay to ensure the page content is loaded
      const restoreTimeout = setTimeout(() => {
        restoreScrollPosition();
      }, 50);
      
      return () => clearTimeout(restoreTimeout);
    }
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
