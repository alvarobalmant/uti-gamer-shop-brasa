import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DailyBonusTimer {
  canClaim: boolean;
  hoursUntilNext: number;
  minutesUntilNext: number;
  secondsUntilNext: number;
  nextReset: Date | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  lastClaim: Date | null;
}

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  streak_multiplier: number;
  last_login_date: string | null;
}

interface StreakConfig {
  max_multiplier: number;
  multiplier_increment: number;
}

export const useDailyBonusBrasilia = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<DailyBonusTimer>({
    canClaim: true,
    hoursUntilNext: 0,
    minutesUntilNext: 0,
    secondsUntilNext: 0,
    nextReset: null,
    periodStart: null,
    periodEnd: null,
    lastClaim: null
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

  // Buscar timer do backend (Brasília)
  const fetchBrasiliaTimer = useCallback(async (): Promise<DailyBonusTimer> => {
    if (!user?.id) {
      return {
        canClaim: false,
        hoursUntilNext: 0,
        minutesUntilNext: 0,
        secondsUntilNext: 0,
        nextReset: null,
        periodStart: null,
        periodEnd: null,
        lastClaim: null
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'get_daily_timer' }
      });

      if (error) {
        console.error('Erro ao buscar timer de Brasília:', error);
        return {
          canClaim: true,
          hoursUntilNext: 0,
          minutesUntilNext: 0,
          secondsUntilNext: 0,
          nextReset: null,
          periodStart: null,
          periodEnd: null,
          lastClaim: null
        };
      }

      if (!data.success) {
        console.error('Timer response failed:', data);
        return {
          canClaim: true,
          hoursUntilNext: 0,
          minutesUntilNext: 0,
          secondsUntilNext: 0,
          nextReset: null,
          periodStart: null,
          periodEnd: null,
          lastClaim: null
        };
      }

      const nextReset = data.nextReset ? new Date(data.nextReset) : null;
      const periodStart = data.periodStart ? new Date(data.periodStart) : null;
      const periodEnd = data.periodEnd ? new Date(data.periodEnd) : null;
      const lastClaim = data.lastClaim ? new Date(data.lastClaim) : null;

      // Calcular tempo até o próximo reset (sempre às 20h Brasília)
      let hoursUntilNext = 0;
      let minutesUntilNext = 0;
      let secondsUntilNext = 0;

      if (nextReset && !data.canClaim) {
        const now = new Date();
        const timeDiff = nextReset.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          hoursUntilNext = Math.floor(timeDiff / (1000 * 60 * 60));
          minutesUntilNext = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          secondsUntilNext = Math.floor((timeDiff % (1000 * 60)) / 1000);
        }
      }

      return {
        canClaim: data.canClaim,
        hoursUntilNext,
        minutesUntilNext,
        secondsUntilNext,
        nextReset,
        periodStart,
        periodEnd,
        lastClaim
      };
    } catch (error) {
      console.error('Erro ao buscar timer de Brasília:', error);
      return {
        canClaim: true,
        hoursUntilNext: 0,
        minutesUntilNext: 0,
        secondsUntilNext: 0,
        nextReset: null,
        periodStart: null,
        periodEnd: null,
        lastClaim: null
      };
    }
  }, [user?.id]);

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
      } else if (streakError.code === 'PGRST116') {
        // Usuário não tem streak ainda
        setStreak(null);
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

      // Carregar timer inicial
      const initialTimer = await fetchBrasiliaTimer();
      setTimer(initialTimer);

    } catch (error) {
      console.error('Erro ao carregar dados de streak:', error);
    } finally {
      setLoading(false);
    }
  }, [user, fetchBrasiliaTimer]);

  // Atualizar timer a cada segundo usando backend
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(async () => {
      const newTimer = await fetchBrasiliaTimer();
      setTimer(newTimer);
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.id, fetchBrasiliaTimer]);

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