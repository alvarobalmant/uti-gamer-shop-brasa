import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useUTIProPricing } from '@/hooks/useUTIProPricing';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';

interface ProductPricingCompactProps {
  product: Product;
  selectedCondition?: 'new' | 'pre-owned' | 'digital';
  className?: string;
}

const ProductPricingCompact: React.FC<ProductPricingCompactProps> = ({
  product,
  selectedCondition = 'new',
  className
}) => {
  const { hasActiveSubscription } = useSubscriptions();
  const isProMember = hasActiveSubscription();
  const utiProPricing = useUTIProPricing(product);

  const getBasePrice = () => {
    switch (selectedCondition) {
      case 'new':
        return product.new_price || product.price * 1.1;
      case 'digital':
        return product.digital_price || product.price * 1.05;
      default:
        return product.price;
    }
  };

  const basePrice = getBasePrice();
  const originalPrice = product.list_price;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preço UTI PRO - Destaque Máximo */}
      {utiProPricing.isEnabled && isProMember && utiProPricing.proPrice && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wide">
              SEU PREÇO UTI PRO
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatPrice(utiProPricing.proPrice)}
          </div>
          <div className="text-sm opacity-90">
            Economia de {formatPrice(utiProPricing.savings || 0)}
          </div>
          <div className="mt-2">
            <Badge className="bg-green-500 text-white font-bold">
              -{utiProPricing.discountPercentage}% OFF
            </Badge>
          </div>
        </div>
      )}

      {/* Preço Regular */}
      {(!utiProPricing.isEnabled || !isProMember) && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {originalPrice && originalPrice > basePrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(basePrice)}
            </span>
          </div>
          
          {/* Badge de desconto */}
          {originalPrice && originalPrice > basePrice && (
            <div className="flex justify-start">
              <Badge variant="destructive" className="font-bold">
                -{Math.round(((originalPrice - basePrice) / originalPrice) * 100)}% OFF
              </Badge>
            </div>
          )}
          
          {/* UTI Coins - Cashback */}
          {product.uti_coins_cashback_percentage && product.uti_coins_cashback_percentage > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">₿</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">
                    💰 Ganhe {Math.floor((basePrice * product.uti_coins_cashback_percentage / 100) * 100)} UTI Coins
                  </div>
                  <div className="text-yellow-600 text-xs">
                    = R$ {((basePrice * product.uti_coins_cashback_percentage / 100)).toFixed(2).replace('.', ',')} para próximas compras
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UTI Coins - Desconto */}
          {product.uti_coins_discount_percentage && product.uti_coins_discount_percentage > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">%</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-purple-800">
                      🎯 Até {product.uti_coins_discount_percentage}% OFF com UTI Coins
                    </div>
                    <div className="text-purple-600 text-xs">
                      Economize até R$ {((basePrice * product.uti_coins_discount_percentage / 100)).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50 px-2 h-7">
                  Usar
                </Button>
              </div>
            </div>
          )}
          
          {/* Parcelamento */}
          <div className="space-y-1 pt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">12x</span> de {formatPrice(basePrice / 12)} <span className="text-green-600 font-medium">sem juros</span>
            </div>
            <div className="text-sm text-gray-600">
              ou <span className="font-medium">à vista</span> no PIX com <span className="text-green-600 font-medium">5% desconto</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline transition-colors">
              Ver todos os meios de pagamento
            </button>
          </div>
        </div>
      )}

      {/* Oferta UTI PRO para não membros */}
      {utiProPricing.isEnabled && !isProMember && utiProPricing.proPrice && (
        <div className="bg-gradient-to-r from-purple-50 to-red-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-800">Preço Membro UTI PRO</span>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {formatPrice(utiProPricing.proPrice)}
              </div>
              <div className="text-sm text-purple-600">
                Economize {formatPrice(utiProPricing.savings || 0)}
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Ser PRO
            </Button>
          </div>
        </div>
      )}

      {/* Condições do produto */}
      <div className="flex gap-2">
        {['new', 'pre-owned', 'digital'].map((condition) => {
          const conditionLabels = {
            new: 'Novo',
            'pre-owned': 'Usado',
            digital: 'Digital'
          };
          
          return (
            <Button
              key={condition}
              variant={selectedCondition === condition ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {conditionLabels[condition as keyof typeof conditionLabels]}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPricingCompact;

