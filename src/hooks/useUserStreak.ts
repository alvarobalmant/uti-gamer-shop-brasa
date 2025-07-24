import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  streak_multiplier: number;
  last_login_date: string | null;
}

interface DailyLoginTimer {
  canClaim: boolean;
  hoursUntilNext: number;
  minutesUntilNext: number;
  secondsUntilNext: number;
  nextClaimTime: Date | null;
}

interface StreakConfig {
  max_multiplier: number;
  multiplier_increment: number;
}

export const useUserStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<DailyLoginTimer>({
    canClaim: true,
    hoursUntilNext: 0,
    minutesUntilNext: 0,
    secondsUntilNext: 0,
    nextClaimTime: null
  });
  const [config, setConfig] = useState<StreakConfig>({
    max_multiplier: 3.0,
    multiplier_increment: 0.1
  });

  // Calcular próximo multiplicador
  const calculateNextMultiplier = useCallback((currentStreak: number): number => {
    const nextStreak = currentStreak + 1;
    const nextMultiplier = 1.0 + ((nextStreak - 1) * config.multiplier_increment);
    return Math.min(nextMultiplier, config.max_multiplier);
  }, [config]);

  // Calcular porcentagem do multiplicador máximo
  const calculateMultiplierPercentage = useCallback((currentMultiplier: number): number => {
    return Math.round((currentMultiplier / config.max_multiplier) * 100);
  }, [config.max_multiplier]);

  // Calcular tempo até próximo claim
  const calculateNextClaimTime = useCallback((lastLoginDate: string | null): DailyLoginTimer => {
    if (!lastLoginDate) {
      return {
        canClaim: true,
        hoursUntilNext: 0,
        minutesUntilNext: 0,
        secondsUntilNext: 0,
        nextClaimTime: null
      };
    }

    const lastLogin = new Date(lastLoginDate);
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const lastLoginString = lastLogin.toISOString().split('T')[0];

    // Se o último login foi hoje, não pode fazer claim
    if (lastLoginString === todayString) {
      // Próximo claim será amanhã às 00:00
      const nextClaimDate = new Date(today);
      nextClaimDate.setDate(nextClaimDate.getDate() + 1);
      nextClaimDate.setHours(0, 0, 0, 0);

      const timeDiff = nextClaimDate.getTime() - today.getTime();
      const hoursUntilNext = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesUntilNext = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsUntilNext = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return {
        canClaim: false,
        hoursUntilNext,
        minutesUntilNext,
        secondsUntilNext,
        nextClaimTime: nextClaimDate
      };
    }

    // Se o último login não foi hoje, pode fazer claim
    return {
      canClaim: true,
      hoursUntilNext: 0,
      minutesUntilNext: 0,
      secondsUntilNext: 0,
      nextClaimTime: null
    };
  }, []);

  // Carregar dados de streak e configurações
  const loadStreakData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Carregar streak do usuário
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!streakError && streakData) {
        setStreak(streakData);
        const timerData = calculateNextClaimTime(streakData.last_login_date);
        setTimer(timerData);
      } else if (streakError.code === 'PGRST116') {
        // Usuário não tem streak ainda - pode fazer primeiro claim
        setStreak(null);
        setTimer({
          canClaim: true,
          hoursUntilNext: 0,
          minutesUntilNext: 0,
          secondsUntilNext: 0,
          nextClaimTime: null
        });
      }

      // Carregar configurações do sistema
      const { data: configData, error: configError } = await supabase
        .from('coin_system_config')
        .select('setting_key, setting_value')
        .in('setting_key', ['max_streak_multiplier', 'streak_multiplier_increment']);

      if (!configError && configData) {
        const configMap: any = {};
        configData.forEach(item => {
          configMap[item.setting_key] = item.setting_value;
        });

        setConfig({
          max_multiplier: configMap.max_streak_multiplier || 3.0,
          multiplier_increment: configMap.streak_multiplier_increment || 0.1
        });
      }

    } catch (error) {
      console.error('Erro ao carregar dados de streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateNextClaimTime]);

  // Atualizar timer a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (streak?.last_login_date) {
        const newTimer = calculateNextClaimTime(streak.last_login_date);
        setTimer(newTimer);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [streak?.last_login_date, calculateNextClaimTime]);

  // Carregar dados inicial
  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  return {
    streak,
    timer,
    loading,
    config,
    calculateNextMultiplier,
    calculateMultiplierPercentage,
    refreshStreak: loadStreakData
  };
};