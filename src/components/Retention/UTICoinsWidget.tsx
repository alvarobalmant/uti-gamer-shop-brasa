import React, { useState } from 'react';
import { Coins, TrendingUp, Gift, Star } from 'lucide-react';

interface UTICoinsWidgetProps {
  className?: string;
}

export const UTICoinsWidget: React.FC<UTICoinsWidgetProps> = ({ className = '' }) => {
  const [showPopover, setShowPopover] = useState(false);
  
  // Dados mock para demonstração
  const mockData = {
    balance: 1250,
    level: 3,
    levelName: "Gamer Experiente",
    nextLevelCoins: 500,
    recentEarnings: [
      { action: "Compra realizada", coins: 50, date: "Hoje" },
      { action: "Login diário", coins: 10, date: "Hoje" },
      { action: "Avaliação de produto", coins: 25, date: "Ontem" }
    ]
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Coins className="w-4 h-4" />
        <span className="font-semibold">{mockData.balance.toLocaleString()}</span>
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
                  <h3 className="font-bold text-lg">{mockData.balance.toLocaleString()} UTI Coins</h3>
                  <p className="text-sm opacity-90">Nível {mockData.level} - {mockData.levelName}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-200" />
              </div>
              
              {/* Barra de progresso */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Próximo nível</span>
                  <span>{mockData.nextLevelCoins} coins restantes</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>

            {/* Ganhos recentes */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Ganhos Recentes
              </h4>
              
              <div className="space-y-2">
                {mockData.recentEarnings.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{earning.action}</p>
                      <p className="text-xs text-gray-500">{earning.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <span>+{earning.coins}</span>
                      <Coins className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de ação */}
              <div className="mt-4 space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Ver Recompensas
                </button>
                
                <button 
                  onClick={() => {
                    setShowPopover(false);
                    window.location.href = '/meus-coins';
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

