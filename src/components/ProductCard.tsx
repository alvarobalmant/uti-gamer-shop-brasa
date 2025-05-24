
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  platform: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  getPlatformColor: (platform: string) => string;
}

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10 backdrop-blur-sm group">
      <CardContent className="p-6">
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <Badge className={`absolute top-2 right-2 ${getPlatformColor(product.platform)} text-white font-semibold shadow-lg`}>
            {product.platform}
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="space-y-4">
          {/* Sizes */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              {product.sizes[0] === 'Físico' || product.sizes[0] === 'Digital' ? 'Formato:' : 'Tamanho:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className={`transition-all duration-200 ${
                    selectedSize === size 
                      ? 'bg-green-500 text-white shadow-lg scale-105' 
                      : 'border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400'
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Cor:</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`transition-all duration-200 ${
                      selectedColor === color 
                        ? 'bg-purple-500 text-white shadow-lg scale-105' 
                        : 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400'
                    }`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                R$ {product.price.toFixed(2)}
              </span>
              <p className="text-xs text-gray-500">À vista no PIX</p>
            </div>
            <Button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Adicionar ao Pedido
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
