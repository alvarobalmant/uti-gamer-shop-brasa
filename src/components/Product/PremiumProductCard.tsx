
import { useState } from 'react';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';

interface PremiumProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  getPlatformColor: (product: Product) => string;
  priority?: boolean;
  variant?: 'default' | 'compact';
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
  const [imageLoading, setImageLoading] = useState(true);
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product, selectedSize, selectedColor);
      toast({
        title: "✅ Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho`,
        duration: 2000,
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

  return (
    <div className="card-product-premium group animate-fade-in-premium">
      {/* Product Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {isOnSale && (
          <div className="tag-offer-premium font-semibold">
            -{discount}%
          </div>
        )}
        {isNewProduct && (
          <div className="tag-new-premium font-semibold">
            NOVO
          </div>
        )}
        {isUsedProduct && (
          <div className="tag-used-premium font-semibold">
            USADO
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="tag-premium bg-orange-100 text-orange-800 font-semibold animate-pulse">
            Últimas {product.stock}!
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white hover:bg-uti-gray-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus-premium"
        style={{ boxShadow: 'var(--shadow-premium-sm)' }}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-uti-red text-uti-red' : 'text-uti-gray-600'}`} />
      </button>

      {/* Product Image */}
      <div 
        className="relative overflow-hidden cursor-pointer bg-uti-gray-50"
        onClick={handleCardClick}
      >
        {imageLoading && (
          <div className="absolute inset-0 bg-uti-gray-50 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-uti-gray-300 border-t-uti-red animate-spin"></div>
          </div>
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className={`w-full transition-all duration-500 group-hover:scale-105 ${
            variant === 'compact' ? 'h-40' : 'h-48 md:h-56'
          } object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            setImageLoading(false);
          }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleCardClick}
            className="btn-secondary-premium text-sm px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="bg-uti-gray-900 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Platform Tag */}
        {primaryTag && (
          <div className="mb-3">
            <span className="tag-premium bg-uti-gray-100 text-uti-gray-600 text-xs">
              {primaryTag}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 
          className="text-card-title line-clamp-2 mb-3 group-hover:text-uti-red transition-colors duration-300 cursor-pointer" 
          onClick={handleCardClick}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-uti-gray-600 ml-1">(4.8)</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-semibold text-uti-black">
              R$ {product.price.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-sm text-uti-gray-600 line-through">
                R$ {originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Pro Price */}
          <div className="text-sm font-medium text-purple-600 mb-1">
            R$ {proPrice.toFixed(2)} no UTI Pro
          </div>
          
          {/* Payment Options */}
          <div className="text-xs text-uti-gray-600">
            ou 12x de R$ {(product.price / 12).toFixed(2)}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">Produto Esgotado</span>
          ) : isLowStock ? (
            <span className="text-sm text-orange-600 font-medium">Apenas {product.stock} em estoque</span>
          ) : (
            <span className="text-sm text-green-600 font-medium">Em estoque</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-medium py-3 text-sm transition-all duration-300 focus-premium ${
            isOutOfStock 
              ? 'bg-uti-gray-300 text-uti-gray-600 cursor-not-allowed' 
              : 'btn-primary-premium group-hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2 inline" />
          {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
};

export default PremiumProductCard;
