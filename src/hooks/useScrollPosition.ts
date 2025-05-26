
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    // Save current scroll position when leaving a page
    const saveScrollPosition = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    // Restore scroll position when entering a page
    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions.current[location.pathname];
      if (savedPosition !== undefined) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 100);
      }
    };

    // Save position before navigation
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // Restore position after navigation
    restoreScrollPosition();

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  const saveCurrentPosition = () => {
    scrollPositions.current[location.pathname] = window.scrollY;
  };

  return { saveCurrentPosition };
};
