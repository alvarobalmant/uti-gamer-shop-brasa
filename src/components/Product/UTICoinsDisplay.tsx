import React from 'react';
import { Coins, Gift } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { useUTICoins } from '@/hooks/useUTICoins';
import { useAuth } from '@/hooks/useAuth';
import { calculatePurchaseSummary, formatUTICoins, utiCoinsToReais } from '@/utils/utiCoinsCalculations';
import { formatPrice } from '@/utils/formatPrice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UTICoinsPricingProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

const UTICoinsDisplay: React.FC<UTICoinsPricingProps> = ({ 
  product, 
  className,
  compact = false 
}) => {
  const { user } = useAuth();
  const { balance } = useUTICoins();

  // Verificar se o produto tem configuração de UTI Coins
  const hasUTICoinsDiscount = product.uti_coins_discount_percentage && product.uti_coins_discount_percentage > 0;
  const hasUTICoinsCashback = product.uti_coins_cashback_percentage && product.uti_coins_cashback_percentage > 0;

  if (!hasUTICoinsDiscount && !hasUTICoinsCashback) {
    return null;
  }

  const summary = calculatePurchaseSummary(
    product.price,
    product.uti_coins_discount_percentage || 0,
    product.uti_coins_cashback_percentage || 0,
    balance || 0
  );

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Preço com UTI Coins */}
        {hasUTICoinsDiscount && user && summary.hasDiscount && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Com UTI Coins</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-800">
                  {formatPrice(summary.finalPrice)}
                </div>
                <div className="text-xs text-yellow-600">
                  +{summary.utiCoinsUsed.toLocaleString()} 🪙
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cashback */}
        {hasUTICoinsCashback && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Gift className="w-4 h-4" />
            <span>Cashback: +{summary.cashbackCoins.toLocaleString()} 🪙</span>
          </div>
        )}

        {/* CTA para não logados */}
        {!user && (hasUTICoinsDiscount || hasUTICoinsCashback) && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-sm text-purple-700 mb-2">
              💰 Preços especiais com UTI Coins
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              Fazer Login
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Seção principal UTI Coins */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Coins className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-bold text-yellow-800">UTI Coins</h3>
          <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
            1 🪙 = R$ 0,01
          </span>
        </div>

        {user ? (
          <div className="space-y-3">
            {/* Saldo atual */}
            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Seu saldo atual:</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="font-bold text-yellow-700">
                    {(balance || 0).toLocaleString()} 🪙
                  </span>
                  <span className="text-sm text-gray-500">
                    (R$ {utiCoinsToReais(balance || 0).toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* Preço com desconto UTI Coins */}
            {hasUTICoinsDiscount && (
              <div className="bg-white rounded-lg p-3 border border-yellow-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preço original:</span>
                    <span className="font-medium">{formatPrice(summary.originalPrice)}</span>
                  </div>
                  
                  {summary.hasDiscount && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-600">UTI Coins usadas:</span>
                        <span className="text-yellow-700">
                          -{summary.utiCoinsUsed.toLocaleString()} 🪙 ({formatPrice(summary.discountApplied)})
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between font-bold border-t pt-2">
                        <span className="text-green-600">Valor a pagar:</span>
                        <span className="text-xl text-green-600">{formatPrice(summary.finalPrice)}</span>
                      </div>
                      
                      <div className="text-xs text-green-600">
                        ✅ Você economiza {formatPrice(summary.discountApplied)}
                      </div>
                    </>
                  )}

                  {!summary.hasDiscount && balance === 0 && (
                    <div className="text-sm text-gray-500 italic">
                      Você precisa de UTI Coins para usar este desconto
                    </div>
                  )}

                  {!summary.canApplyFullDiscount && summary.hasDiscount && (
                    <div className="text-xs text-orange-600">
                      💡 Com mais {(summary.maxDiscountUTICoins - (balance || 0)).toLocaleString()} 🪙 você economizaria {formatPrice(summary.maxDiscountReais)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cashback */}
            {hasUTICoinsCashback && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Cashback desta compra</span>
                </div>
                <div className="text-lg font-bold text-green-700">
                  +{summary.cashbackCoins.toLocaleString()} 🪙
                </div>
                <div className="text-sm text-green-600">
                  = R$ {summary.cashbackReais.toFixed(2)} para próximas compras
                </div>
              </div>
            )}

            {/* Novo saldo após compra */}
            {(hasUTICoinsDiscount || hasUTICoinsCashback) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Saldo após compra:</span>
                  <span className="font-bold text-blue-700">
                    {summary.newBalance.toLocaleString()} 🪙
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  = R$ {utiCoinsToReais(summary.newBalance).toFixed(2)} disponível
                </div>
              </div>
            )}
          </div>
        ) : (
          // Para usuários não logados
          <div className="text-center space-y-3">
            <div className="text-yellow-800">
              <div className="text-lg font-bold mb-1">
                🎯 Preços Especiais com UTI Coins
              </div>
              {hasUTICoinsDiscount && (
                <div className="text-sm">
                  💰 Até {product.uti_coins_discount_percentage}% de desconto
                </div>
              )}
              {hasUTICoinsCashback && (
                <div className="text-sm">
                  🎁 {product.uti_coins_cashback_percentage}% de cashback
                </div>
              )}
            </div>
            
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              Fazer Login para Ver Preços
            </Button>
            
            <div className="text-xs text-yellow-600">
              Sistema de fidelidade gratuito • Acumule coins em cada compra
            </div>
          </div>
        )}
      </div>

      {/* Como funciona */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 Como funciona</h4>
        <div className="space-y-1 text-sm text-blue-700">
          <div>• 1 UTI Coin = R$ 0,01 (1 centavo)</div>
          <div>• Use como desconto em qualquer produto</div>
          <div>• Ganhe cashback a cada compra</div>
          <div>• Sem prazo de validade</div>
        </div>
      </div>
    </div>
  );
};

export default UTICoinsDisplay;