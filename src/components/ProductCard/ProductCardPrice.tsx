
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
        <span className="text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-sm text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* Pro Price Section */}
      <div className="text-sm text-purple-600 font-medium">
        ${proPrice.toFixed(2)} for Pros
      </div>
    </div>
  );
};

export default ProductCardPrice;
