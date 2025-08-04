import React, { useState, useEffect } from 'react';
import { Calendar, Flame, CheckCircle, Clock, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DailyBonusData {
  canClaim: boolean;
  currentStreak: number;
  nextBonusAmount: number;
  secondsUntilNextClaim: number;
  multiplier: number;
  nextReset: string;
  lastClaim?: string;
}

interface DailyBonusSectionProps {
  onBonusClaimed?: () => void;
}

export const DailyBonusSection: React.FC<DailyBonusSectionProps> = ({ onBonusClaimed }) => {
  const { user } = useAuth();
  const [dailyBonusData, setDailyBonusData] = useState<DailyBonusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Always define the function first, then use useEffect
  const loadDailyBonusData = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      console.log('[DAILY_BONUS_WIDGET] Requesting daily bonus data for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'can_claim_daily_bonus_brasilia' }
      });

      if (error) {
        console.error('[DAILY_BONUS_WIDGET] Error loading daily bonus data:', error);
        setError('Failed to load daily bonus data');
        return;
      }

      console.log('[DAILY_BONUS_WIDGET] Raw response data:', data);

      if (data?.success) {
        console.log('[DAILY_BONUS_WIDGET] Daily bonus data loaded successfully:', {
          canClaim: data.canClaim,
          currentStreak: data.currentStreak,
          nextBonusAmount: data.nextBonusAmount,
          secondsUntilNextClaim: data.secondsUntilNextClaim,
          multiplier: data.multiplier
        });
        
        setDailyBonusData({
          canClaim: data.canClaim || false,
          currentStreak: data.currentStreak || 1,
          nextBonusAmount: data.nextBonusAmount || 10,
          secondsUntilNextClaim: data.secondsUntilNextClaim || 0,
          multiplier: data.multiplier || 1.0,
          nextReset: data.nextReset,
          lastClaim: data.lastClaim
        });
      } else {
        console.warn('[DAILY_BONUS_WIDGET] Daily bonus response not successful:', data);
        setError(data?.message || 'Failed to load daily bonus data');
      }
    } catch (error) {
      console.error('[DAILY_BONUS_WIDGET] Exception loading daily bonus data:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados do daily bonus
  useEffect(() => {
    loadDailyBonusData();
  }, [user]);

  // Timer em tempo real para atualizar segundos restantes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      if (dailyBonusData && dailyBonusData.secondsUntilNextClaim > 0) {
        setDailyBonusData(prev => prev ? {
          ...prev,
          secondsUntilNextClaim: Math.max(0, prev.secondsUntilNextClaim - 1)
        } : null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dailyBonusData?.secondsUntilNextClaim]);

  // Função para resgatar daily bonus
  const claimDailyBonus = async () => {
    if (!dailyBonusData?.canClaim || claiming) return;
    
    try {
      setClaiming(true);
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'process_daily_login_brasilia' }
      });

      if (error) throw error;

      if (data?.success) {
        console.log('[DAILY_BONUS_WIDGET] Daily bonus claimed:', data);
        // Atualizar dados locais
        setDailyBonusData(prev => prev ? {
          ...prev,
          canClaim: false,
          currentStreak: data.streak || prev.currentStreak,
          multiplier: data.multiplier || prev.multiplier,
          lastClaim: new Date().toISOString()
        } : null);
        
        // Callback para atualizar dados do parent
        onBonusClaimed?.();
        // Recarregar dados após o claim
        setTimeout(() => loadDailyBonusData(), 1000);
      }
    } catch (error) {
      console.error('[DAILY_BONUS_WIDGET] Error claiming daily bonus:', error);
    } finally {
      setClaiming(false);
    }
  };

  const formatSecondsToTime = (seconds: number) => {
    if (seconds <= 0) return 'Disponível agora';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  const formatTimeUntilReset = (resetTime: string) => {
    const now = new Date();
    const reset = new Date(resetTime);
    const diff = reset.getTime() - now.getTime();
    
    if (diff <= 0) return 'Disponível agora';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Erro ao carregar bônus diário</span>
        </div>
      </div>
    );
  }

  if (!dailyBonusData) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Bônus diário não disponível</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Bônus Diário
        </h4>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="font-medium">{dailyBonusData.currentStreak}</span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{dailyBonusData.multiplier.toFixed(1)}x</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {dailyBonusData.canClaim ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  Disponível! +{dailyBonusData.nextBonusAmount} UTI Coins
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Próximo em {dailyBonusData.secondsUntilNextClaim > 0 
                    ? formatSecondsToTime(dailyBonusData.secondsUntilNextClaim)
                    : formatTimeUntilReset(dailyBonusData.nextReset)
                  }
                </span>
              </>
            )}
          </div>
          {!dailyBonusData.canClaim && (
            <span className="text-xs text-gray-500">
              Próximo bônus: +{dailyBonusData.nextBonusAmount} UTI Coins
            </span>
          )}
        </div>
        
        {dailyBonusData.canClaim && (
          <motion.button
            onClick={claimDailyBonus}
            disabled={claiming}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {claiming ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <Gift className="w-3 h-3" />
            )}
            {claiming ? 'Resgatando...' : 'Resgatar'}
          </motion.button>
        )}
      </div>
    </div>
  );
};