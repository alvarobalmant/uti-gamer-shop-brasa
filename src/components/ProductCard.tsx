
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const [showButton, setShowButton] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  
  // Pricing calculations
  const originalPrice = product.price * 1.15;
  const proPrice = product.price * 0.95;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/produto/${product.id}`);
  };

  // Enhanced mobile touch handling
  const handleCardTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/produto/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product, selectedSize, selectedColor);
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
  const isNewProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('novo')) || false;
  const isUsedProduct = product.tags?.some(tag => tag.name.toLowerCase().includes('usado')) || false;
  const isOnSale = discount > 10;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer
                 md:p-0 p-0 md:hover:shadow-lg hover:shadow-md"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      onClick={handleCardClick}
      onTouchEnd={handleCardTouch}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        {/* Product Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 md:top-3 md:left-3 top-2 left-2">
          {isOnSale && (
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
              -{discount}%
            </div>
          )}
          {isNewProduct && (
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
              NOVO
            </div>
          )}
          {isUsedProduct && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
              USADO
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full md:text-xs text-[10px] md:px-2 px-1.5">
              <span className="md:inline hidden">Últimas unidades!</span>
              <span className="md:hidden inline">Últimas!</span>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          onTouchEnd={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300
                     md:w-8 md:h-8 w-7 h-7 md:top-3 md:right-3 top-2 right-2 active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <Heart className={`w-4 h-4 md:w-4 md:h-4 w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105 md:h-56 h-40"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-sm text-xs md:px-4 px-3">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-4 p-3">
        {/* Platform Tag */}
        {primaryTag && (
          <div className="mb-3 md:mb-3 mb-2">
            <span className={`text-xs text-white px-2 py-1 rounded-md font-medium ${getPlatformColor(product)} md:text-xs text-[10px] md:px-2 px-1.5`}>
              {primaryTag}
            </span>
          </div>
        )}

        {/* Product Title */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight md:text-base text-sm md:mb-3 mb-2 md:leading-tight leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 md:mb-4 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400 md:w-3 md:h-3 w-2.5 h-2.5" />
          ))}
          <span className="text-xs text-gray-500 ml-1 md:text-xs text-[10px]">(4.8)</span>
        </div>

        {/* Pricing Block */}
        <div className="mb-4 md:mb-4 mb-3">
          {/* Main Price */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900 md:text-xl text-lg">
              R$ {product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through md:text-sm text-xs">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Pro Price */}
          <div className="text-sm font-medium text-purple-600 mb-1 md:text-sm text-xs">
            R$ {proPrice.toFixed(2)} Membros Pro
          </div>
          
          {/* Installments */}
          <div className="text-xs text-gray-500 md:text-xs text-[10px]">
            ou 12x de R$ {(product.price / 12).toFixed(2)}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4 md:mb-4 mb-3">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium md:text-sm text-xs">Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium md:text-sm text-xs">
              <span className="md:inline hidden">Restam {product.stock} unidades</span>
              <span className="md:hidden inline">Restam {product.stock}</span>
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium md:text-sm text-xs">Em estoque</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className={`transition-all duration-300 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} md:opacity-0 md:group-hover:opacity-100 opacity-100 translate-y-0`}>
          <Button
            onClick={handleAddToCart}
            onTouchEnd={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full font-semibold py-3 text-sm rounded-lg transition-all duration-300 active:scale-95 md:py-3 py-3.5 md:text-sm text-xs min-h-[44px] ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <ShoppingCart className="w-4 h-4 mr-2 md:w-4 md:h-4 w-3.5 h-3.5" />
            <span className="md:inline hidden">{isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
            <span className="md:hidden inline">{isOutOfStock ? 'Esgotado' : 'Adicionar'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
