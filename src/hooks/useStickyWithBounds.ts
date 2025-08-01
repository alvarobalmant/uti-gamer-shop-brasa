import { useEffect, useRef, useCallback } from 'react';
import { StickyManager, throttle, debounce } from '@/lib/stickyHelpers';

interface UseStickyWithBoundsProps {
  enabled?: boolean;
  referenceElementId: string; // ID of the element that defines the bottom boundary
  offset?: number; // Additional offset from the top
}

export const useStickyWithBounds = ({ 
  enabled = true, 
  referenceElementId,
  offset = 0 
}: UseStickyWithBoundsProps) => {
  const managerRef = useRef<StickyManager | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const isInitializedRef = useRef(false);

  // Initialize the sticky manager
  useEffect(() => {
    if (!enabled) return;

    managerRef.current = new StickyManager();
    
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [enabled]);

  // Setup scroll and resize listeners
  useEffect(() => {
    if (!enabled || !managerRef.current) return;

    const handleScroll = throttle(() => {
      if (managerRef.current) {
        managerRef.current.updateScroll(window.scrollY);
      }
    }, 8); // ~120fps for ultra smooth scrolling

    const handleResize = debounce(() => {
      if (managerRef.current) {
        updateAllBounds();
      }
    }, 150);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  // Update bounds for all registered elements
  const updateAllBounds = useCallback(() => {
    const referenceElement = document.getElementById(referenceElementId);
    if (!referenceElement || !managerRef.current) return;

    elementsRef.current.forEach((element, id) => {
      const bounds = managerRef.current!.calculateBounds(element, referenceElement);
      bounds.start += offset;
      bounds.end += offset;
      
      managerRef.current!.removeElement(id);
      managerRef.current!.addElement(id, element, bounds);
    });
  }, [referenceElementId, offset]);

  // Register a sticky element
  const registerStickyElement = useCallback((id: string, element: HTMLElement | null) => {
    if (!enabled || !element || !managerRef.current) return;

    const referenceElement = document.getElementById(referenceElementId);
    if (!referenceElement) {
      console.warn(`Reference element with id "${referenceElementId}" not found`);
      return;
    }

    // Store the element
    elementsRef.current.set(id, element);

    // Calculate bounds
    const bounds = managerRef.current.calculateBounds(element, referenceElement);
    bounds.start += offset;
    bounds.end += offset;

    // Add to manager
    managerRef.current.addElement(id, element, bounds);

    // Initial position update
    managerRef.current.updateScroll(window.scrollY);
  }, [enabled, referenceElementId, offset]);

  // Unregister a sticky element
  const unregisterStickyElement = useCallback((id: string) => {
    if (!managerRef.current) return;

    managerRef.current.removeElement(id);
    elementsRef.current.delete(id);
  }, []);

  // Refresh bounds (useful when layout changes)
  const refreshBounds = useCallback(() => {
    updateAllBounds();
  }, [updateAllBounds]);

  // Reset all transforms (useful for cleanup)
  const resetTransforms = useCallback(() => {
    elementsRef.current.forEach((element) => {
      element.style.transform = '';
      element.style.willChange = '';
    });
  }, []);

  return {
    registerStickyElement,
    unregisterStickyElement,
    refreshBounds,
    resetTransforms,
    isEnabled: enabled
  };
};