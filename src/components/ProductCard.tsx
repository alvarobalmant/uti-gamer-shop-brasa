
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

  return (
    <Card className="group bg-white border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col rounded-xl shadow-sm">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="relative overflow-hidden"
          onClick={() => onProductClick?.(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-red-600 text-white font-bold text-xs px-3 py-1 shadow-lg rounded-full">
              NOVO
            </Badge>
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 text-white font-bold text-xs px-3 py-1 shadow-lg animate-pulse rounded-full">
                🔥 {product.stock} restantes!
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-500 text-white font-bold text-xs px-3 py-1 shadow-lg rounded-full">
                ESGOTADO
              </Badge>
            )}
          </div>

          {product.platform && (
            <Badge className={`absolute top-3 right-3 ${getPlatformColor(product.platform)} text-white font-bold text-xs px-3 py-1 shadow-lg rounded-full`}>
              {product.platform}
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Add wishlist functionality here
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 flex flex-col flex-1 space-y-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] leading-tight">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.slice(0, 3).map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`text-xs px-3 py-2 h-8 transition-all duration-200 font-medium min-w-[60px] ${
                      selectedSize === size 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'border-gray-300 text-gray-700 bg-white hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {size}
                  </Button>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-2 flex items-center">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  R$ {product.price.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500">À vista no PIX</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 line-through">R$ {(product.price * 1.2).toFixed(2)}</p>
                <p className="text-xs text-red-600 font-semibold">17% OFF</p>
              </div>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) {
                  onAddToCart(product, selectedSize, selectedColor);
                }
              }}
              disabled={isOutOfStock}
              className={`w-full font-bold py-3 text-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg min-h-[48px] ${
                isOutOfStock 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
