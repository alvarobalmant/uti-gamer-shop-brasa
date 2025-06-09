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
    <div className="mt-0"> {/* Removendo margem superior já que o espaçamento vem do título */}
      {/* Main Price */}
      <div className="flex items-center gap-1">
        <span className="text-base font-bold text-gray-900"> {/* Ajustado para tamanho e peso da Gamestop */}
          R$ {product.price.toFixed(2)}
        </span>
        {discount > 0 && (
          <span className="text-xs text-gray-400 line-through"> {/* Ajustado para cor e tamanho da Gamestop */}
            R$ {originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* Pro Price */}
      <div className="text-sm font-medium text-[#800080]"> {/* Ajustado para cor e tamanho da Gamestop */}
        R$ {proPrice.toFixed(2)} for Pros
      </div>
    </div>
  );
};

export default ProductCardPrice;


