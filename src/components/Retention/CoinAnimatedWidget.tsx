import React, { useState, useEffect, useRef } from 'react';
import { Coins, TrendingUp, Gift, Star } from 'lucide-react';
import { useUTICoins } from '@/hooks/useUTICoins';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface UTICoinsWidgetProps {
  className?: string;
}

interface CoinAnimation {
  id: string;
  amount: number;
}

export const CoinAnimatedWidget: React.FC<UTICoinsWidgetProps> = ({ className = '' }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [coinAnimations, setCoinAnimations] = useState<CoinAnimation[]>([]);
  const { user } = useAuth();
  const { coins, transactions, loading, processDailyLogin } = useUTICoins();
  const previousBalance = useRef(coins.balance);

  // Detectar mudança no saldo para animar moedas
  useEffect(() => {
    if (previousBalance.current !== undefined && coins.balance > previousBalance.current) {
      const diff = coins.balance - previousBalance.current;
      const animationId = Date.now().toString();
      
      setCoinAnimations(prev => [...prev, { id: animationId, amount: diff }]);
      
      // Remover animação após completar
      setTimeout(() => {
        setCoinAnimations(prev => prev.filter(anim => anim.id !== animationId));
      }, 1500);
    }
    previousBalance.current = coins.balance;
  }, [coins.balance]);

  // Processar login diário ao montar o componente
  useEffect(() => {
    if (user) {
      processDailyLogin();
    }
  }, [user, processDailyLogin]);
  
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
  
  const recentTransactions = transactions.slice(0, 3).map(t => ({
    action: t.description,
    amount: t.type === 'earned' ? t.amount : -t.amount,
    date: new Date(t.createdAt).toLocaleDateString('pt-BR'),
    type: t.type
  }));

  if (loading) {
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
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowPopover(!showPopover)}
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

      {showPopover && (
        <>
          {/* Overlay para fechar */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPopover(false)}
          />
          
          {/* Popover */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
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
              
              {levelData.nextThreshold === 0 && (
                <div className="mt-3 text-center">
                  <span className="text-xs opacity-90">🏆 Nível Máximo Atingido! 🏆</span>
                </div>
              )}
            </div>

            {/* Ganhos recentes */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Transações Recentes
              </h4>
              
              <div className="space-y-2">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{transaction.action}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{transaction.type === 'earned' ? '+' : '-'}{Math.abs(transaction.amount)}</span>
                        <Coins className="w-3 h-3" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Nenhuma transação ainda
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">{coins.totalEarned}</div>
                  <div className="text-xs text-green-600">Total Ganho</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600">{coins.totalSpent}</div>
                  <div className="text-xs text-red-600">Total Gasto</div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => {
                    setShowPopover(false);
                    window.location.href = '/coins/loja';
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Loja de Recompensas
                </button>
                
                <button 
                  onClick={() => {
                    setShowPopover(false);
                    window.location.href = '/coins/historico';
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Ver Histórico Completo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};