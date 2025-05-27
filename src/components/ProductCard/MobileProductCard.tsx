
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface MobileProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  getPlatformColor: (product: Product) => string;
}

const MobileProductCard = ({ product, onAddToCart, getPlatformColor }: MobileProductCardProps) => {
  const navigate = useNavigate();
  const { hasActiveSubscription, getDiscountPercentage } = useSubscriptions();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isProMember = hasActiveSubscription();
  const discountPercentage = getDiscountPercentage();
  const proPrice = product.price * (1 - discountPercentage / 100);
  const originalPrice = product.price * 1.15;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock && product.stock <= 5;
  const primaryTag = product.tags?.[0]?.name || '';
  
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

  const handleCardClick = () => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer active:scale-[0.98]"
      onClick={handleCardClick}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {originalPrice > product.price && (
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Últimas!
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-bold text-sm">
              ESGOTADO
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Platform Tag */}
        {primaryTag && (
          <div className="mb-2">
            <span className={`text-xs text-white px-2 py-1 rounded-md font-medium ${getPlatformColor(product)}`}>
              {primaryTag}
            </span>
          </div>
        )}

        {/* Product Title */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          {/* UTI PRO Price for members */}
          {isProMember && (
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-2 mb-2">
              <div className="text-xs font-bold text-yellow-800 mb-1">PREÇO UTI PRO</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-yellow-800">
                  R$ {proPrice.toFixed(2)}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded font-medium">
                  -{discountPercentage}%
                </span>
              </div>
            </div>
          )}

          {/* Regular Price */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-lg font-bold ${isProMember ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              R$ {product.price.toFixed(2)}
            </span>
            {!isProMember && originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Pro price teaser for non-members */}
          {!isProMember && (
            <div className="text-sm font-medium text-purple-600 mb-1">
              R$ {proPrice.toFixed(2)} Membros PRO
            </div>
          )}
          
          {/* Installments */}
          <div className="text-xs text-gray-500">
            ou 12x de R$ {((isProMember ? proPrice : product.price) / 12).toFixed(2)}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium">
              Restam {product.stock}
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">Em estoque</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full font-semibold py-3 text-sm rounded-lg transition-all duration-300 active:scale-95 min-h-[48px] ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Esgotado' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileProductCard;
