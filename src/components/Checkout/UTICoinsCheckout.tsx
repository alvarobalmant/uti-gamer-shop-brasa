import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Coins, Gift } from 'lucide-react';
import { useUTICoins as useUTICoinsContext } from '@/hooks/useUTICoins';
import { useAuth } from '@/hooks/useAuth';
import { 
  calculatePurchaseSummary, 
  formatUTICoins, 
  utiCoinsToReais 
} from '@/utils/utiCoinsCalculations';
import { formatPrice } from '@/utils/formatPrice';

interface UTICoinsCheckoutProps {
  cartItems: any[];
  cartTotal: number;
  onUTICoinsChange: (useUTICoins: boolean, summary: any) => void;
  className?: string;
}

const UTICoinsCheckout: React.FC<UTICoinsCheckoutProps> = ({
  cartItems,
  cartTotal,
  onUTICoinsChange,
  className
}) => {
  const { user } = useAuth();
  const { balance } = useUTICoinsContext();
  const [useUTICoins, setUseUTICoins] = useState(false);

  // Calcular desconto e cashback agregado
  const aggregatedSummary = React.useMemo(() => {
    if (!cartItems.length) return null;

    let totalDiscount = 0;
    let totalCashback = 0;
    let totalUTICoinsNeeded = 0;
    let allDiscountItems: any[] = [];
    let allCashbackItems: any[] = [];

    cartItems.forEach(item => {
      const product = item.product;
      const quantity = item.quantity || 1;
      const itemPrice = product.price * quantity;

      // Verificar desconto UTI Coins
      if (product.uti_coins_discount_percentage && product.uti_coins_discount_percentage > 0) {
        const itemSummary = calculatePurchaseSummary(
          itemPrice,
          product.uti_coins_discount_percentage,
          product.uti_coins_cashback_percentage || 0,
          useUTICoins ? balance || 0 : 0
        );

        if (useUTICoins && itemSummary.hasDiscount) {
          totalDiscount += itemSummary.discountApplied;
          totalUTICoinsNeeded += itemSummary.utiCoinsUsed;
          allDiscountItems.push({
            product: product.name,
            quantity,
            discount: itemSummary.discountApplied,
            coins: itemSummary.utiCoinsUsed
          });
        }
      }

      // Verificar cashback UTI Coins
      if (product.uti_coins_cashback_percentage && product.uti_coins_cashback_percentage > 0) {
        const discountApplied = useUTICoins && product.uti_coins_discount_percentage ? 
          Math.min((itemPrice * product.uti_coins_discount_percentage) / 100, utiCoinsToReais(balance || 0)) : 0;
        const finalItemPrice = itemPrice - discountApplied;
        const itemCashback = (finalItemPrice * product.uti_coins_cashback_percentage) / 100;
        const cashbackCoins = Math.floor(itemCashback * 100);
        
        totalCashback += cashbackCoins;
        allCashbackItems.push({
          product: product.name,
          quantity,
          cashback: cashbackCoins,
          percentage: product.uti_coins_cashback_percentage
        });
      }
    });

    return {
      originalTotal: cartTotal,
      discountApplied: totalDiscount,
      finalTotal: cartTotal - totalDiscount,
      utiCoinsUsed: totalUTICoinsNeeded,
      cashbackCoins: totalCashback,
      canApplyDiscount: (balance || 0) >= totalUTICoinsNeeded,
      hasDiscount: totalDiscount > 0,
      hasCashback: totalCashback > 0,
      discountItems: allDiscountItems,
      cashbackItems: allCashbackItems,
      newBalance: (balance || 0) - totalUTICoinsNeeded + totalCashback
    };
  }, [cartItems, cartTotal, balance, useUTICoins]);

  // Notificar mudanças
  useEffect(() => {
    if (aggregatedSummary) {
      onUTICoinsChange(useUTICoins, aggregatedSummary);
    }
  }, [useUTICoins, aggregatedSummary, onUTICoinsChange]);

  if (!user || !aggregatedSummary || (!aggregatedSummary.hasDiscount && !aggregatedSummary.hasCashback)) {
    return null;
  }

  const handleToggleUTICoins = (enabled: boolean) => {
    if (enabled && !aggregatedSummary.canApplyDiscount) {
      return; // Não permitir se não tiver saldo suficiente
    }
    setUseUTICoins(enabled);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-600" />
          UTI Coins
          <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            1 🪙 = R$ 0,01
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo atual */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Seu saldo atual:</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-700">
                {formatUTICoins(balance || 0)}
              </span>
              <span className="text-sm text-gray-500">
                (R$ {utiCoinsToReais(balance || 0).toFixed(2)})
              </span>
            </div>
          </div>
        </div>

        {/* Opção de usar desconto */}
        {aggregatedSummary.hasDiscount && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Usar UTI Coins como desconto</h4>
                <p className="text-sm text-gray-600">
                  Economize até {formatPrice(aggregatedSummary.discountApplied)} usando {aggregatedSummary.utiCoinsUsed.toLocaleString()} 🪙
                </p>
              </div>
              <Switch
                checked={useUTICoins}
                onCheckedChange={handleToggleUTICoins}
                disabled={!aggregatedSummary.canApplyDiscount}
              />
            </div>

            {!aggregatedSummary.canApplyDiscount && (
              <div className="text-sm text-red-600">
                ⚠️ Saldo insuficiente. Você precisa de {aggregatedSummary.utiCoinsUsed.toLocaleString()} 🪙
              </div>
            )}

            {useUTICoins && aggregatedSummary.hasDiscount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Subtotal:</span>
                    <span>{formatPrice(aggregatedSummary.originalTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Desconto UTI Coins:</span>
                    <span className="text-green-600">
                      -{formatPrice(aggregatedSummary.discountApplied)} ({aggregatedSummary.utiCoinsUsed.toLocaleString()} 🪙)
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span className="text-green-700">Total a pagar:</span>
                    <span className="text-xl text-green-600">
                      {formatPrice(aggregatedSummary.finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cashback */}
        {aggregatedSummary.hasCashback && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Cashback desta compra</span>
            </div>
            <div className="text-lg font-bold text-blue-700">
              +{aggregatedSummary.cashbackCoins.toLocaleString()} 🪙
            </div>
            <div className="text-sm text-blue-600">
              = R$ {utiCoinsToReais(aggregatedSummary.cashbackCoins).toFixed(2)} para próximas compras
            </div>
          </div>
        )}

        {/* Saldo após compra */}
        {(useUTICoins || aggregatedSummary.hasCashback) && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Saldo após compra:</span>
              <span className="font-bold text-gray-700">
                {aggregatedSummary.newBalance.toLocaleString()} 🪙
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              = R$ {utiCoinsToReais(aggregatedSummary.newBalance).toFixed(2)} disponível
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UTICoinsCheckout;