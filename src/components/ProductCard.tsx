
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
    <Card className="group bg-white border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="relative overflow-hidden"
          onClick={() => onProductClick?.(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-red-600 text-white font-bold text-xs px-2 py-1 shadow-lg">
              NOVO
            </Badge>
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 text-white font-bold text-xs px-2 py-1 shadow-lg animate-pulse">
                🔥 {product.stock} restantes!
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-500 text-white font-bold text-xs px-2 py-1 shadow-lg">
                ESGOTADO
              </Badge>
            )}
          </div>

          {product.platform && (
            <Badge className={`absolute top-3 right-3 ${getPlatformColor(product.platform)} text-white font-bold text-xs px-2 py-1 shadow-lg`}>
              {product.platform}
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.stopPropagation();
              // Add wishlist functionality here
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Rating (placeholder) */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.8)</span>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
              </label>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`text-xs px-2 py-1 h-7 transition-all duration-200 ${
                      selectedSize === size 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                    }`}
                  >
                    {size}
                  </Button>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">+{product.sizes.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-red-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <p className="text-xs text-gray-500">À vista no PIX</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 line-through">R$ {(product.price * 1.2).toFixed(2)}</p>
                <p className="text-xs text-green-600 font-medium">17% OFF</p>
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
              className={`w-full font-bold py-2 text-sm rounded-lg transition-all duration-300 ${
                isOutOfStock 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
