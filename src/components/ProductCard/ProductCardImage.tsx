
import React, { useState, useCallback } from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardImageProps {
  product: Product;
  isHovered: boolean;
}

const ProductCardImage: React.FC<ProductCardImageProps> = React.memo(({ product, isHovered }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/placeholder-image-error.webp';
  }, []);

  // Criar um ID único para este componente específico
  const uniqueId = `product-image-${product.id}`;

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center bg-white" style={{ height: '160px' }}>
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
        </div>
      )}
      <img
        id={uniqueId}
        src={product.image || '/placeholder-image.webp'}
        alt={product.name}
        className={cn(
          "h-full w-full object-contain p-2 transition-transform duration-300 ease-in-out",
          imageLoaded ? "opacity-100" : "opacity-0",
          isHovered ? "scale-105" : "scale-100"
        )}
        loading="lazy"
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '200px 160px'
        }}
      />
    </div>
  );
});

ProductCardImage.displayName = 'ProductCardImage';

export default ProductCardImage;
