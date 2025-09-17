import React, { useCallback, useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

import SearchResultProductCardImage from './ProductCard/SearchResultProductCardImage';
import SearchResultProductCardInfo from './ProductCard/SearchResultProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardBadge from './ProductCard/ProductCardBadge';

export type { Product } from '@/hooks/useProducts';

interface SearchResultProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  showDebug?: boolean;
}

const SearchResultProductCard = React.memo(({ product, onCardClick, onAddToCart, showDebug = false }: SearchResultProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { trackProductView } = useAnalytics();

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
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <>
      <Card
        className={cn(
          "relative flex flex-col bg-white overflow-hidden",
          "border border-gray-200",
          "rounded-lg",
          "shadow-none",
          "transition-all duration-200 ease-in-out",
          "cursor-pointer",
          "w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[380px]",
          "p-0",
          "product-card",
          isHovered && "md:shadow-md md:-translate-y-1"
        )}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="search-result-product-card"
      >
        <ProductCardBadge 
          text={product.badge_text || ''} 
          color={product.badge_color || '#22c55e'} 
          isVisible={product.badge_visible || false} 
        />
        
        <SearchResultProductCardImage product={product} isHovered={isHovered} />

        <div className="flex flex-1 flex-col justify-between p-1.5 sm:p-2 md:p-2.5 lg:p-3 min-h-0">
          <div className="space-y-2">
            <SearchResultProductCardInfo product={product} />
            <ProductCardPrice product={product} />
          </div>
          
          {/* UTI Coins Discount Indicator */}
          {(product.uti_coins_discount_percentage || 0) > 0 && (
            <div className="mt-1 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-md p-2 flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">
                {product.uti_coins_discount_percentage}% OFF com UTI Coins
              </span>
            </div>
          )}
        </div>
      </Card>

      {showDebug && (
        <div className="mt-1 border border-purple-200 rounded-md p-2 bg-purple-50/40 text-[11px] leading-relaxed">
          {(() => {
            const p: any = product;
            const score = p.relevance_score ?? null;
            const tags: string[] = p.matched_tags || [];
            const breakdown = p.debug_info?.scoreBreakdown;
            return (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Score:</span>
                  <span className="font-mono px-1.5 py-0.5 rounded bg-white border">
                    {score !== null ? Number(score).toFixed(1) : '–'}
                  </span>
                  {p.debug_info?.exactMatch && (
                    <Badge variant="default" className="h-5 py-0">Exato</Badge>
                  )}
                  {p.debug_info?.partialMatch && (
                    <Badge variant="secondary" className="h-5 py-0">Parcial</Badge>
                  )}
                </div>
                {breakdown && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>Nome: <span className="font-mono">{breakdown.nameScore}</span></div>
                      <div>Tags: <span className="font-mono">{breakdown.tagScore}</span></div>
                      <div>Categoria: <span className="font-mono">{breakdown.categoryBonus}</span></div>
                      <div>Exato: <span className="font-mono">{breakdown.exactBonus}</span></div>
                      <div className="col-span-2 font-semibold">Total: <span className="font-mono">{breakdown.totalScore}</span></div>
                    </div>
                    {breakdown.tagDetails && breakdown.tagDetails.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-600">Detalhes das Tags:</div>
                        {breakdown.tagDetails.map((detail: any, i: number) => (
                          <div key={i} className="text-xs text-gray-600 bg-gray-50 p-1 rounded">
                            {detail.description || `${detail.name}: ${detail.weight} × 10 = ${detail.contribution} pontos`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
});

export default SearchResultProductCard;

