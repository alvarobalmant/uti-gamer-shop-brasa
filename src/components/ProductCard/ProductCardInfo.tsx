
import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardInfoProps {
  product: Product;
  getPlatformColor: (product: Product) => string;
}

const ProductCardInfo: React.FC<ProductCardInfoProps> = ({
  product,
  getPlatformColor
}) => {
  const primaryTag = product.tags?.[0]?.name || '';

  return (
    <>
      {/* Platform Tag */}
      {primaryTag && (
        <div className="mb-3 md:mb-3 mb-2">
          <span className={`text-xs text-white px-2 py-1 rounded-md font-medium ${getPlatformColor(product)} md:text-xs text-[10px] md:px-2 px-1.5`}>
            {primaryTag}
          </span>
        </div>
      )}

      {/* Product Title */}
      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight md:text-base text-sm md:mb-3 mb-2 md:leading-tight leading-snug">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4 md:mb-4 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400 md:w-3 md:h-3 w-2.5 h-2.5" />
        ))}
        <span className="text-xs text-gray-500 ml-1 md:text-xs text-[10px]">(4.8)</span>
      </div>
    </>
  );
};

export default ProductCardInfo;
