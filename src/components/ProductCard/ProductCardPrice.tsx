
import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductCardPriceProps {
  product: Product;
}

const ProductCardPrice: React.FC<ProductCardPriceProps> = ({ product }) => {
  // GameStop pricing structure
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="space-y-1">
      {/* Main Price Section */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-muted-foreground">
          ${product.price.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-sm text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* Pro Price Section */}
      <div className="text-sm">
        <span className="font-bold text-purple-600">
          ${proPrice.toFixed(2)}
        </span>
        <span className="text-muted-foreground ml-1">for Pros</span>
      </div>
    </div>
  );
};

export default ProductCardPrice;
