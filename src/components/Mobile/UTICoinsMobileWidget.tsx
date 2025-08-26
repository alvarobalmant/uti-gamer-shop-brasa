import React, { useState } from 'react';
import { Coins, X, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UTICoinsMobileWidgetProps {
  onClick?: () => void;
  className?: string;
}

export const UTICoinsMobileWidget = ({ onClick, className }: UTICoinsMobileWidgetProps) => {
  const { coins, loading } = useUTICoins();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Só renderiza no mobile e se o usuário estiver logado
  if (!isMobile || !user) return null;

  const formatCoins = (amount: number | undefined) => {
    if (!amount) return '0';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString('pt-BR');
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNavigateToCoins = () => {
    setIsExpanded(false);
    navigate('/coins');
  };

  return (
    <>
      {/* Componente Sticky */}
      <div className="fixed top-20 right-4 z-40 lg:hidden">
        {/* Modal expandido */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                onClick={() => setIsExpanded(false)}
              />
              
              {/* Painel expandido */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                className="absolute top-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 max-w-[calc(100vw-2rem)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-800">UTI Coins</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Saldo */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Seu saldo</p>
                      <p className="text-2xl font-bold">{loading ? '...' : (coins?.toLocaleString() || '0')}</p>
                    </div>
                    <Coins className="w-8 h-8 text-yellow-200" />
                  </div>
                </div>

                {/* Ação */}
                <button
                  onClick={handleNavigateToCoins}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Ver Tudo & Recompensas
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Widget principal sticky */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105",
            className
          )}
        >
          <Coins className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold">
            {loading ? '...' : formatCoins(typeof coins === 'number' ? coins : 0)}
          </span>
        </motion.button>
      </div>
    </>
  );
};

