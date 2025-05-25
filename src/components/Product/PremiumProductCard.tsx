
import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';

interface PremiumProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: () => string;
}

const PremiumProductCard = ({ product, onAddToCart, getPlatformColor }: PremiumProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = () => {
    // Save current scroll position before navigating
    sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    navigate(`/produto/${product.id}`, { state: { fromHome: true } });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const platformColorClass = getPlatformColor();

  return (
    <Card className="group cursor-pointer bg-white border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div onClick={handleProductClick}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Platform Badge */}
          {product.tags && product.tags.length > 0 && (
            <div className={`absolute top-3 left-3 ${platformColorClass} text-white px-2 py-1 rounded-full text-xs font-bold`}>
              {product.tags[0].name}
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 text-sm shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-red-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">(128)</span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-lg font-bold text-red-600">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">
              ou 10x de R$ {(product.price / 10).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PremiumProductCard;
