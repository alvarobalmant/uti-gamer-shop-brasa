
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface Product {
  id: string; // Changed from number to string to match Supabase
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
    <Card className="group bg-white border border-gray-100 hover:border-red-200 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer">
      <CardContent className="p-0">
        <div 
          className="relative overflow-hidden"
          onClick={() => onProductClick?.(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Badges de Status */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-red-600 text-white font-bold text-xs px-3 py-1 shadow-lg">
              NOVO
            </Badge>
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 text-white font-bold text-xs px-3 py-1 shadow-lg animate-pulse">
                🔥 Apenas {product.stock} unidades!
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-500 text-white font-bold text-xs px-3 py-1 shadow-lg">
                ESGOTADO
              </Badge>
            )}
          </div>

          {product.platform && (
            <Badge className={`absolute top-3 right-3 ${getPlatformColor(product.platform)} text-white font-bold text-xs px-3 py-1 shadow-lg`}>
              {product.platform}
            </Badge>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Overlay com botão */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Ver Produto
            </Button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="space-y-4">
            {/* Tamanhos/Formatos */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`transition-all duration-200 font-medium ${
                      selectedSize === size 
                        ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cores */}
            {product.colors.length > 0 && (
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Cor:</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color);
                      }}
                      className={`transition-all duration-200 font-medium ${
                        selectedColor === color 
                          ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
                          : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <span className="text-3xl font-bold text-red-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <p className="text-xs text-gray-500 font-medium">À vista no PIX</p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOutOfStock) {
                    onAddToCart(product, selectedSize, selectedColor);
                  }
                }}
                disabled={isOutOfStock}
                className={`font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg ${
                  isOutOfStock 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/25'
                }`}
              >
                {isOutOfStock ? 'Esgotado' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
