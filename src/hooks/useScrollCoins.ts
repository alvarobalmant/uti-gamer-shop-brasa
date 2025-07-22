import { useEffect, useRef } from 'react';
import { useUTICoins } from './useUTICoins';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useScrollCoins = () => {
  const { user } = useAuth();
  const { earnScrollCoins } = useUTICoins();
  const { toast } = useToast();
  const lastScrollTime = useRef<number>(0);
  const scrollDistance = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const isEarning = useRef<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const handleScroll = async () => {
      // Evitar múltiplas execuções simultâneas
      if (isEarning.current) return;

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
        isEarning.current = true;
        lastScrollTime.current = currentTime;
        scrollDistance.current = 0; // Reset da distância

        try {
          console.log('[SCROLL] Attempting to earn coins for scroll');
          const result = await earnScrollCoins();
          
          if (result?.success) {
            toast({
              title: '🪙 UTI Coins ganhas!',
              description: `Você ganhou ${result.amount} moedas por explorar o site!`,
              duration: 3000,
            });
          } else if (result?.rateLimited) {
            // Não mostrar toast para rate limiting normal
            console.log('[SCROLL] Rate limited:', result.message);
          } else if (result?.suspicious) {
            toast({
              title: '⚠️ Atividade Suspeita',
              description: 'Muitas ações detectadas. Aguarde um momento.',
              variant: 'destructive',
              duration: 5000,
            });
          } else if (result?.message) {
            console.warn('[SCROLL] Action rejected:', result.message);
          }
        } catch (error) {
          console.error('[SCROLL] Error earning coins:', error);
        } finally {
          isEarning.current = false;
        }
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
  }, [user, earnScrollCoins, toast]);
};