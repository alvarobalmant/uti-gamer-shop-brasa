import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// Import subcomponents
import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  // getPlatformColor is likely not needed for the new design, remove if unused in subcomponents
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const { saveScrollPosition } = useScrollPosition();

  const handleCardNavigation = () => {
    saveScrollPosition();
    navigate(`/produto/${product.id}`);
  };

  // **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-card shadow-sm", // Use lighter gray border (like gray-200)
        "transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]", // Enhanced hover effect (shadow + scale)
        "cursor-pointer" // Ensure card is clickable
      )}
      onClick={handleCardNavigation}
    >
      {/* Image Section - Takes most space */}
      <ProductCardImage
        product={product}
        // Wishlist logic can be integrated here or kept separate if needed
      />

      {/* Content Section - Minimalist, below image */}
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-3"> {/* Reduced padding on mobile (p-2), keep p-3 for sm+ */}
        {/* Top part: Info + Price */}
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions (aligned bottom) */}
        <div className="mt-2 flex items-center justify-between"> {/* Align stock and actions */}
          <ProductCardStock product={product} />
          {/* Actions might be simplified or shown on hover depending on final design */}
          <ProductCardActions
            product={product}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

