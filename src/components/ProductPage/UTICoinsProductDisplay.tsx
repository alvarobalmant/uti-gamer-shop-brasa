import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Coins, Gift, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { useUTICoinsProduct } from '@/hooks/useUTICoinsProduct';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';

interface UTICoinsProductDisplayProps {
  product: Product;
  quantity?: number;
  className?: string;
}

const UTICoinsProductDisplay: React.FC<UTICoinsProductDisplayProps> = ({
  product,
  quantity = 1,
  className
}) => {
  const { user } = useAuth();
  const { balance } = useUTICoins();
  const utiCoinsProduct = useUTICoinsProduct(product);

  // Se não está habilitado para UTI Coins, não mostrar nada
  if (!utiCoinsProduct.isEnabled) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Cashback que vai ganhar */}
      {utiCoinsProduct.estimatedCashback > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-yellow-800">Ganhe UTI Coins</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-700">Cashback nesta compra:</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-yellow-700">
                  {(utiCoinsProduct.estimatedCashback * quantity).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-xs text-yellow-600">
              💰 Equivale a {formatPrice((utiCoinsProduct.estimatedCashback * quantity) * 0.01)} para próximas compras
            </div>
          </div>
        </div>
      )}

      {/* Opção de usar coins para desconto (somente se logado e tiver saldo) */}
      {user && utiCoinsProduct.canUseCoins && balance > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-blue-800">Use seus UTI Coins</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Seu saldo:</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-700">
                  {balance.toLocaleString()}
                </span>
              </div>
            </div>
            
            {utiCoinsProduct.maxCoinsForDiscount > 0 && (
              <div className="text-xs text-blue-600">
                💸 Você pode usar até {utiCoinsProduct.maxCoinsForDiscount.toLocaleString()} coins
                <br />
                💰 Máximo de desconto: {formatPrice((utiCoinsProduct.maxCoinsForDiscount * utiCoinsProduct.rate))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convite para fazer login se não estiver logado */}
      {!user && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800">Faça login para mais benefícios!</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div>• Ganhe UTI Coins em suas compras</div>
            <div>• Use coins para obter descontos</div>
            <div>• Acumule pontos e troque por produtos</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UTICoinsProductDisplay;