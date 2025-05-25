
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, Eye, Zap, Trophy, Clock, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';

interface PremiumProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
  priority?: boolean;
  className?: string;
}

const PremiumProductCard = ({ 
  product, 
  onAddToCart, 
  getPlatformColor, 
  priority = false,
  className = "" 
}: PremiumProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  // Pricing calculations
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const savings = originalPrice - product.price;

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
        cardRef.current.style.transform = 'scale(0.98)';
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transform = 'scale(1.02)';
            setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.style.transform = '';
              }
            }, 150);
          }
        }, 100);
      }

      toast({
        title: "🛒 Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho`,
        duration: 3000,
        className: "bg-success text-white border-none",
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

  const handleImageHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality would be implemented here
    toast({
      title: "🔍 Visualização Rápida",
      description: "Funcionalidade em desenvolvimento",
      duration: 2000,
    });
  };

  const primaryTag = product.tags?.[0]?.name || '';
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;
  const isUsedProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('usado')) || false;
  const isOnSale = discount > 10;
  const isBestSeller = product.tags?.some(tag => tag.name.toLowerCase().includes('bestseller')) || false;
  const isGift = product.tags?.some(tag => tag.name.toLowerCase().includes('gift')) || false;

  const getPlatformColorClass = () => {
    const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
    
    if (tags.some(tag => tag.includes('playstation'))) {
      return 'tag-platform-playstation';
    }
    if (tags.some(tag => tag.includes('xbox'))) {
      return 'tag-platform-xbox';
    }
    if (tags.some(tag => tag.includes('nintendo'))) {
      return 'tag-platform-nintendo';
    }
    if (tags.some(tag => tag.includes('pc'))) {
      return 'tag-platform-pc';
    }
    return 'bg-uti-blue text-white';
  };

  return (
    <div
      ref={cardRef}
      className={`card-product group cursor-pointer relative ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isOnSale && (
          <div className="tag-offer flex items-center gap-1">
            <Zap className="w-3 h-3" />
            -{discount}% OFF
          </div>
        )}
        {isNewProduct && (
          <div className="tag-new flex items-center gap-1">
            <Zap className="w-3 h-3" />
            NOVO
          </div>
        )}
        {isUsedProduct && (
          <div className="tag-used">
            USADO
          </div>
        )}
        {isBestSeller && (
          <div className="tag-premium bg-accessories text-white flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            BEST
          </div>
        )}
        {isGift && (
          <div className="tag-premium bg-warning text-white flex items-center gap-1">
            <Gift className="w-3 h-3" />
            GIFT
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="tag-premium bg-error text-white animate-pulse flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.stock}x
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-level-1 transition-all duration-300 hover:scale-110 hover:shadow-level-2 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Heart className={`w-5 h-5 transition-colors duration-300 ${
          isWishlisted ? 'fill-uti-red text-uti-red' : 'text-gray-system-500'
        }`} />
      </button>

      {/* Product Image with Advanced Hover Effects */}
      <div className="relative overflow-hidden aspect-square bg-gray-system-50">
        <img
          src={allImages[currentImageIndex]}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-contain transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop';
          }}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-system-200 animate-pulse flex items-center justify-center">
            <div className="loading-skeleton w-16 h-16 rounded-lg"></div>
          </div>
        )}

        {/* Multiple Images Indicator */}
        {allImages.length > 1 && (
          <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {allImages.map((_, index) => (
              <button
                key={index}
                onMouseEnter={() => handleImageHover(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-uti-red scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-uti-black/60 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            onClick={handleQuickView}
            className="bg-white/90 text-uti-black hover:bg-white font-medium py-2 px-4 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualização Rápida
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-uti-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-error text-white px-4 py-2 rounded-lg font-bold text-sm mb-2">
                ESGOTADO
              </div>
              <p className="text-xs opacity-80">Notifique-me quando chegar</p>
            </div>
          </div>
        )}

        {/* Platform Badge */}
        {primaryTag && (
          <div className={`absolute top-3 right-3 ${getPlatformColorClass()} text-xs font-medium px-2 py-1 rounded-md`}>
            {primaryTag}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Platform Tags */}
        <div className="flex items-center gap-2 mb-3">
          {primaryTag && (
            <span className={`${getPlatformColorClass()} text-xs font-medium px-2 py-1 rounded-md`}>
              {primaryTag}
            </span>
          )}
          {product.tags && product.tags.length > 1 && (
            <span className="text-xs text-gray-system-500 bg-gray-system-100 px-2 py-1 rounded-md font-medium">
              +{product.tags.length - 1}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-card-title text-uti-black line-clamp-2 mb-3 group-hover:text-uti-red transition-colors duration-300">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="w-4 h-4 fill-warning text-warning" 
              />
            ))}
          </div>
          <span className="text-sm text-gray-system-500 ml-1">(4.8)</span>
          <span className="text-xs text-gray-system-400 ml-auto">156 avaliações</span>
        </div>

        {/* Pricing */}
        <div className="mb-6 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-uti-red">
              R$ {product.price.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-sm text-gray-system-400 line-through">
                R$ {originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Savings Highlight */}
          {savings > 0 && (
            <div className="text-sm font-semibold text-success mb-2">
              Economize R$ {savings.toFixed(2)}
            </div>
          )}
          
          {/* Pro Price */}
          <div className="text-sm font-semibold text-accessories mb-2">
            R$ {proPrice.toFixed(2)} para Membros Pro
          </div>
          
          {/* Payment Options */}
          <div className="text-xs text-gray-system-500">
            ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="text-sm text-error font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              Produto Esgotado
            </span>
          ) : isLowStock ? (
            <span className="text-sm text-warning font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              Apenas {product.stock} em estoque
            </span>
          ) : (
            <span className="text-sm text-success font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Em estoque
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-3 text-sm transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-system-400 cursor-not-allowed text-white hover:bg-gray-system-400' 
              : 'btn-primary group-hover:shadow-glow-primary'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
      </div>

      {/* Premium Glow Effect on Hover */}
      <div className={`absolute inset-0 rounded-card transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-card bg-gradient-to-r from-uti-red/10 via-playstation/10 to-xbox/10 blur-xl"></div>
      </div>
    </div>
  );
};

export default PremiumProductCard;
