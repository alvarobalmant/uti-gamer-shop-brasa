
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
    <div className="card-product group">
      {/* Product Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isOnSale && (
          <div className="bg-uti-red text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{discount}%
          </div>
        )}
        {isNewProduct && (
          <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            NOVO
          </div>
        )}
        {isUsedProduct && (
          <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            USADO
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
            Últimas unidades!
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-uti-red text-uti-red' : 'text-gray-600'}`} />
      </button>

      {/* Product Image */}
      <div 
        className="relative overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
          }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={handleCardClick}
            className="bg-white text-uti-dark hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Platform Tags */}
        <div className="flex items-center gap-2 mb-3">
          {primaryTag && (
            <span className={`text-xs text-white px-2 py-1 rounded-md font-medium ${getPlatformColor(product)}`}>
              {primaryTag}
            </span>
          )}
          {product.tags && product.tags.length > 1 && (
            <span className="text-xs text-uti-gray bg-gray-100 px-2 py-1 rounded-md font-medium">
              +{product.tags.length - 1}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-card-title font-heading text-uti-dark line-clamp-2 mb-3 group-hover:text-uti-red transition-colors duration-300 cursor-pointer" onClick={handleCardClick}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-uti-gray ml-1">(4.8)</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-bold text-uti-dark">
              R$ {product.price.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-sm text-uti-gray line-through">
                R$ {originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Pro Price */}
          <div className="text-sm font-semibold text-purple-600 mb-1">
            R$ {proPrice.toFixed(2)} para Membros Pro
          </div>
          
          {/* Payment Options */}
          <div className="text-xs text-uti-gray">
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
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-3 text-sm transition-all duration-300 ${
            isOutOfStock 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'btn-primary group-hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
