
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';

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

// Export the Product type for other components to use
export type { Product } from '@/hooks/useProducts';

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showButton, setShowButton] = useState(false);

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
    // Navigate to product page
    navigate(`/produto/${product.id}`);
  };

  const handleCardTouch = (e: React.TouchEvent) => {
    // Handle touch events for mobile navigation
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
