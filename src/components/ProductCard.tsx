
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

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
  const { saveCurrentPosition } = useScrollPosition();

  const isOutOfStock = product.stock === 0;

  const handleNavigation = () => {
    // Force save current scroll position before navigating
    saveCurrentPosition();
    
    // Small delay to ensure position is saved
    setTimeout(() => {
      navigate(`/produto/${product.id}`);
    }, 10);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNavigation();
  };

  // Enhanced mobile touch handling
  const handleCardTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNavigation();
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

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-full min-w-0
                 md:hover:shadow-lg hover:shadow-md"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      onClick={handleCardClick}
      onTouchEnd={handleCardTouch}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Product Image Container */}
      <div className="w-full max-w-full overflow-hidden">
        <ProductCardImage
          product={product}
          isWishlisted={isWishlisted}
          onWishlistClick={handleWishlistClick}
          onCardClick={handleCardClick}
          onCardTouch={handleCardTouch}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 w-full max-w-full min-w-0">
        <div className="w-full max-w-full overflow-hidden">
          <ProductCardInfo
            product={product}
            getPlatformColor={getPlatformColor}
          />
        </div>

        <div className="w-full max-w-full">
          <ProductCardPrice product={product} />
        </div>

        <div className="w-full max-w-full">
          <ProductCardStock product={product} />
        </div>

        <div className="w-full max-w-full">
          <ProductCardActions
            product={product}
            showButton={showButton}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
