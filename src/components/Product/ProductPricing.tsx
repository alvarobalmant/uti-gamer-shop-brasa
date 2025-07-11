
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useUTIProOptimized } from '@/hooks/useUTIProOptimized';
import { formatPrice } from '@/utils/formatPrice';
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
  const utiPro = useUTIProOptimized(product);

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
    <div className="space-y-6">
      {/* Não mostrar nada se ainda está carregando */}
      {utiPro.loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(basePrice)}
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo normal quando carregamento terminar */}
      {!utiPro.loading && (
        <div className="space-y-4">
          {/* SEU PREÇO UTI PRO - para membros ativos */}
          {utiPro.showMemberMessage && utiPro.proPrice && (
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-800 uppercase tracking-wide">
                  Seu Preço UTI PRO
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-yellow-800">
                  {formatPrice(utiPro.proPrice)}
                </span>
                <Badge className="bg-green-500 text-white font-bold">
                  -{utiPro.discountPercentage}% OFF
                </Badge>
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                Você está economizando {formatPrice(utiPro.savings || 0)}
              </div>
            </div>
          )}

          {/* Preço Regular - sempre mostra quando não é membro */}
          {!utiPro.showMemberMessage && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {originalPrice && originalPrice > basePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(basePrice)}
                </span>
                {originalPrice && originalPrice > basePrice && (
                  <Badge variant="destructive" className="font-bold">
                    -{Math.round(((originalPrice - basePrice) / originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* PREÇO MEMBRO UTI PRO - para não membros quando UTI PRO habilitado */}
          {utiPro.showProMessage && utiPro.proPrice && (
            <div className="bg-gradient-to-r from-purple-50 to-red-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-purple-800">Preço Membro UTI PRO</span>
                  </div>
                  <div className="text-xl font-bold text-purple-700">
                    {formatPrice(utiPro.proPrice)}
                  </div>
                  <div className="text-sm text-purple-600">
                    Economize {formatPrice(utiPro.savings || 0)} (-{utiPro.discountPercentage}%)
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
      )}
    </div>
  );
};

export default ProductPricing;
