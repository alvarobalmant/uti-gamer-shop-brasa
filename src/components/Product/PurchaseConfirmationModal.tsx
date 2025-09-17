import React, { useEffect } from 'react';
import { X, ShoppingCart, Truck, Calculator, Coins, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { sendSingleProductToWhatsApp } from '@/utils/whatsapp';
import { useAuth } from '@/hooks/useAuth';
import { useUTICoins } from '@/hooks/useUTICoins';
import { calculateItemPrice, formatCurrency } from '@/utils/priceCalculations';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    coinsEarned?: number;
    coinsNeeded?: number;
    discount_percentage?: number;
    uti_coins_cashback_percentage?: number;
    uti_coins_discount_percentage?: number;
  };
  quantity: number;
}

export const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity
}) => {
  const { user } = useAuth();
  const { balance: coinsBalance } = useUTICoins();
  const [useCoins, setUseCoins] = React.useState(false);
  // Bloquear scroll da página quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      // Salvar posição atual de scroll
      const scrollY = window.scrollY;
      
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restaurar scroll ao fechar
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use unified calculation system (same as cart)
  const calculations = calculateItemPrice(product, quantity, useCoins, coinsBalance || 0);
  
  const subtotal = calculations.originalPrice;
  const originalSubtotal = product.originalPrice ? product.originalPrice * quantity : subtotal;
  
  // Calculate real product discount (difference between list price and sale price)
  const realProductDiscount = originalSubtotal - subtotal; // This is the actual discount shown to customer
  const additionalPercentageDiscount = calculations.regularDiscountAmount; // Additional discount from discount_percentage
  
  const coinsEarned = calculations.coinsEarned;
  const maxCoinsToUse = calculations.maxCoinsDiscount;
  const coinsDiscount = calculations.appliedCoinsDiscount;
  const finalPrice = calculations.finalPrice;
  const shippingCost = calculations.shippingCost;
  const freeShippingThreshold = 150;
  const needsForFreeShipping = Math.max(0, freeShippingThreshold - finalPrice);
  const hasFreeShipping = shippingCost === 0;
  const shippingValue = hasFreeShipping ? 15 : 0; // Real shipping savings value
  
  // Total savings = real product discount + additional percentage discount + coins discount + shipping savings
  const totalSavings = realProductDiscount + additionalPercentageDiscount + coinsDiscount + shippingValue;

  const handleWhatsAppProceed = async () => {
    // Preparar informações adicionais incluindo UTI Coins (now using unified calculations)
    const additionalInfo = {
      useCoins,
      coinsBalance: coinsBalance || 0,
      coinsToUse: useCoins ? maxCoinsToUse : 0,
      coinsDiscount: coinsDiscount,
      coinsEarned: useCoins ? 0 : coinsEarned,
      finalPrice: finalPrice,
      originalSubtotal: subtotal,
      shippingCost: shippingCost,
      totalWithShipping: calculations.totalWithShipping
    };

    // Usar nova função para gerar código de verificação
    const success = await sendSingleProductToWhatsApp(product, quantity, additionalInfo, () => {
      // Track analytics se necessário
    });

    if (success) {
      onClose(); // Fechar modal após sucesso
    }
  };

  return (
    <>
      {/* Overlay com z-index máximo */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[85vh] flex flex-col mx-auto my-auto relative shadow-2xl overflow-hidden">
          {/* Header - Fixo no topo */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0 rounded-t-xl bg-white">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Confirmar Compra</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          {/* Banner de Economia Total */}
          {totalSavings > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold">💰</span>
                </div>
                <span className="text-green-800 font-semibold text-sm sm:text-lg">VOCÊ ESTÁ ECONOMIZANDO</span>
              </div>
               <div className="text-green-700 font-bold text-xl sm:text-2xl">
                 R$ {formatCurrency(totalSavings)}
               </div>
               <div className="text-green-600 text-xs sm:text-sm mt-1">
                 {realProductDiscount > 0 && `Desconto: R$ ${formatCurrency(realProductDiscount)}`}
                 {realProductDiscount > 0 && additionalPercentageDiscount > 0 && ' + '}
                 {additionalPercentageDiscount > 0 && `Desconto extra: R$ ${formatCurrency(additionalPercentageDiscount)}`}
                 {(realProductDiscount > 0 || additionalPercentageDiscount > 0) && (coinsDiscount > 0 || hasFreeShipping) && ' + '}
                 {coinsDiscount > 0 && `UTI Coins: R$ ${formatCurrency(coinsDiscount)}`}
                 {coinsDiscount > 0 && hasFreeShipping && ' + '}
                 {hasFreeShipping && `Frete grátis: R$ ${formatCurrency(shippingValue)}`}
               </div>
            </div>
          )}

          {/* Product Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600">Quantidade: {quantity}</p>
            </div>
          </div>

          {/* UTI Coins Section */}
          {user && (
            <div className="bg-card rounded-lg p-3 sm:p-4 border">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-xs sm:text-sm">Usar UTI Coins</span>
                </div>
                 <Switch
                   checked={useCoins}
                   onCheckedChange={setUseCoins}
                   disabled={!coinsBalance || maxCoinsToUse === 0}
                 />
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Saldo: {coinsBalance?.toLocaleString() || 0} coins</div>
                {useCoins ? (
                  <>
                     {maxCoinsToUse > 0 && (
                       <div className="text-blue-600">
                         Você usará: {maxCoinsToUse.toLocaleString()} coins
                       </div>
                     )}
                     {coinsDiscount > 0 && (
                       <div className="text-green-600">
                         Desconto aplicado: R$ {formatCurrency(coinsDiscount)}
                       </div>
                     )}
                  </>
                ) : (
                  coinsEarned > 0 && (
                    <div className="text-yellow-700">
                      Você ganhará: {coinsEarned.toLocaleString()} coins
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
            {/* Preço Original (se houver desconto) */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-sm">Preço original</span>
                <span className="line-through">R$ {formatCurrency(originalSubtotal)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-medium">R$ {formatCurrency(subtotal)}</span>
            </div>

            {realProductDiscount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Desconto do produto
                </span>
                <span className="font-medium">-R$ {formatCurrency(realProductDiscount)}</span>
              </div>
            )}
            
            {additionalPercentageDiscount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Desconto adicional
                </span>
                <span className="font-medium">-R$ {formatCurrency(additionalPercentageDiscount)}</span>
              </div>
            )}

            {coinsDiscount > 0 && (
              <div className="flex justify-between items-center text-yellow-700">
                <span className="text-sm flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  Desconto UTI Coins
                </span>
                <span className="font-medium">-R$ {formatCurrency(coinsDiscount)}</span>
              </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Frete
              </span>
              {hasFreeShipping ? (
                <div className="text-right">
                  <span className="font-medium text-green-600">GRÁTIS</span>
                  <div className="text-xs text-green-500">Economia: R$ {formatCurrency(shippingValue)}</div>
                </div>
              ) : (
                <span className="text-sm text-gray-600">A combinar</span>
              )}
            </div>

            {!hasFreeShipping && (
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                💡 Faltam apenas R$ {formatCurrency(needsForFreeShipping)} para frete grátis!
              </div>
            )}

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
               <span className="font-bold text-lg text-red-600">
                 R$ {formatCurrency(finalPrice)}
               </span>
            </div>
          </div>

          {/* WhatsApp Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-800">Atendimento Especializado</span>
            </div>
            <p className="text-xs text-green-700">
              <strong>Finalizamos via WhatsApp</strong> com nossa <em>equipe especializada</em> para melhor atendimento
            </p>
          </div>
        </div>

          {/* Footer - Fixo na parte inferior com bordas arredondadas */}
          <div className="border-t bg-gray-50 p-4 sm:p-6 flex-shrink-0 rounded-b-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 sm:h-auto"
              >
                Continuar Comprando
              </Button>
              <Button
                onClick={handleWhatsAppProceed}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white h-11 sm:h-auto"
              >
                Prosseguir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay escuro para hotbar mobile - só aparece em mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden pointer-events-none"></div>
    </>
  );
};