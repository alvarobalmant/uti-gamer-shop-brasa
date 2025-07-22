import { useEffect, useRef } from 'react';
import { useUTICoins } from './useUTICoins';
import { useAuth } from './useAuth';

export const useScrollCoins = () => {
  const { user } = useAuth();
  const { earnScrollCoins } = useUTICoins();
  const lastScrollTime = useRef<number>(0);
  const scrollDistance = useRef<number>(0);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      // Calcular distância de scroll
      const deltaY = Math.abs(currentScrollY - lastScrollY.current);
      scrollDistance.current += deltaY;
      lastScrollY.current = currentScrollY;

      // Verificar se passou pelo cooldown (30 segundos) e scrollou pelo menos 500px
      if (
        currentTime - lastScrollTime.current > 30000 && // 30 segundos
        scrollDistance.current > 500 // Pelo menos 500px de scroll
      ) {
        earnScrollCoins();
        lastScrollTime.current = currentTime;
        scrollDistance.current = 0; // Reset da distância
      }
    };

    // Throttle para não executar muito frequentemente
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [user, earnScrollCoins]);
};