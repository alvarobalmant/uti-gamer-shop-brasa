import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Stub UserStreak interface to match new database structure
export interface UserStreak {
  id?: string;
  user_id?: string;
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  streak_multiplier: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClaimTimer {
  canClaim: boolean;
  hoursUntilNext: number;
  minutesUntilNext: number;
  secondsUntilNext: number;
  nextClaimTime: Date | null;
}

export const useUserStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [timer, setTimer] = useState<ClaimTimer>({
    canClaim: false,
    hoursUntilNext: 0,
    minutesUntilNext: 0,
    secondsUntilNext: 0,
    nextClaimTime: null
  });
  const [loading, setLoading] = useState(true);

  // Stub implementation - calculate next claim time
  const calculateNextClaimTime = useCallback((lastLoginDate: string | null): ClaimTimer => {
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
    const now = new Date();
    const nextClaimTime = new Date(lastLogin);
    nextClaimTime.setDate(nextClaimTime.getDate() + 1);

    if (now >= nextClaimTime) {
      return {
        canClaim: true,
        hoursUntilNext: 0,
        minutesUntilNext: 0,
        secondsUntilNext: 0,
        nextClaimTime: null
      };
    }

    const timeDiff = nextClaimTime.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return {
      canClaim: false,
      hoursUntilNext: hours,
      minutesUntilNext: minutes,
      secondsUntilNext: seconds,
      nextClaimTime
    };
  }, []);

  // Stub implementation - load streak data
  const loadStreakData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading streak data (stub implementation)');
      
      // Stub data - in real implementation this would come from user_coins table
      const stubStreak: UserStreak = {
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_login_date: new Date().toISOString(),
        streak_multiplier: 1.0
      };

      setStreak(stubStreak);
      const timerData = calculateNextClaimTime(stubStreak.last_login_date);
      setTimer(timerData);

    } catch (error) {
      console.error('Erro ao carregar dados de streak:', error);
      // Set default values on error
      setStreak(null);
      setTimer({
        canClaim: true,
        hoursUntilNext: 0,
        minutesUntilNext: 0,
        secondsUntilNext: 0,
        nextClaimTime: null
      });
    } finally {
      setLoading(false);
    }
  }, [user, calculateNextClaimTime]);

  // Update timer every second when applicable
  useEffect(() => {
    if (!timer.canClaim && timer.nextClaimTime) {
      const interval = setInterval(() => {
        const newTimer = calculateNextClaimTime(streak?.last_login_date || null);
        setTimer(newTimer);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer.canClaim, timer.nextClaimTime, streak?.last_login_date, calculateNextClaimTime]);

  // Load data on mount and user change
  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  return {
    streak,
    timer,
    loading,
    refreshData: loadStreakData,
    calculateNextMultiplier: () => 1.1, // stub
    calculateMultiplierPercentage: () => 10, // stub  
    refreshStreak: loadStreakData // alias
  };
};