import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardInfoProps {
  product: Product;
}

const ProductCardInfo: React.FC<ProductCardInfoProps> = ({ product }) => {
  return (
    <div className="mb-4"> {/* Aumentando margem inferior para criar mais espaço entre título e preço */}
      <h3
        className={cn(
          "font-sans text-base font-semibold leading-tight text-gray-900 text-left",
          "line-clamp-2"
        )}
        title={product.name}
      >
        {product.name}
      </h3>
    </div>
  );
};

export default ProductCardInfo;


