
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useUTIProOptimized } from '@/hooks/useUTIProOptimized';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardPriceProps {
  product: Product;
}

const ProductCardPrice: React.FC<ProductCardPriceProps> = ({ product }) => {
  const utiPro = useUTIProOptimized(product);
  const originalPrice = product.list_price;
  const discount = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  return (
    <div className="space-y-1">
      {/* Main Price Section */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-muted-foreground">
          {formatPrice(product.price)}
        </span>
        {discount > 0 && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      
      {/* Pro Price Section - só mostra se carregamento terminou e UTI Pro habilitado */}
      {!utiPro.loading && utiPro.isEnabled && utiPro.proPrice && (
        <div className="text-sm">
          <span className="font-bold text-purple-600">
            {formatPrice(utiPro.proPrice)}
          </span>
          <span className="text-muted-foreground ml-1">
            {utiPro.isUserPro ? 'seu preço PRO' : 'com Pro'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
