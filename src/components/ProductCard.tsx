
import React, { useRef } from 'react';
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
  
  // Variáveis para rastrear eventos de toque
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handleCardNavigation = () => {
    navigate(`/produto/${product.id}`);
  };

  // Manipulador de início de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  // Manipulador de fim de toque
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current.time) return;
    
    const touchTime = Date.now() - touchStartRef.current.time;
    
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    const isValidTap = touchTime < 300 && deltaX < 10 && deltaY < 10;
    
    if (isValidTap) {
      e.preventDefault();
      handleCardNavigation();
    }
    
    touchStartRef.current = { x: 0, y: 0, time: 0 };
  };

  const handleClick = () => {
    handleCardNavigation();
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out",
        // Remover hover effects no mobile, aplicar apenas no desktop (md e acima)
        "md:hover:shadow-md md:hover:-translate-y-1",
        "cursor-pointer",
        "w-full"
      )}
      onClick={handleClick}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      style={{ touchAction: 'pan-y' }}
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
          <ProductCardActions
            product={product}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
