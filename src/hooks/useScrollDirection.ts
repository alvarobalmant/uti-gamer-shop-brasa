import { useState, useEffect } from 'react';

/**
 * Custom hook to detect scroll direction and position.
 * @returns {{ scrollDirection: 'up' | 'down' | null, isScrolled: boolean }}
 */
export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      
      // Update isScrolled state
      setIsScrolled(scrollY > threshold);

      // Determine scroll direction
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return; // Ignore minor scrolls
      }
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(scrollY <= 0 ? 0 : scrollY); // For Mobile or negative scrolling
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    // Set initial scroll position
    setLastScrollY(window.pageYOffset);
    setIsScrolled(window.pageYOffset > threshold);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY, threshold]);

  return { scrollDirection, isScrolled };
}

