import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardInfoProps {
  product: Product;
}

const ProductCardInfo: React.FC<ProductCardInfoProps> = ({ product }) => {
  return (
    <div className="mb-1">
      <h3
        className={cn(
          "text-sm font-bold leading-tight text-gray-900 uppercase", // GameStop-like title style
          "line-clamp-2 transition-colors duration-200",
          "group-hover:text-red-600" // Example hover effect, adjust as needed
        )}
        title={product.name}
      >
        {product.name}
      </h3>
    </div>
  );
};

export default ProductCardInfo;


