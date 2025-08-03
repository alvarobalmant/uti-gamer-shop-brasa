import React, { useState, useEffect } from 'react';
import { Calendar, Flame, CheckCircle, Clock, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DailyBonusData {
  canClaim: boolean;
  streak: number;
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

  // Carregar dados do daily bonus
  useEffect(() => {
    const loadDailyBonusData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
          body: { action: 'can_claim_daily_bonus_brasilia' }
        });

        if (error) throw error;

        if (data?.success) {
          setDailyBonusData({
            canClaim: data.can_claim,
            streak: data.streak || 1,
            multiplier: data.multiplier || 1.0,
            nextReset: data.next_reset,
            lastClaim: data.last_claim
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do daily bonus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyBonusData();
  }, [user]);

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
        // Atualizar dados locais
        setDailyBonusData(prev => prev ? {
          ...prev,
          canClaim: false,
          streak: data.streak,
          multiplier: data.multiplier,
          lastClaim: new Date().toISOString()
        } : null);
        
        // Callback para atualizar dados do parent
        onBonusClaimed?.();
      }
    } catch (error) {
      console.error('Erro ao resgatar daily bonus:', error);
    } finally {
      setClaiming(false);
    }
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

  if (!dailyBonusData) {
    return null;
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
            <span className="font-medium">{dailyBonusData.streak}</span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{dailyBonusData.multiplier.toFixed(1)}x</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {dailyBonusData.canClaim ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">Disponível!</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Próximo em {formatTimeUntilReset(dailyBonusData.nextReset)}
              </span>
            </>
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