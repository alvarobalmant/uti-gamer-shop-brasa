
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardImageProps {
  product: Product;
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({ product }) => {
  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center bg-white" style={{ height: '160px' }}>
      <img
        src={product.image || '/placeholder-image.webp'}
        alt={product.name}
        className={cn(
          "h-full w-full object-contain transition-transform duration-300 ease-in-out p-2"
        )}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder-image-error.webp';
        }}
      />
    </div>
  );
};

export default ProductCardImage;
