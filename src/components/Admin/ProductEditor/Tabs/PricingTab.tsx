import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Percent, Coins } from 'lucide-react';
import { ProductEditorData } from '../ProductEditor';
import { calculatePurchaseSummary, formatUTICoins, utiCoinsToReais } from '@/utils/utiCoinsCalculations';

interface PricingTabProps {
  formData: ProductEditorData;
  onChange: (field: string, value: any) => void;
}

const PricingTab: React.FC<PricingTabProps> = ({ formData, onChange }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateProPrice = () => {
    if (!formData.price) return 0;
    if (formData.pro_price) return formData.pro_price;
    return formData.price * 0.9; // 10% desconto padrão
  };

  const calculateDiscountedPrice = () => {
    if (!formData.price || !formData.discount_percentage) return formData.price;
    return formData.price * (1 - formData.discount_percentage / 100);
  };

  const calculatePixPrice = () => {
    const basePrice = calculateDiscountedPrice();
    const pixDiscount = formData.pix_discount_percentage || 5;
    return basePrice * (1 - pixDiscount / 100);
  };

  return (
    <div className="space-y-6">
      {/* Preços básicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Preços Principais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">
                Preço principal de venda do produto
              </p>
            </div>

            <div>
              <Label htmlFor="list_price">Preço de Lista (Opcional)</Label>
              <Input
                id="list_price"
                type="number"
                step="0.01"
                value={formData.list_price || ''}
                onChange={(e) => onChange('list_price', parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
              />
              <p className="text-sm text-gray-500 mt-1">
                Preço original para mostrar desconto
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="pro_price">Preço UTI Pro (Opcional)</Label>
            <Input
              id="pro_price"
              type="number"
              step="0.01"
              value={formData.pro_price || ''}
              onChange={(e) => onChange('pro_price', parseFloat(e.target.value) || undefined)}
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Preço especial para membros UTI Pro. Se não informado, será aplicado 10% de desconto automaticamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Descontos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Descontos e Promoções
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_percentage">Desconto Promocional (%)</Label>
              <Input
                id="discount_percentage"
                type="number"
                min="0"
                max="90"
                value={formData.discount_percentage || ''}
                onChange={(e) => onChange('discount_percentage', parseInt(e.target.value) || undefined)}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Desconto geral aplicado ao produto
              </p>
            </div>

            <div>
              <Label htmlFor="pix_discount_percentage">Desconto PIX (%)</Label>
              <Input
                id="pix_discount_percentage"
                type="number"
                min="0"
                max="20"
                value={formData.pix_discount_percentage || 5}
                onChange={(e) => onChange('pix_discount_percentage', parseInt(e.target.value) || 5)}
                placeholder="5"
              />
              <p className="text-sm text-gray-500 mt-1">
                Desconto adicional para pagamento via PIX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UTI Coins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            UTI Coins - Sistema de Fidelidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Coins className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Conversão:</strong> 1 UTI Coin = R$ 0,01 (1 centavo)
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Configure descontos e cashback em UTI Coins para este produto
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="uti_coins_discount_percentage">Desconto UTI Coins (%)</Label>
              <Input
                id="uti_coins_discount_percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.uti_coins_discount_percentage || ''}
                onChange={(e) => onChange('uti_coins_discount_percentage', parseFloat(e.target.value) || undefined)}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Porcentagem máxima que pode ser paga com UTI Coins
              </p>
              {formData.uti_coins_discount_percentage && formData.price && (
                <div className="text-xs text-blue-600 mt-1">
                  💰 Máximo: {Math.floor(((formData.price * formData.uti_coins_discount_percentage) / 100) * 100).toLocaleString()} 🪙 = {formatCurrency((formData.price * formData.uti_coins_discount_percentage) / 100)}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="uti_coins_cashback_percentage">Cashback UTI Coins (%)</Label>
              <Input
                id="uti_coins_cashback_percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.uti_coins_cashback_percentage || ''}
                onChange={(e) => onChange('uti_coins_cashback_percentage', parseFloat(e.target.value) || undefined)}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Porcentagem de cashback sobre valor final pago
              </p>
              {formData.uti_coins_cashback_percentage && formData.price && (
                <div className="text-xs text-green-600 mt-1">
                  🎁 Cashback: {Math.floor((formData.price * formData.uti_coins_cashback_percentage) / 100 * 100).toLocaleString()} 🪙 = {formatCurrency((formData.price * formData.uti_coins_cashback_percentage) / 100)}
                </div>
              )}
            </div>
          </div>

          {/* Simulação UTI Coins */}
          {(formData.uti_coins_discount_percentage || formData.uti_coins_cashback_percentage) && formData.price && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">💰 Simulação UTI Coins</h4>
              
              {/* Cenário 1: Cliente com saldo suficiente */}
              <div className="space-y-2 mb-4">
                <h5 className="text-sm font-medium text-gray-700">Cenário: Cliente com saldo suficiente</h5>
                {(() => {
                  const summary = calculatePurchaseSummary(
                    formData.price,
                    formData.uti_coins_discount_percentage || 0,
                    formData.uti_coins_cashback_percentage || 0,
                    10000 // 10.000 coins = R$ 100,00
                  );
                  return (
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>💳 Preço original: {formatCurrency(summary.originalPrice)}</div>
                      {summary.hasDiscount && (
                        <>
                          <div>🪙 UTI Coins usadas: {summary.utiCoinsUsed.toLocaleString()} ({formatCurrency(summary.discountApplied)})</div>
                          <div>💰 Valor a pagar: {formatCurrency(summary.finalPrice)}</div>
                        </>
                      )}
                      {summary.hasCashback && (
                        <div>🎁 Cashback: +{summary.cashbackCoins.toLocaleString()} 🪙 ({formatCurrency(summary.cashbackReais)})</div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Cenário 2: Cliente com saldo insuficiente */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Cenário: Cliente com saldo limitado (500 🪙)</h5>
                {(() => {
                  const summary = calculatePurchaseSummary(
                    formData.price,
                    formData.uti_coins_discount_percentage || 0,
                    formData.uti_coins_cashback_percentage || 0,
                    500 // 500 coins = R$ 5,00
                  );
                  return (
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>💳 Preço original: {formatCurrency(summary.originalPrice)}</div>
                      {summary.hasDiscount && (
                        <>
                          <div>🪙 UTI Coins usadas: {summary.utiCoinsUsed.toLocaleString()} ({formatCurrency(summary.discountApplied)})</div>
                          <div>💰 Valor a pagar: {formatCurrency(summary.finalPrice)}</div>
                        </>
                      )}
                      {summary.hasCashback && (
                        <div>🎁 Cashback: +{summary.cashbackCoins.toLocaleString()} 🪙 ({formatCurrency(summary.cashbackReais)})</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview de preços */}
      <Card>
        <CardHeader>
          <CardTitle>Preview dos Preços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {formData.list_price && formData.list_price > formData.price && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Preço de Lista:</span>
                <span className="text-sm line-through text-gray-500">
                  {formatCurrency(formData.list_price)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium">Preço de Venda:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(formData.price || 0)}
              </span>
            </div>

            {formData.discount_percentage && formData.discount_percentage > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">
                  Com desconto de {formData.discount_percentage}%:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(calculateDiscountedPrice())}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600">Preço UTI Pro:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(calculateProPrice())}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-600">
                Preço no PIX ({formData.pix_discount_percentage || 5}% desc.):
              </span>
              <span className="text-lg font-bold text-orange-600">
                {formatCurrency(calculatePixPrice())}
              </span>
            </div>

            {formData.price > 0 && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">
                  <p>• Parcelamento: até 12x de {formatCurrency((formData.price || 0) / 12)}</p>
                  <p>• Economia UTI Pro: {formatCurrency((formData.price || 0) - calculateProPrice())}</p>
                  <p>• Economia PIX: {formatCurrency(calculateDiscountedPrice() - calculatePixPrice())}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTab;