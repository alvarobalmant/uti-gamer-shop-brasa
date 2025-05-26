
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();
  const scrollPositions = useRef<Record<string, number>>({});
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    const saveCurrentPosition = () => {
      if (!isRestoringRef.current) {
        scrollPositions.current[location.pathname] = window.scrollY;
      }
    };

    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions.current[location.pathname];
      if (savedPosition !== undefined && savedPosition > 0) {
        isRestoringRef.current = true;
        
        // Use multiple attempts to ensure restoration
        const restore = () => {
          window.scrollTo(0, savedPosition);
          
          // Check if we actually scrolled to the position
          setTimeout(() => {
            if (Math.abs(window.scrollY - savedPosition) > 10) {
              window.scrollTo(0, savedPosition);
            }
            isRestoringRef.current = false;
          }, 50);
        };

        // Try immediate restoration
        setTimeout(restore, 0);
        
        // Fallback restoration after DOM is ready
        setTimeout(restore, 100);
        
        // Final attempt after images and content load
        setTimeout(restore, 300);
      } else {
        isRestoringRef.current = false;
      }
    };

    // Save position before navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', saveCurrentPosition);

    // Restore position after navigation
    restoreScrollPosition();

    return () => {
      saveCurrentPosition();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', saveCurrentPosition);
    };
  }, [location.pathname]);

  const saveCurrentPosition = () => {
    if (!isRestoringRef.current) {
      scrollPositions.current[location.pathname] = window.scrollY;
    }
  };

  return { saveCurrentPosition };
};
