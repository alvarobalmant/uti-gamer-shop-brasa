
import React, { memo, useState, useCallback } from 'react';
import { useProductHover } from '@/hooks/useProductPrefetch';

interface OptimizedProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    is_featured?: boolean;
  };
  showQuickActions?: boolean;
  showBadge?: boolean;
  showProPrice?: boolean;
}

const OptimizedProductCard: React.FC<OptimizedProductCardProps> = memo(({
  product,
  showQuickActions = false,
  showBadge = false,
  showProPrice = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { handleMouseEnter, handleMouseLeave } = useProductHover(product.id);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }, []);

  return (
    <div 
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge */}
      {showBadge && product.is_featured && (
        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          Destaque
        </div>
      )}

      {/* Imagem */}
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
        )}
        
        {product.image_url && !imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">🎮</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="space-y-1">
          <div className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </div>
          
          {showProPrice && (
            <div className="text-sm text-green-600 font-medium">
              UTI PRO: {formatPrice(product.price * 0.9)}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex-1 bg-primary text-primary-foreground text-xs py-2 rounded hover:bg-primary/90 transition-colors">
              Comprar
            </button>
            <button className="px-3 py-2 border border-border rounded hover:bg-accent transition-colors">
              ❤️
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export { OptimizedProductCard };
