
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
}

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  // Calcular preços
  const originalPrice = product.price * 1.2;
  const memberPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/produto/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product, selectedSize, selectedColor);
      
      toast({
        title: "✅ Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
        duration: 2000,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "❤️ Adicionado aos favoritos!",
      description: "Produto salvo na sua lista de desejos",
      duration: 2000,
    });
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer touch-manipulation"
      onClick={handleCardClick}
      style={{ touchAction: 'manipulation' }}
    >
      {/* RIG DEAL Badge */}
      {discount > 15 && (
        <div className="bg-green-700 text-white text-xs font-bold px-2 py-1 text-center">
          RIG DEAL
        </div>
      )}

      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
          }}
        />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
          onClick={handleWishlistClick}
        >
          <Heart className="w-3 h-3" />
        </Button>

        {/* Status apenas para esgotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        {/* Product Name */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Pricing - GameStop Style */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              R$ {product.price.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-xs text-gray-500 line-through">
                R$ {originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Member Price */}
          <div className="text-sm font-bold text-purple-600">
            R$ {memberPrice.toFixed(2)} for Pros
          </div>
        </div>

        {/* Platform Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs text-white px-2 py-1 rounded ${getPlatformColor(product.platform)}`}>
            {product.platform}
          </span>
          {product.category && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-bold py-2 text-xs transition-all duration-300 min-h-[32px] ${
            isOutOfStock 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {isOutOfStock ? 'Esgotado' : 'Add to Cart'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
