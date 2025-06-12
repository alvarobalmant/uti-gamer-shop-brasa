
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface PlatformProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
}

const PlatformProductCard: React.FC<PlatformProductCardProps> = ({
  product,
  onAddToCart,
  onProductClick,
  variant = 'default'
}) => {
  const imageUrl = product.image || '/placeholder.svg';
  const isOnSale = product.list_price && product.price < product.list_price;
  const originalPrice = product.list_price;
  const isFeatured = product.is_featured;
  const rating = product.rating;

  const handleCardClick = () => {
    onProductClick(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge_visible && product.badge_text && (
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: product.badge_color || '#ef4444', color: 'white' }}
              className="text-xs font-medium"
            >
              {product.badge_text}
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="default" className="bg-yellow-500 text-white text-xs">
              Destaque
            </Badge>
          )}
          {isOnSale && (
            <Badge variant="destructive" className="text-xs">
              Oferta
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        {rating && rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({rating.toFixed(1)})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {isOnSale && originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              R$ {originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-green-600">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        
        {/* Pro Price */}
        {product.pro_price && (
          <div className="mb-3">
            <span className="text-sm text-purple-600 font-medium">
              UTI PRO: R$ {product.pro_price.toFixed(2)}
            </span>
          </div>
        )}
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
          size="sm"
        >
          Adicionar ao Carrinho
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlatformProductCard;
