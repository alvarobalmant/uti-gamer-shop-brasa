
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  getPlatformColor: (product: Product) => string;
}

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';
import MobileProductCard from './ProductCard/MobileProductCard';

// Export the Product type for other components to use
export type { Product } from '@/hooks/useProducts';

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Use mobile-optimized card on mobile devices
  if (isMobile) {
    return (
      <MobileProductCard
        product={product}
        onAddToCart={onAddToCart}
        getPlatformColor={getPlatformColor}
      />
    );
  }

  // Desktop version (existing implementation)
  const handleWishlistClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/produto/${product.id}`);
  };

  const handleCardTouch = (e: React.TouchEvent) => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
      onTouchEnd={handleCardTouch}
    >
      <ProductCardImage 
        product={product} 
        isWishlisted={isWishlisted}
        onWishlistClick={handleWishlistClick}
        onCardClick={handleCardClick}
        onCardTouch={handleCardTouch}
      />
      
      <div className="p-4 flex-1 flex flex-col">
        <ProductCardInfo product={product} getPlatformColor={getPlatformColor} />
        <ProductCardProPrice product={product} />
        <ProductCardStock product={product} />
        
        <div className="mt-auto">
          <ProductCardActions 
            product={product} 
            showButton={showButton}
            onAddToCart={handleAddToCart} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
