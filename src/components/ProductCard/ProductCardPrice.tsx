
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useUTIProPricing } from '@/hooks/useUTIProPricing';

interface ProductCardPriceProps {
  product: Product;
}

const ProductCardPrice: React.FC<ProductCardPriceProps> = ({ product }) => {
  const utiProPricing = useUTIProPricing(product);
  const originalPrice = product.list_price || product.price * 1.15;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="space-y-1">
      {/* Main Price Section */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-muted-foreground">
          R${product.price.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-sm text-gray-400 line-through">
            R${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* Pro Price Section - só mostra se UTI Pro estiver habilitado */}
      {utiProPricing.isEnabled && utiProPricing.proPrice && (
        <div className="text-sm">
          <span className="font-bold text-purple-600">
            R${utiProPricing.proPrice.toFixed(2)}
          </span>
          <span className="text-muted-foreground ml-1">com Pro</span>
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
