
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  tags?: { id: string; name: string; }[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
}

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveCurrentPosition } = useScrollPosition();

  // Mobile interaction tracking
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const DRAG_THRESHOLD = 10;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock && product.stock <= 5;
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;

  // Pricing calculations
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const hasDiscount = discount > 5;

  const handleNavigation = () => {
    saveCurrentPosition();
    setTimeout(() => {
      navigate(`/produto/${product.id}`);
    }, 10);
  };

  // Mobile touch handlers for precise interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startPosRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startPosRef.current.x);
    const deltaY = Math.abs(touch.clientY - startPosRef.current.y);
    
    // If movement exceeds threshold, consider it a drag
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Only navigate if it wasn't a drag gesture
    if (!isDraggingRef.current && startPosRef.current) {
      e.preventDefault();
      handleNavigation();
    }
    
    // Reset tracking
    startPosRef.current = null;
    isDraggingRef.current = false;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNavigation();
  };

  const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product, selectedSize, selectedColor);
      toast({
        title: "🛒 Produto adicionado!",
        description: "Item adicionado ao seu carrinho",
        duration: 2000,
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "💔 Removido dos favoritos" : "❤️ Adicionado aos favoritos!",
      description: isWishlisted ? "Produto removido da sua lista de desejos" : "Produto salvo na sua lista de desejos",
      duration: 2000,
    });
  };

  const primaryTag = product.tags?.[0]?.name || '';

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer transition-all duration-300 
                 hover:shadow-professional hover:-translate-y-1 hover:border-gray-300
                 w-full h-full flex flex-col"
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        {/* Refined Badges - Better Positioning */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge className="bg-red-600 text-white font-bold px-2.5 py-1 text-xs rounded-md shadow-md">
              -{discount}%
            </Badge>
          )}
          {isNewProduct && (
            <Badge className="bg-green-600 text-white font-bold px-2.5 py-1 text-xs rounded-md shadow-md">
              NOVO
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-orange-500 text-white font-bold px-2.5 py-1 text-xs rounded-md shadow-md">
              Últimas!
            </Badge>
          )}
        </div>

        {/* Wishlist Button - Refined Positioning */}
        <button
          onClick={handleWishlistClick}
          onTouchEnd={handleWishlistClick}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/95 hover:bg-white rounded-full 
                     flex items-center justify-center shadow-md transition-all duration-300
                     opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                     active:scale-95 hover:scale-105"
          style={{ touchAction: 'manipulation' }}
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
        </button>

        {/* Product Image - Perfect Proportions */}
        <div className="aspect-square relative overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop';
              setIsImageLoaded(true);
            }}
          />
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                ESGOTADO
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info - Improved Layout and Spacing */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Platform Tag - Better Positioning */}
        {primaryTag && (
          <div className="mb-3">
            <Badge className={`${getPlatformColor(product)} text-white text-xs font-semibold px-3 py-1 rounded-md`}>
              {primaryTag}
            </Badge>
          </div>
        )}

        {/* Product Title - Better Typography */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight flex-1 text-left">
          {product.name}
        </h3>

        {/* Rating - Consistent Alignment */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        {/* Pricing - Better Hierarchy */}
        <div className="mb-4 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              R$ {product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="text-sm font-medium text-purple-600 mb-1">
            R$ {proPrice.toFixed(2)} Membros Pro
          </div>
          
          <div className="text-xs text-gray-500">
            ou 12x de R$ {(product.price / 12).toFixed(2)}
          </div>
        </div>

        {/* Stock Status - Consistent Alignment */}
        <div className="mb-4 text-left">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium">
              Restam {product.stock} unidades
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">Em estoque</span>
          )}
        </div>

        {/* Add to Cart Button - Perfect Alignment */}
        <Button
          onClick={handleAddToCart}
          onTouchEnd={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-3 sm:py-4 text-sm sm:text-base rounded-lg transition-all duration-300 
                     min-h-[44px] sm:min-h-[50px] active:scale-95 flex items-center justify-center gap-2 mt-auto ${
            isOutOfStock 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:scale-105'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
