
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../ProductCard';

interface ProductCardImageProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistClick: (e: React.MouseEvent | React.TouchEvent) => void;
  onCardClick: (e: React.MouseEvent) => void;
  onCardTouch: (e: React.TouchEvent) => void;
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({
  product,
  isWishlisted,
  onWishlistClick,
  onCardClick,
  onCardTouch
}) => {
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;
  const isUsedProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('usado')) || false;
  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  // Pricing calculations for discount badge
  const originalPrice = product.price * 1.15;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const isOnSale = discount > 10;

  return (
    <div className="relative overflow-hidden">
      {/* Product Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 md:top-3 md:left-3 top-2 left-2">
        {isOnSale && (
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
            -{discount}%
          </div>
        )}
        {isNewProduct && (
          <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
            NOVO
          </div>
        )}
        {isUsedProduct && (
          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
            USADO
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
            <span className="md:inline hidden">Últimas unidades!</span>
            <span className="md:hidden inline">Últimas!</span>
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={onWishlistClick}
        onTouchEnd={onWishlistClick}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300
                   md:w-8 md:h-8 w-7 h-7 md:top-3 md:right-3 top-2 right-2 active:scale-95"
        style={{ touchAction: 'manipulation' }}
      >
        <Heart className={`w-4 h-4 md:w-4 md:h-4 w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105 md:h-56 h-40"
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
        }}
      />
      
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-sm text-xs md:px-4 px-3">
            ESGOTADO
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCardImage;
