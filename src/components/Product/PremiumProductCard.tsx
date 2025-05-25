
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, Eye, Zap, Trophy, Clock, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';

interface PremiumProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
  priority?: boolean;
  variant?: 'default' | 'compact' | 'hero';
}

const PremiumProductCard = ({ 
  product, 
  onAddToCart, 
  getPlatformColor, 
  priority = false,
  variant = 'default'
}: PremiumProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  // Pricing calculations
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Product images
  const allImages = [product.image, ...(product.additional_images || [])];

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
      
      // Premium feedback animation
      if (cardRef.current) {
        cardRef.current.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transform = 'scale(1)';
          }
        }, 150);
      }

      toast({
        title: "🛒 Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho`,
        duration: 3000,
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
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
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;
  const isUsedProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('usado')) || false;
  const isOnSale = discount > 10;
  const isBestSeller = product.tags?.some(tag => tag.name.toLowerCase().includes('bestseller')) || false;

  // Responsive classes based on variant
  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer relative shadow-sm hover:shadow-xl hover:-translate-y-1";
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} group`;
      case 'hero':
        return `${baseClasses} group lg:flex lg:flex-row`;
      default:
        return `${baseClasses} group flex flex-col`;
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'compact':
        return "relative overflow-hidden aspect-square";
      case 'hero':
        return "relative overflow-hidden aspect-[4/3] lg:aspect-square lg:w-1/2";
      default:
        return "relative overflow-hidden aspect-[4/3] sm:aspect-square";
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'hero':
        return "p-4 sm:p-6 lg:w-1/2 lg:flex lg:flex-col lg:justify-center";
      default:
        return "p-4 sm:p-6 flex-1 flex flex-col";
    }
  };

  return (
    <div
      ref={cardRef}
      className={getCardClasses()}
      onClick={handleCardClick}
    >
      {/* Premium Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isOnSale && (
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg animate-pulse">
            -{discount}% OFF
          </div>
        )}
        {isNewProduct && (
          <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />
            NOVO
          </div>
        )}
        {isUsedProduct && (
          <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            USADO
          </div>
        )}
        {isBestSeller && (
          <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            BEST SELLER
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            ÚLTIMAS UNIDADES
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <Heart className={`w-5 h-5 transition-colors duration-300 ${
          isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'
        }`} />
      </button>

      {/* Product Image */}
      <div className={getImageClasses()}>
        <img
          src={allImages[currentImageIndex]}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop';
          }}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}

        {/* Image Navigation Dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {allImages.map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <Button
            onClick={handleCardClick}
            className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 font-semibold py-2 px-4 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/30"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm mb-2">
                ESGOTADO
              </div>
              <p className="text-xs opacity-80">Notifique-me quando chegar</p>
            </div>
          </div>
        )}

        {/* Play Button for Hero Variant */}
        {variant === 'hero' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={getContentClasses()}>
        {/* Platform Tags */}
        <div className="flex items-center gap-2 mb-3">
          {primaryTag && (
            <span className={`text-xs text-white px-3 py-1 rounded-lg font-bold ${getPlatformColor(product)}`}>
              {primaryTag}
            </span>
          )}
          {product.tags && product.tags.length > 1 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">
              +{product.tags.length - 1}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className={`text-gray-900 line-clamp-2 mb-3 group-hover:text-red-600 transition-colors duration-300 ${
          variant === 'hero' ? 'text-xl md:text-2xl font-bold' : 'text-base sm:text-lg font-semibold'
        }`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-500">(4.8)</span>
          <span className="text-xs text-gray-400 ml-auto hidden sm:block">156 avaliações</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 sm:mb-6 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className={`font-bold text-gray-900 ${
              variant === 'hero' ? 'text-2xl md:text-3xl' : 'text-xl sm:text-2xl'
            }`}>
              R$ {product.price.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-sm text-gray-500 line-through">
                R$ {originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Pro Price */}
          <div className="text-sm font-semibold text-purple-600 mb-2">
            R$ {proPrice.toFixed(2)} para Membros Pro
          </div>
          
          {/* Payment Options */}
          <div className="text-xs text-gray-500">
            ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">Produto Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium">Apenas {product.stock} em estoque</span>
          ) : (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Em estoque
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold transition-all duration-300 ${
            variant === 'hero' ? 'py-4 text-lg' : 'py-3 text-sm sm:text-base'
          } ${
            isOutOfStock 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

export default PremiumProductCard;
