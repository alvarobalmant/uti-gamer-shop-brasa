
import React, { useCallback, useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardBadge from './ProductCard/ProductCardBadge';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = React.memo(({ product, onCardClick, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    onCardClick(product.id);
  }, [onCardClick, product.id]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Card
      className={cn(
        "relative flex flex-col bg-white overflow-hidden",
        "border border-gray-200",
        "rounded-lg",
        "shadow-none",
        "transition-all duration-200 ease-in-out",
        "cursor-pointer",
        "w-[200px] h-[320px]",
        "p-0",
        isHovered && "md:shadow-md md:-translate-y-1"
      )}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ProductCardBadge 
        text={product.badge_text || ''} 
        color={product.badge_color || '#22c55e'} 
        isVisible={product.badge_visible || false} 
      />
      
      <ProductCardImage product={product} isHovered={isHovered} />

      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-2">
          <ProductCardInfo product={product} />
          <ProductCardPrice product={product} />
        </div>
      </div>
    </Card>
  );
});

export default ProductCard;
