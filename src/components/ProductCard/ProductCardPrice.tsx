
import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductCardPriceProps {
  product: Product;
}

const ProductCardPrice: React.FC<ProductCardPriceProps> = ({ product }) => {
  // Pricing calculations
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="mb-4 md:mb-4 mb-3">
      {/* Main Price */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl font-bold text-gray-900 md:text-xl text-lg">
          R$ {product.price.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-sm text-gray-500 line-through md:text-sm text-xs">
            R$ {originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* Pro Price */}
      <div className="text-sm font-medium text-purple-600 mb-1 md:text-sm text-xs">
        R$ {proPrice.toFixed(2)} Membros Pro
      </div>
      
      {/* Installments */}
      <div className="text-xs text-gray-500 md:text-xs text-[10px]">
        ou 12x de R$ {(product.price / 12).toFixed(2)}
      </div>
    </div>
  );
};

export default ProductCardPrice;
