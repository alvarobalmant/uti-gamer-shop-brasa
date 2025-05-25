
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  platform: string;
  category: string;
  stock?: number;
  created_at?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  getPlatformColor: (platform: string) => string;
  onProductClick?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, getPlatformColor, onProductClick }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleCardClick = () => {
    onProductClick?.(product);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product, selectedSize, selectedColor);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add wishlist functionality here
  };

  return (
    <Card 
      className="mobile-product-card h-full flex flex-col group cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 sm:h-40 object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className="bg-red-600 text-white font-bold text-xs px-2 py-1 rounded-full">
              NOVO
            </Badge>
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 text-white font-bold text-xs px-2 py-1 animate-pulse rounded-full">
                🔥 {product.stock} restantes!
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                ESGOTADO
              </Badge>
            )}
          </div>

          {product.platform && (
            <Badge className={`absolute top-2 right-2 ${getPlatformColor(product.platform)} text-white font-bold text-xs px-2 py-1 rounded-full`}>
              {product.platform}
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
            onClick={handleWishlistClick}
          >
            <Heart className="w-3 h-3" />
          </Button>
        </div>

        <div className="p-3 flex flex-col flex-1 space-y-2">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">
                {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
              </label>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 2).map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`text-xs px-2 py-1 h-6 transition-all duration-200 font-medium ${
                      selectedSize === size 
                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                        : 'border-gray-300 text-gray-700 bg-white hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {size}
                  </Button>
                ))}
                {product.sizes.length > 2 && (
                  <span className="text-xs text-gray-500 px-1 py-1 flex items-center">+{product.sizes.length - 2}</span>
                )}
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-lg font-bold text-red-600">
                  R$ {product.price.toFixed(2)}
                </div>
                <p className="text-xs text-gray-400 line-through">R$ {(product.price * 1.2).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-600 font-semibold">17% OFF</p>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-bold py-2 text-xs transition-all duration-300 min-h-[32px] ${
                isOutOfStock 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <ShoppingCart className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {isOutOfStock ? 'Esgotado' : 'Adicionar'}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
