import React, { useCallback, useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import FavoriteButton from '@/components/FavoriteButton';
import { useProductHover } from '@/hooks/useProductPrefetch';
import { useAnalytics } from '@/contexts/AnalyticsContext';

import ProductCardImage from './ProductCardImage';
import ProductCardInfo from './ProductCardInfo';
import ProductCardPrice from './ProductCardPrice';
import ProductCardBadge from './ProductCardBadge';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import UTICoinsDiscountIndicator from '@/components/UTICoinsDiscountIndicator';

interface SearchProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
}

const SearchProductCard = React.memo(({ product, onCardClick, onAddToCart }: SearchProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { handleMouseEnter: handlePrefetchMouseEnter, handleMouseLeave: handlePrefetchMouseLeave } = useProductHover(product.id);
  const { trackProductView } = useAnalytics();
  const { getCoinsForAction } = useUTICoins();
  
  // Calculate UTI Coins discount percentage
  const coinsDiscountPercentage = product.uti_coins_discount_percentage || 0;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    
    // Track product view
    trackProductView(product.id, { name: product.name, price: product.price });
    
    onCardClick(product.id);
  }, [onCardClick, product.id, trackProductView, product.name, product.price]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    handlePrefetchMouseEnter();
  }, [handlePrefetchMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    handlePrefetchMouseLeave();
  }, [handlePrefetchMouseLeave]);

  return (
    <Card
      className={cn(
        "relative flex flex-col bg-white overflow-hidden",
        "border border-gray-200",
        "rounded-lg",
        "shadow-none",
        "transition-all duration-200 ease-in-out",
        "cursor-pointer",
        // Mobile-first: cards otimizados para 2 por linha
        "w-full max-w-none",
        "aspect-[3/4.8]", // Mais compacto verticalmente
        "p-0",
        "product-card",
        isHovered && "md:shadow-md md:-translate-y-1"
      )}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="search-product-card"
    >
      <ProductCardBadge 
        text={product.badge_text || ''} 
        color={product.badge_color || '#22c55e'} 
        isVisible={product.badge_visible || false} 
      />

      {/* Favorite Button */}
      <div className="absolute top-1 right-1 z-[1]">
        <FavoriteButton productId={product.id} size="sm" />
      </div>
      
      {/* Image - mais compacta */}
      <div className="relative aspect-square w-full overflow-hidden">
        <ProductCardImage product={product} isHovered={isHovered} />
      </div>

      {/* Content - layout mais compacto */}
      <div className="flex flex-1 flex-col justify-between p-2">
        <div className="space-y-1">
          {/* Info com texto menor */}
          <div className="min-h-[32px]">
            <ProductCardInfo product={product} />
          </div>
          
          {/* Price compacto */}
          <ProductCardPrice product={product} />
        </div>
        
        {/* UTI Coins Discount Indicator - mais compacto */}
        {coinsDiscountPercentage > 0 && (
          <UTICoinsDiscountIndicator
            discountPercentage={coinsDiscountPercentage}
            className="mt-1 text-xs py-1"
          />
        )}
      </div>
    </Card>
  );
});

export default SearchProductCard;