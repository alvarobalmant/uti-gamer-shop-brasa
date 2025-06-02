
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// Import subcomponents
import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCardNavigation = () => {
    navigate(`/produto/${product.id}`);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Só navega em desktop ou se for um tap simples em mobile
    if (!isMobile) {
      handleCardNavigation();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Para mobile, usa um timeout curto para detectar tap vs scroll
    const target = e.target as HTMLElement;
    
    // Se tocou em um botão ou área de ação, não navega
    if (target.closest('button') || target.closest('[data-action]')) {
      return;
    }

    // Timeout para permitir que o scroll seja detectado primeiro
    setTimeout(() => {
      handleCardNavigation();
    }, 100);
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out",
        // Hover effects apenas no desktop
        "md:hover:shadow-md md:hover:-translate-y-1",
        "cursor-pointer",
        "w-full"
      )}
      onClick={handleClick}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {/* Image Section - Takes most space */}
      <ProductCardImage
        product={product}
      />

      {/* Content Section - Minimalist, below image */}
      <div className="flex flex-1 flex-col justify-between p-3">
        {/* Top part: Info + Price */}
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions (aligned bottom) */}
        <div className="mt-2 flex items-center justify-between">
          <ProductCardStock product={product} />
          <div data-action="true">
            <ProductCardActions
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
