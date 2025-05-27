
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
  const [isImageError, setIsImageError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveCurrentPosition } = useScrollPosition();

  // Mobile interaction tracking premium
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const DRAG_THRESHOLD = 10;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock && product.stock <= 5;
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;

  // Pricing calculations premium
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

  // Touch handlers premium com feedback visual
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
    
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current && startPosRef.current) {
      e.preventDefault();
      handleNavigation();
    }
    
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
        className: "status-success",
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
      className: isWishlisted ? "status-warning" : "status-success",
    });
  };

  const primaryTag = product.tags?.[0]?.name || '';

  return (
    <div 
      className="card-premium w-full h-full flex flex-col group cursor-pointer"
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Image Container - Premium com Loading States */}
      <div className="relative overflow-hidden bg-neutral-light">
        {/* Badges Premium - Posicionamento Aprimorado */}
        <div className="absolute top-sm left-sm z-20 flex flex-col gap-xs">
          {hasDiscount && (
            <Badge className="bg-primary text-white font-bold px-sm py-xs text-xs rounded-lg shadow-lg animate-pulse">
              -{discount}%
            </Badge>
          )}
          {isNewProduct && (
            <Badge className="bg-green-600 text-white font-bold px-sm py-xs text-xs rounded-lg shadow-lg">
              NOVO
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-orange-500 text-white font-bold px-sm py-xs text-xs rounded-lg shadow-lg pulse-subtle">
              Últimas!
            </Badge>
          )}
        </div>

        {/* Wishlist Button Premium */}
        <button
          onClick={handleWishlistClick}
          onTouchEnd={handleWishlistClick}
          className="absolute top-sm right-sm z-20 touch-friendly bg-white/95 hover:bg-white 
                     rounded-full flex items-center justify-center shadow-lg
                     opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                     quick-transition hover:scale-110 active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <Heart className={`w-4 h-4 quick-transition ${isWishlisted ? 'fill-primary text-primary' : 'text-neutral-gray'}`} />
        </button>

        {/* Product Image Premium com Loading State */}
        <div className="aspect-square relative overflow-hidden">
          {!isImageLoaded && !isImageError && (
            <div className="absolute inset-0 loading-shimmer" />
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover smooth-transition group-hover:scale-110 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop';
              setIsImageError(true);
              setIsImageLoaded(true);
            }}
          />
          
          {/* Out of Stock Overlay Premium */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-neutral-dark text-white px-md py-sm rounded-xl font-bold text-sm shadow-xl">
                ESGOTADO
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info - Layout Premium */}
      <div className="space-md flex-1 flex flex-col">
        {/* Platform Tag Premium */}
        {primaryTag && (
          <div className="mb-sm">
            <Badge className={`${getPlatformColor(product)} text-white text-xs font-semibold px-sm py-xs rounded-lg shadow-md`}>
              {primaryTag}
            </Badge>
          </div>
        )}

        {/* Product Title Premium */}
        <h3 className="text-base sm:text-lg font-semibold text-neutral-dark line-clamp-2 mb-sm leading-tight flex-1 text-left">
          {product.name}
        </h3>

        {/* Rating Premium */}
        <div className="flex items-center gap-xs mb-md">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-neutral-gray ml-xs">(4.8)</span>
        </div>

        {/* Pricing Premium - Hierarquia Visual Aprimorada */}
        <div className="mb-md text-left">
          <div className="flex items-center gap-sm mb-xs">
            <span className="text-xl sm:text-2xl font-bold text-neutral-dark">
              R$ {product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-neutral-gray line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="text-sm font-medium text-secondary mb-xs">
            R$ {proPrice.toFixed(2)} Membros Pro
          </div>
          
          <div className="text-xs text-neutral-gray">
            ou 12x de R$ {(product.price / 12).toFixed(2)}
          </div>
        </div>

        {/* Stock Status Premium */}
        <div className="mb-md text-left">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium pulse-subtle">
              Restam {product.stock} unidades
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">Em estoque</span>
          )}
        </div>

        {/* Add to Cart Button Premium */}
        <Button
          onClick={handleAddToCart}
          onTouchEnd={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-sm text-sm rounded-xl quick-transition 
                     touch-friendly flex items-center justify-center gap-xs mt-auto
                     ${isOutOfStock 
                       ? 'bg-gray-400 cursor-not-allowed text-white opacity-50' 
                       : 'btn-premium'
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
