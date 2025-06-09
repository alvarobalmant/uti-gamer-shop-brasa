
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardReducedPriceBadge from './ProductCard/ProductCardReducedPriceBadge';
import ProductCardBadge from './ProductCard/ProductCardBadge';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onCardClick, onAddToCart }: ProductCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    onCardClick(product.id);
  };

  // Calculate if there's a discount for the badge
  const originalPrice = product.price * 1.15;
  const hasDiscount = product.price < originalPrice;

  return (
    <Card
      className={cn(
        "group relative flex flex-col bg-white overflow-hidden",
        "border border-gray-200",
        "rounded-lg",
        "shadow-none",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-md hover:-translate-y-1",
        "cursor-pointer",
        "w-[200px] h-[320px]", // GameStop card dimensions
        "p-0"
      )}
      onClick={handleCardClick}
    >
      <ProductCardReducedPriceBadge isVisible={hasDiscount} />
      <ProductCardBadge 
        badgeText={product.badge_text} 
        badgeColor={product.badge_color} 
        badgeVisible={product.badge_visible} 
      />
      
      <ProductCardImage product={product} />

      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-2">
          <ProductCardInfo product={product} />
          <ProductCardPrice product={product} />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
