
import React from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: 'card' | 'hero' | 'thumbnail';
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  priority = false,
  variant = 'card',
  className
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={cn(
        'object-cover',
        variant === 'card' && 'w-full h-full',
        variant === 'hero' && 'w-full h-auto',
        variant === 'thumbnail' && 'w-16 h-16',
        className
      )}
    />
  );
};

export default ProductImage;
