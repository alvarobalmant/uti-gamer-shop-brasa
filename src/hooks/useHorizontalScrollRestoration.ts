
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  timestamp: number;
}

// Simple in-memory storage for scroll positions
const scrollPositions = new Map<string, Map<string, ScrollPosition>>();

/**
 * Universal hook for horizontal scroll restoration
 * Automatically saves and restores horizontal scroll positions
 */
export const useHorizontalScrollRestoration = (sectionId: string) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pageKey = location.pathname + location.search;
  const saveIntervalRef = useRef<number | null>(null);

  // Get stored position for this section on this page
  const getStoredPosition = (): number => {
    const pageScrolls = scrollPositions.get(pageKey);
    const position = pageScrolls?.get(sectionId);
    return position?.x || 0;
  };

  // Save current position
  const savePosition = (x: number) => {
    if (!scrollPositions.has(pageKey)) {
      scrollPositions.set(pageKey, new Map());
    }
    const pageScrolls = scrollPositions.get(pageKey)!;
    pageScrolls.set(sectionId, { x, timestamp: Date.now() });
    
    console.log(`[HorizontalScroll] 💾 Saved ${sectionId}: ${x}px on ${pageKey}`);
  };

  // Restore position when element mounts
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const storedX = getStoredPosition();

    if (storedX > 0) {
      console.log(`[HorizontalScroll] 🔄 Restoring ${sectionId}: ${storedX}px on ${pageKey}`);
      
      // Restore after a brief delay to ensure content is loaded
      setTimeout(() => {
        if (element) {
          element.scrollLeft = storedX;
          
          // Verify restoration worked
          setTimeout(() => {
            const actualX = element.scrollLeft;
            const success = Math.abs(actualX - storedX) <= 10;
            console.log(`[HorizontalScroll] ${success ? '✅' : '❌'} ${sectionId} restored to ${actualX}px (target: ${storedX}px)`);
          }, 100);
        }
      }, 150);
    } else {
      console.log(`[HorizontalScroll] 📍 No saved position for ${sectionId} on ${pageKey}`);
    }
  }, [sectionId, pageKey]);

  // Auto-save position every 20ms when scrolling
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let lastSavedX = 0;

    const startAutoSave = () => {
      if (saveIntervalRef.current) return;
      
      saveIntervalRef.current = window.setInterval(() => {
        if (element) {
          const currentX = element.scrollLeft;
          if (currentX !== lastSavedX && currentX > 0) {
            savePosition(currentX);
            lastSavedX = currentX;
          }
        }
      }, 20);
    };

    const stopAutoSave = () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    };

    // Start saving when user starts scrolling
    const handleScrollStart = () => startAutoSave();
    const handleScrollEnd = () => {
      // Save final position and stop auto-save after a delay
      setTimeout(() => {
        if (element) {
          const finalX = element.scrollLeft;
          if (finalX > 0) {
            savePosition(finalX);
          }
        }
        stopAutoSave();
      }, 100);
    };

    element.addEventListener('scroll', handleScrollStart, { passive: true });
    element.addEventListener('scrollend', handleScrollEnd, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScrollStart);
      element.removeEventListener('scrollend', handleScrollEnd);
      stopAutoSave();
    };
  }, [sectionId]);

  // Debug function
  const debugScrollPositions = () => {
    console.log('[HorizontalScroll] 🔍 All saved positions:');
    for (const [page, sections] of scrollPositions.entries()) {
      console.log(`  ${page}:`);
      for (const [section, pos] of sections.entries()) {
        const age = Math.round((Date.now() - pos.timestamp) / 1000);
        console.log(`    ${section}: ${pos.x}px (${age}s ago)`);
      }
    }
  };

  // Clear positions for current page (useful for new navigation)
  const clearPagePositions = () => {
    scrollPositions.delete(pageKey);
    console.log(`[HorizontalScroll] 🗑️ Cleared positions for ${pageKey}`);
  };

  return {
    elementRef,
    debugScrollPositions,
    clearPagePositions,
    getStoredPosition: () => getStoredPosition()
  };
};
