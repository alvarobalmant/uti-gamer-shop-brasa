import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/OptimizedImage';

interface ProductCardImageProps {
  product: Product;
  isHovered: boolean;
}

const ProductCardImageOptimized: React.FC<ProductCardImageProps> = React.memo(({ product, isHovered }) => {
  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center bg-white" style={{ height: '160px' }}>
      <OptimizedImage
        src={product.image || '/placeholder-image.webp'}
        alt={product.name}
        className={cn(
          "h-full w-full object-contain p-2 transition-transform duration-300 ease-in-out",
          isHovered ? "scale-105" : "scale-100"
        )}
        width={200}
        height={160}
        priority={false} // Lazy loading para produtos
        placeholder="blur"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        quality={85}
      />
    </div>
  );
});

ProductCardImageOptimized.displayName = 'ProductCardImageOptimized';

export default ProductCardImageOptimized;

