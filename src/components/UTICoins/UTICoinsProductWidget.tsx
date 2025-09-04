import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { useUTICoinsProduct } from '@/hooks/useUTICoinsProduct';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { formatPrice } from '@/utils/formatPrice';
import { Coins, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface UTICoinsProductWidgetProps {
  product: Product;
  onDiscountApplied?: (discount: number, coinsUsed: number) => void;
  onDiscountRemoved?: () => void;
}

const UTICoinsProductWidget: React.FC<UTICoinsProductWidgetProps> = ({
  product,
  onDiscountApplied,
  onDiscountRemoved
}) => {
  const { balance } = useUTICoins();
  const utiCoinsProduct = useUTICoinsProduct(product);
  const [coinsToSpend, setCoinsToSpend] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular desconto quando coins mudam
  useEffect(() => {
    if (coinsToSpend <= 0) {
      setDiscount(0);
      setError(null);
      onDiscountRemoved?.();
      return;
    }

    if (!utiCoinsProduct.canUseCoins) {
      setError('UTI Coins não disponível para este produto');
      return;
    }

    const calculateDiscountAmount = async () => {
      setIsCalculating(true);
      setError(null);

      try {
        const result = await utiCoinsProduct.calculateDiscount(coinsToSpend);
        
        if (result.success) {
          setDiscount(result.discountAmount);
          onDiscountApplied?.(result.discountAmount, coinsToSpend);
        } else {
          setError(result.message || 'Erro ao calcular desconto');
          setDiscount(0);
          onDiscountRemoved?.();
        }
      } catch (error) {
        console.error('Erro ao calcular desconto:', error);
        setError('Erro interno ao calcular desconto');
        setDiscount(0);
        onDiscountRemoved?.();
      } finally {
        setIsCalculating(false);
      }
    };

    calculateDiscountAmount();
  }, [coinsToSpend, utiCoinsProduct, onDiscountApplied, onDiscountRemoved]);

  // Se UTI Coins não está habilitado para o produto, não mostra nada
  if (!utiCoinsProduct.isEnabled) {
    return null;
  }

  // Se usuário não pode usar coins, mostra info apenas
  if (!utiCoinsProduct.canUseCoins) {
    return (
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">UTI Coins</span>
          </div>
          <div className="space-y-1 text-xs text-orange-700">
            {utiCoinsProduct.estimatedCashback > 0 && (
              <p>Ganhe {utiCoinsProduct.estimatedCashback} UTI Coins de cashback</p>
            )}
            {balance === 0 ? (
              <p>Você não possui UTI Coins para desconto</p>
            ) : (
              <p>Faça login para usar seus UTI Coins</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCoinsChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(value, utiCoinsProduct.maxCoinsForDiscount));
    setCoinsToSpend(clampedValue);
  };

  const incrementCoins = () => {
    handleCoinsChange(coinsToSpend + 1);
  };

  const decrementCoins = () => {
    handleCoinsChange(coinsToSpend - 1);
  };

  return (
    <Card className="bg-orange-50 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Coins className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-orange-800">Usar UTI Coins</span>
          <span className="text-xs text-orange-600">
            (Saldo: {balance})
          </span>
        </div>

        <div className="space-y-4">
          {/* Controle de quantidade */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={decrementCoins}
                disabled={coinsToSpend <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="flex-1 px-2">
                <Input
                  type="number"
                  value={coinsToSpend}
                  onChange={(e) => handleCoinsChange(parseInt(e.target.value) || 0)}
                  className="text-center h-8"
                  min={0}
                  max={utiCoinsProduct.maxCoinsForDiscount}
                />
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={incrementCoins}
                disabled={coinsToSpend >= utiCoinsProduct.maxCoinsForDiscount}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Slider para seleção rápida */}
            {utiCoinsProduct.maxCoinsForDiscount > 0 && (
              <Slider
                value={[coinsToSpend]}
                onValueChange={(value) => handleCoinsChange(value[0])}
                max={utiCoinsProduct.maxCoinsForDiscount}
                step={1}
                className="w-full"
              />
            )}
          </div>

          {/* Resultado do desconto */}
          <div className="space-y-2">
            {isCalculating ? (
              <p className="text-sm text-orange-700">Calculando desconto...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : discount > 0 ? (
              <div className="bg-white rounded-lg p-3 border border-orange-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Desconto:</span>
                  <span className="font-bold text-green-600">-{formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-700">UTI Coins usados:</span>
                  <span className="text-sm text-orange-600">{coinsToSpend}</span>
                </div>
              </div>
            ) : coinsToSpend > 0 ? (
              <p className="text-sm text-orange-700">Selecione uma quantidade válida</p>
            ) : (
              <div className="text-xs text-orange-600 space-y-1">
                <p>1 UTI Coin = {formatPrice(utiCoinsProduct.rate)}</p>
                <p>Máximo: {utiCoinsProduct.maxCoinsForDiscount} UTI Coins</p>
                {utiCoinsProduct.estimatedCashback > 0 && (
                  <p>Cashback: +{utiCoinsProduct.estimatedCashback} UTI Coins</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UTICoinsProductWidget;