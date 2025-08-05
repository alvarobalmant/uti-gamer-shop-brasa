import { useEffect, useRef, useCallback } from 'react';
import { useUTICoins } from './useUTICoins';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUTICoinsSettings } from './useUTICoinsSettings';
import { logger } from '@/lib/productionLogger';

// Optimized scroll coins with aggressive throttling and rate limiting
export const useOptimizedScrollCoins = () => {
  const { user } = useAuth();
  const { earnScrollCoins } = useUTICoins();
  const { isEnabled } = useUTICoinsSettings();
  const { toast } = useToast();
  
  // Refs for tracking state
  const scrollDistance = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const isEarning = useRef<boolean>(false);
  const lastEarnTime = useRef<number>(0);
  const earnAttempts = useRef<number>(0);
  
  // Configuration
  const config = {
    scrollThreshold: 1000, // Increased from 500px to reduce requests
    cooldownMs: 120000, // 2 minutes minimum between attempts (was 1 minute)
    maxAttemptsPerSession: 25, // Reduced from 50 to limit total requests
    throttleMs: 200, // Increased throttling
    suspiciousThreshold: 10 // Mark as suspicious after 10 quick attempts
  };

  const handleScroll = useCallback(async () => {
    // Multiple safety checks
    if (!user || !isEnabled || isEarning.current) return;
    
    const now = Date.now();
    const timeSinceLastEarn = now - lastEarnTime.current;
    
    // Strict cooldown enforcement
    if (timeSinceLastEarn < config.cooldownMs) {
      return; // Don't even calculate scroll distance during cooldown
    }
    
    // Session limit check
    if (earnAttempts.current >= config.maxAttemptsPerSession) {
      logger.warn('Scroll coins: Session limit reached');
      return;
    }
    
    const currentScrollY = window.scrollY;
    const deltaY = Math.abs(currentScrollY - lastScrollY.current);
    scrollDistance.current += deltaY;
    lastScrollY.current = currentScrollY;

    // Higher threshold to reduce API calls
    if (scrollDistance.current > config.scrollThreshold) {
      isEarning.current = true;
      scrollDistance.current = 0;
      earnAttempts.current++;
      lastEarnTime.current = now;

      try {
        logger.debug('Scroll coins: Attempting to earn coins', {
          attempt: earnAttempts.current,
          timeSinceLastEarn,
          page: window.location.pathname
        });
        
        const result = await earnScrollCoins();
        
        if (result?.success) {
          toast({
            title: '🪙 UTI Coins ganhas!',
            description: `Você ganhou ${result.amount} moedas por explorar o site!`,
            duration: 3000,
          });
        } else if (result?.rateLimited) {
          logger.debug('Scroll coins: Rate limited by backend');
        } else if (result?.suspicious) {
          toast({
            title: '⚠️ Atividade Suspeita',
            description: 'Muitas ações detectadas. Aguarde um momento.',
            variant: 'destructive',
            duration: 5000,
          });
        }
      } catch (error) {
        logger.error('Scroll coins: Error earning coins', error);
      } finally {
        isEarning.current = false;
      }
    }
  }, [user, earnScrollCoins, toast, isEnabled]);

  useEffect(() => {
    if (!user || !isEnabled) return;

    // Reset session data when user/settings change
    earnAttempts.current = 0;
    lastEarnTime.current = 0;
    scrollDistance.current = 0;
    
    // More aggressive throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        setTimeout(() => {
          handleScroll();
          ticking = false;
        }, config.throttleMs);
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [user, handleScroll, isEnabled]);

  // Return session stats for debugging
  return {
    getSessionStats: () => ({
      earnAttempts: earnAttempts.current,
      lastEarnTime: lastEarnTime.current,
      scrollDistance: scrollDistance.current,
      config
    })
  };
};