
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductPricingProps {
  product: Product;
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  onConditionChange: (condition: 'new' | 'pre-owned' | 'digital') => void;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  product,
  selectedCondition,
  onConditionChange,
}) => {
  const { hasActiveSubscription, getDiscountPercentage } = useSubscriptions();
  const isProMember = hasActiveSubscription();
  const discountPercentage = getDiscountPercentage();

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
  const originalPrice = product.list_price || basePrice * 1.2;
  const proPrice = basePrice * (1 - discountPercentage / 100);

  // Condição removida conforme solicitado pelo usuário

  return (
    <div className="space-y-6">
      {/* Preços */}
      <div className="space-y-4">
        {/* Preço UTI PRO */}
        {isProMember ? (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-800 uppercase tracking-wide">
                Seu Preço UTI PRO
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-yellow-800">
                R$ {proPrice.toFixed(2).replace('.', ',')}
              </span>
              <Badge className="bg-green-500 text-white font-bold">
                -{discountPercentage}% OFF
              </Badge>
            </div>
            <div className="text-sm text-yellow-700 mt-1">
              Você está economizando R$ {(basePrice - proPrice).toFixed(2).replace('.', ',')}
            </div>
          </div>
        ) : (
          /* Preço Regular */
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {originalPrice > basePrice && (
                <span className="text-lg text-gray-500 line-through">
                  R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-3xl font-bold text-gray-900">
                R$ {basePrice.toFixed(2).replace('.', ',')}
              </span>
              {originalPrice > basePrice && (
                <Badge variant="destructive" className="font-bold">
                  -{Math.round(((originalPrice - basePrice) / originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Oferta UTI PRO para não membros */}
        {!isProMember && (
          <div className="bg-gradient-to-r from-purple-50 to-red-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Preço Membro UTI PRO</span>
                </div>
                <div className="text-xl font-bold text-purple-700">
                  R$ {proPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm text-purple-600">
                  Economize R$ {(basePrice - proPrice).toFixed(2).replace('.', ',')} (-{discountPercentage}%)
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold"
                onClick={() => window.open('/uti-pro', '_blank')}
              >
                Ser PRO
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPricing;
