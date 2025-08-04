import React, { useState, useEffect } from 'react';
import { 
  Coins as CoinsIcon, 
  TrendingUp, 
  Gift, 
  Star, 
  Calendar, 
  Trophy, 
  Target, 
  Flame,
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import DailyBonusTest from '@/components/Admin/DailyBonusTest';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useUTICoins } from '@/hooks/useUTICoins';
import { Navigate } from 'react-router-dom';
import { useUTICoinsRouteProtection } from '@/hooks/useUTICoinsRouteProtection';
import { supabase } from '@/integrations/supabase/client';
import { AdminTestModeControl } from '@/components/Admin/AdminTestModeControl';

interface DailyBonusData {
  canClaim: boolean;
  currentStreak: number;
  nextBonusAmount: number;
  secondsUntilNextClaim: number;
  multiplier: number;
  nextReset: string;
  lastClaim?: string;
  testMode?: boolean;
}

const Coins: React.FC = () => {
  const { user } = useAuth();
  const { isEnabled, loading: routeLoading } = useUTICoinsRouteProtection();
  const { coins, transactions, loading, earnCoins, refreshData } = useUTICoins();
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'history' | 'rewards'>('overview');
  const [dailyBonusData, setDailyBonusData] = useState<DailyBonusData | null>(null);
  const [claimingBonus, setClaimingBonus] = useState(false);
  const [bonusLoading, setBonusLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do daily bonus
  const loadDailyBonusData = async () => {
    if (!user) {
      setBonusLoading(false);
      return;
    }
    
    try {
      setBonusLoading(true);
      setError(null);
      console.log('[COINS] Loading daily bonus data for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'can_claim_daily_bonus_brasilia' }
      });

      if (error) {
        console.error('[COINS] Error loading daily bonus data:', error);
        setError('Failed to load daily bonus data');
        return;
      }

      if (data?.success) {
        console.log('[COINS] Daily bonus data loaded:', data);
        setDailyBonusData({
          canClaim: data.canClaim,
          currentStreak: data.currentStreak || 1,
          nextBonusAmount: data.nextBonusAmount || 10,
          secondsUntilNextClaim: data.secondsUntilNextClaim || 0,
          multiplier: data.multiplier || 1.0,
          nextReset: data.nextReset,
          lastClaim: data.lastClaim,
          testMode: data.testMode || false
        });
      } else {
        console.warn('[COINS] Daily bonus data load failed:', data?.message);
        setError(data?.message || 'Failed to load daily bonus data');
      }
    } catch (error) {
      console.error('[COINS] Exception loading daily bonus data:', error);
      setError('Network error occurred');
    } finally {
      setBonusLoading(false);
    }
  };

  useEffect(() => {
    loadDailyBonusData();
  }, [user]);

  // Early returns AFTER all hooks are defined
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (routeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  // Função para resgatar daily bonus
  const claimDailyBonus = async () => {
    if (!dailyBonusData?.canClaim || claimingBonus) return;
    
    try {
      setClaimingBonus(true);
      console.log('[COINS] Claiming daily bonus for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('secure-coin-actions', {
        body: { action: 'process_daily_login_brasilia' }
      });

      if (error) {
        console.error('[COINS] Error claiming daily bonus:', error);
        return;
      }

      if (data?.success) {
        console.log('[COINS] Daily bonus claimed:', data);
        // Atualizar dados locais
        setDailyBonusData(prev => prev ? {
          ...prev,
          canClaim: false,
          currentStreak: data.streak || prev.currentStreak,
          multiplier: data.multiplier || prev.multiplier,
          lastClaim: new Date().toISOString()
        } : null);
        
        // Refresh dos dados de coins
        await refreshData();
        // Recarregar dados do bonus após o claim
        await loadDailyBonusData();
      } else {
        console.warn('[COINS] Daily bonus claim failed:', data?.message);
      }
    } catch (error) {
      console.error('[COINS] Exception claiming daily bonus:', error);
    } finally {
      setClaimingBonus(false);
    }
  };

  const formatDate = (dateStr: string, timeStr?: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return timeStr ? `Hoje às ${timeStr}` : 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return timeStr ? `Ontem às ${timeStr}` : 'Ontem';
    } else {
      return timeStr ? `${date.toLocaleDateString('pt-BR')} às ${timeStr}` : date.toLocaleDateString('pt-BR');
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

  // Mock data para recompensas
  const availableRewards = [
    { id: 1, title: 'Desconto de 5%', cost: 100, description: 'Desconto em qualquer compra' },
    { id: 2, title: 'Desconto de 10%', cost: 250, description: 'Desconto em compras acima de R$ 100' },
    { id: 3, title: 'Frete Grátis', cost: 150, description: 'Frete grátis na próxima compra' },
    { id: 4, title: 'Desconto de 15%', cost: 500, description: 'Desconto em compras acima de R$ 200' },
  ];

  const formattedTransactions = transactions.map(t => ({
    id: t.id,
    type: t.type,
    action: t.description,
    amount: t.amount,
    date: new Date(t.createdAt).toLocaleDateString('pt-BR'),
    time: new Date(t.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader onCartOpen={() => {}} onAuthOpen={() => {}} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header da página */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 md:p-8 text-white mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Meus UTI Coins</h1>
              <p className="text-base md:text-lg opacity-90">Nível {levelData.level} - {levelData.name}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm opacity-90">Saldo atual</p>
              <p className="text-3xl md:text-4xl font-bold">{coins.balance.toLocaleString()}</p>
            </div>
          </div>

          {/* Barra de progresso para próximo nível */}
          {levelData.nextThreshold > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso para {levelData.nextLevelName}</span>
                <span>{levelData.nextThreshold - levelData.progress} coins restantes</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          {levelData.nextThreshold === 0 && (
            <div className="mt-6 text-center">
              <span className="text-sm opacity-90">🏆 Nível Máximo Atingido! 🏆</span>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ganho</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{coins.totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usado</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{coins.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nível Atual</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{levelData.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Test Mode Control */}
        <div className="mb-6">
          <AdminTestModeControl />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'daily'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Bônus Diário
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Histórico
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-4 md:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'rewards'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Recompensas
              </button>
            </nav>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Daily Bonus Card */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Bônus Diário
                    </h3>
                    <button
                      onClick={() => setActiveTab('daily')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                  
                  {bonusLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : dailyBonusData ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">{dailyBonusData.currentStreak} dias seguidos</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Multiplicador: {dailyBonusData.multiplier.toFixed(1)}x
                        </div>
                      </div>
                      {dailyBonusData.canClaim ? (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Disponível!
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Próximo em {formatTimeUntilReset(dailyBonusData.nextReset)}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Transações recentes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
                  <div className="space-y-3">
                    {formattedTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <Gift className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{transaction.action}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.date, transaction.time)}</p>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                    
                    {formattedTransactions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhuma transação ainda
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  Bônus Diário
                </h3>
                
                {bonusLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : dailyBonusData ? (
                  <div className="space-y-6">
                    {/* Status do bônus */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <div className="text-center mb-6">
                        <div className="text-3xl mb-2">
                          {dailyBonusData.canClaim ? '🎁' : '⏰'}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {dailyBonusData.canClaim ? 'Bônus Disponível!' : 'Volte Amanhã'}
                        </h4>
                        <p className="text-gray-600">
                          {dailyBonusData.canClaim 
                            ? 'Resgate seu bônus diário agora!' 
                            : `Próximo bônus em ${formatTimeUntilReset(dailyBonusData.nextReset)}`
                          }
                        </p>
                      </div>
                      
                      {dailyBonusData.canClaim && (
                        <div className="text-center">
                          <motion.button
                            onClick={claimDailyBonus}
                            disabled={claimingBonus}
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {claimingBonus ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Resgatando...
                              </div>
                            ) : (
                              `Resgatar Bônus`
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Streak info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Sua Sequência
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-500 mb-1">
                            {dailyBonusData.currentStreak}
                          </div>
                          <div className="text-sm text-gray-600">Dias Seguidos</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-500 mb-1">
                            {dailyBonusData.multiplier.toFixed(1)}x
                          </div>
                          <div className="text-sm text-gray-600">Multiplicador Atual</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h5 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Como Funciona
                        </h5>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>• Faça login todos os dias entre 20h e 20h para manter sua sequência</p>
                          <p>• A cada dia seguido, ganhe mais moedas (progressão linear de 10 a 30 coins)</p>
                          <p>• Se perder um dia, sua sequência volta ao dia 1</p>
                          <p>• Máximo de 7 dias de sequência</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Erro ao carregar dados do bônus diário</p>
                  </div>
                )}
                
                {/* Componente de teste - remover em produção */}
                <div className="border-t pt-8 mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Painel de Teste (Admin)</h3>
                  <DailyBonusTest />
                </div>
               </div>
             )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico Completo</h3>
                <div className="space-y-3">
                  {formattedTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <Gift className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.action}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date, transaction.time)}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earned' ? '+' : ''}{transaction.amount} coins
                      </div>
                    </div>
                  ))}
                  
                  {formattedTransactions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      Nenhuma transação encontrada
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recompensas Disponíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{reward.title}</h4>
                        <div className="flex items-center gap-1 text-orange-600 font-semibold">
                          <CoinsIcon className="w-4 h-4" />
                          <span>{reward.cost}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                      <button 
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          coins.balance >= reward.cost
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={coins.balance < reward.cost}
                      >
                        {coins.balance >= reward.cost ? 'Resgatar' : 'Coins Insuficientes'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Coins;