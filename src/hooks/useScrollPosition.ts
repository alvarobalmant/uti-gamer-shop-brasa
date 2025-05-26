
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollPositions = useRef<Record<string, number>>({});
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // Save current scroll position when leaving a page
    const saveScrollPosition = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    // Restore scroll position when entering a page
    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions.current[location.pathname];
      if (savedPosition !== undefined && !isNavigatingRef.current) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          isNavigatingRef.current = false;
        }, 100);
      } else {
        isNavigatingRef.current = false;
      }
    };

    // Save position before navigation
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // Save scroll position on route change
    const handleRouteChange = () => {
      saveScrollPosition();
    };

    // Restore position after navigation
    restoreScrollPosition();

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      handleRouteChange();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  const saveCurrentPosition = () => {
    scrollPositions.current[location.pathname] = window.scrollY;
    isNavigatingRef.current = true;
  };

  return { saveCurrentPosition };
};
