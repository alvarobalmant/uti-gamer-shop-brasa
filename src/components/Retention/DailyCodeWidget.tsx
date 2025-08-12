import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coins, TrendingUp, Gift, Star, Flame, Calendar, Clock, CheckCircle, Hash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { UTICoinsConditional } from './UTICoinsConditional';

interface UTICoinsWidgetProps {
  className?: string;
}

interface CoinAnimation {
  id: string;
  amount: number;
}

// Componente de Streak Animado para o novo sistema
const StreakDisplay: React.FC<{ streak: number; animated?: boolean }> = ({ streak, animated = false }) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (animated && streak >= 3) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);
    }
  }, [animated, streak]);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return { bg: 'bg-purple-100', text: 'text-purple-700', flame: 'text-purple-500' };
    if (streak >= 14) return { bg: 'bg-red-100', text: 'text-red-700', flame: 'text-red-500' };
    if (streak >= 7) return { bg: 'bg-orange-100', text: 'text-orange-700', flame: 'text-orange-500' };
    if (streak >= 3) return { bg: 'bg-yellow-100', text: 'text-yellow-700', flame: 'text-yellow-500' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', flame: 'text-gray-500' };
  };

  const colors = getStreakColor(streak);

  return (
    <motion.div 
      className={`relative flex items-center gap-2 ${colors.bg} px-3 py-2 rounded-full border-2 border-transparent`}
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={animated ? { 
        scale: [0.8, 1.1, 1], 
        opacity: 1,
        borderColor: streak >= 7 ? ['transparent', '#f97316', 'transparent'] : 'transparent'
      } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Efeito de fogos de artifício */}
      <AnimatePresence>
        {showFireworks && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 1 
                }}
                animate={{ 
                  x: Math.cos(i * 60 * Math.PI / 180) * 30,
                  y: Math.sin(i * 60 * Math.PI / 180) * 30,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Ícone de chama animado */}
      <motion.div
        animate={animated ? { 
          rotate: [0, -15, 15, -10, 10, 0],
          scale: [1, 1.3, 1.1, 1.2, 1]
        } : streak >= 7 ? {
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ 
          duration: animated ? 1 : 2,
          ease: "easeInOut",
          repeat: streak >= 7 && !animated ? Infinity : 0,
          repeatDelay: 3
        }}
      >
        <Flame className={`w-5 h-5 ${colors.flame} drop-shadow-sm`} />
      </motion.div>

      {/* Número do streak */}
      <motion.span 
        className={`font-bold ${colors.text}`}
        initial={animated ? { y: 10, opacity: 0 } : {}}
        animate={animated ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {streak} dia{streak !== 1 ? 's' : ''}
      </motion.span>

      {/* Badges especiais */}
      <AnimatePresence>
        {streak >= 30 && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-bold"
          >
            👑 Lenda!
          </motion.span>
        )}
        {streak >= 14 && streak < 30 && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold"
          >
            🔥 Insano!
          </motion.span>
        )}
        {streak >= 7 && streak < 14 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full"
          >
            🔥 Em chamas!
          </motion.span>
        )}
        {streak >= 3 && streak < 7 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full"
          >
            ⚡ Aquecendo!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const DailyCodeWidget: React.FC<UTICoinsWidgetProps> = ({ className = '' }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [coinAnimations, setCoinAnimations] = useState<CoinAnimation[]>([]);
  const [streakAnimated, setStreakAnimated] = useState(false);
  
  const { user } = useAuth();
  const { coins, loading: coinsLoading, refreshData } = useUTICoins();
  
  // Novo sistema unificado - usar apenas secure-coin-actions
  const [bonusStatus, setBonusStatus] = useState({
    canClaim: false,
    currentStreak: 0,
    nextBonusAmount: 30,
    secondsUntilNextClaim: 0,
    hasClaimedToday: false,
    loading: true
  });
  
  const previousBalance = useRef(coins.balance);
  const widgetRef = useRef<HTMLButtonElement>(null);

  // Função para abrir modal e calcular posição
  const openModal = () => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      
      setModalPosition({
        top: rect.bottom + 8,
        left: rect.left + (rect.width / 2) - 200
      });
    }
    setShowPopover(true);
  };

  // Função para fechar modal com animação
  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowPopover(false);
      setIsExiting(false);
    }, 300);
  };

  // Detectar mudança no saldo para animar moedas
  useEffect(() => {
    if (previousBalance.current !== undefined && coins.balance > previousBalance.current) {
      const diff = coins.balance - previousBalance.current;
      const animationId = Date.now().toString();
      
      setCoinAnimations(prev => [...prev, { id: animationId, amount: diff }]);
      
      setTimeout(() => {
        setCoinAnimations(prev => prev.filter(anim => anim.id !== animationId));
      }, 1500);
    }
    previousBalance.current = coins.balance;
  }, [coins.balance]);

  // Carregar status do bônus do backend unificado
  const loadBonusStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('[DAILY_BONUS] Loading bonus status...');
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'can_claim_daily_bonus_brasilia' }
      });
      
      if (!error && data?.success) {
        console.log('[DAILY_BONUS] Backend response:', data);
        setBonusStatus({
          canClaim: data.canClaim || false,
          currentStreak: data.currentStreak || 0,
          nextBonusAmount: data.nextBonusAmount || 30,
          secondsUntilNextClaim: data.secondsUntilNextClaim || 0,
          hasClaimedToday: data.hasClaimedToday || false,
          loading: false
        });
      }
    } catch (error) {
      console.error('[DAILY_BONUS] Error loading bonus status:', error);
      setBonusStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Timer para atualizar contador
  useEffect(() => {
    if (bonusStatus.secondsUntilNextClaim <= 0) return;

    const interval = setInterval(() => {
      setBonusStatus(prev => {
        const newSeconds = Math.max(0, prev.secondsUntilNextClaim - 1);
        
        // Se chegou a zero, recarregar status
        if (newSeconds === 0) {
          loadBonusStatus();
        }
        
        return {
          ...prev,
          secondsUntilNextClaim: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bonusStatus.secondsUntilNextClaim, loadBonusStatus]);

  // Carregar status inicial
  useEffect(() => {
    loadBonusStatus();
  }, [loadBonusStatus]);

  // Bloquear scroll quando modal estiver aberto
  useEffect(() => {
    if (showPopover) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      
      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
        window.scrollTo(0, scrollY);
      };
    }
  }, [showPopover]);

  // Função para resgatar bônus diário
  const handleClaimBonus = async () => {
    if (!bonusStatus.canClaim) {
      console.error('[DAILY_BONUS] Cannot claim bonus right now');
      return;
    }

    try {
      console.log('[DAILY_BONUS] Claiming daily bonus...');
      setBonusStatus(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'daily_login' }
      });
      
      if (!error && data?.success) {
        console.log('[DAILY_BONUS] Bonus claimed successfully:', data);
        
        // Animar streak se houve mudança
        if (data.streak_day) {
          setStreakAnimated(true);
          setTimeout(() => setStreakAnimated(false), 1000);
        }
        
        // Atualizar dados das moedas e recarregar status
        refreshData?.();
        loadBonusStatus();
      } else {
        console.error('[DAILY_BONUS] Error claiming bonus:', error || data);
      }
    } catch (error) {
      console.error('[DAILY_BONUS] Error claiming bonus:', error);
    } finally {
      setBonusStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Calcular tempo formatado
  const formatTimeUntilNext = () => {
    const totalSeconds = bonusStatus.secondsUntilNextClaim;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Calcular nível baseado no total de moedas ganhas
  const calculateLevel = (totalEarned: number) => {
    if (totalEarned < 100) return { 
      level: 1, 
      name: "Bronze", 
      color: "#CD7F32", 
      progress: totalEarned, 
      nextThreshold: 100,
      nextLevelName: "Silver"
    };
    if (totalEarned < 500) return { 
      level: 2,
      name: "Silver", 
      color: "#C0C0C0", 
      progress: totalEarned - 100, 
      nextThreshold: 400,
      nextLevelName: "Gold"
    };
    if (totalEarned < 1500) return { 
      level: 3,
      name: "Gold", 
      color: "#FFD700", 
      progress: totalEarned - 500, 
      nextThreshold: 1000,
      nextLevelName: "Platinum"
    };
    if (totalEarned < 3000) return { 
      level: 4,
      name: "Platinum", 
      color: "#E5E4E2", 
      progress: totalEarned - 1500, 
      nextThreshold: 1500,
      nextLevelName: "Diamond"
    };
    return { 
      level: 5,
      name: "Diamond", 
      color: "#B9F2FF", 
      progress: 100, 
      nextThreshold: 0,
      nextLevelName: "Max"
    };
  };

  const levelData = calculateLevel(coins.totalEarned);
  const progressPercentage = levelData.nextThreshold > 0 ? (levelData.progress / levelData.nextThreshold) * 100 : 100;

  if (coinsLoading || bonusStatus.loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg opacity-50">
          <Coins className="w-4 h-4 animate-spin" />
          <span className="font-semibold">...</span>
          <span className="text-xs opacity-90">UTI Coins</span>
        </div>
      </div>
    );
  }

  return (
    <UTICoinsConditional>
      <div className={`relative ${className}`}>
        <button
          ref={widgetRef}
          onClick={openModal}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden"
        >
          <Coins className="w-4 h-4" />
          <div className="relative">
            <motion.span 
              key={coins.balance}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-semibold"
            >
              {coins.balance.toLocaleString()}
            </motion.span>
            
            {/* Animações de moedas caindo */}
            <AnimatePresence>
              {coinAnimations.map((animation) => (
                <motion.div
                  key={animation.id}
                  initial={{ y: -20, x: 0, opacity: 1, scale: 1 }}
                  animate={{ y: 30, x: Math.random() * 20 - 10, opacity: 0, scale: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
                >
                  <div className="flex items-center gap-1 text-yellow-200 font-bold text-sm">
                    <Coins className="w-3 h-3" />
                    +{animation.amount}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <span className="text-xs opacity-90">UTI Coins</span>
        </button>

        {/* Modal Portal */}
        {createPortal(
          <AnimatePresence>
            {showPopover && (
              <motion.div
                key="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExiting ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
                onClick={closeModal}
              >
                <motion.div
                  key="modal-content"
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ 
                    opacity: isExiting ? 0 : 1, 
                    scale: isExiting ? 0.8 : 1, 
                    y: isExiting ? -20 : 0 
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeInOut"
                  }}
                  className="fixed bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto z-[10000]"
                  style={{
                    top: `${Math.max(8, Math.min(modalPosition.top, window.innerHeight - 400))}px`,
                    left: `${Math.max(16, Math.min(modalPosition.left, window.innerWidth - 400 - 16))}px`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{coins.balance.toLocaleString()} UTI Coins</h3>
                        <p className="text-sm opacity-90">Nível {levelData.level} - {levelData.name}</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-200" />
                    </div>
                    
                    {/* Barra de progresso */}
                    {levelData.nextThreshold > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Próximo nível: {levelData.nextLevelName}</span>
                          <span>{levelData.nextThreshold - levelData.progress} coins restantes</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Streak Display */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-gray-700">Streak de Login</span>
                      </div>
                      <StreakDisplay 
                        streak={bonusStatus.currentStreak} 
                        animated={streakAnimated} 
                      />
                    </div>

                    {/* Próxima Recompensa */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold text-gray-700">
                            {bonusStatus.hasClaimedToday ? 'Próxima Recompensa' : 'Recompensa Atual'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-orange-200">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-orange-600">+{bonusStatus.nextBonusAmount}</span>
                        </div>
                      </div>
                      
                      {bonusStatus.canClaim && !bonusStatus.hasClaimedToday ? (
                        <Button 
                          onClick={handleClaimBonus}
                          disabled={bonusStatus.loading}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {bonusStatus.loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Resgatando...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Resgatar Agora
                            </div>
                          )}
                        </Button>
                      ) : (
                        <div className="text-center">
                          {bonusStatus.hasClaimedToday || bonusStatus.secondsUntilNextClaim > 0 ? (
                            <div>
                              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">
                                  {bonusStatus.hasClaimedToday ? 'Resgatado hoje!' : 'Aguarde o próximo resgate'}
                                </span>
                              </div>
                              {bonusStatus.secondsUntilNextClaim > 0 && (
                                <div className="text-sm text-gray-600">
                                  Próximo resgate em: <span className="font-mono font-semibold">{formatTimeUntilNext()}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-orange-600">
                              <Clock className="w-5 h-5 mx-auto mb-2" />
                              <p className="text-sm">Aguardando código do dia...</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-green-700">{coins.totalEarned.toLocaleString()}</div>
                        <div className="text-xs text-green-600">Total Ganho</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-blue-700">{bonusStatus.currentStreak}</div>
                        <div className="text-xs text-blue-600">Streak Atual</div>
                      </div>
                    </div>

                    {/* Dicas */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-semibold text-gray-700 mb-2">💡 Dicas:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Faça login todos os dias para manter sua streak</li>
                        <li>• Quanto maior a streak, mais UTI Coins você ganha</li>
                        <li>• Use UTI Coins para resgatar produtos exclusivos</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </UTICoinsConditional>
  );
};