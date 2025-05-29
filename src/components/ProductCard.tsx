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
  // Update the prop type to expect the product object
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const { saveScrollPosition } = useScrollPosition();

  const handleCardNavigation = () => {
    saveScrollPosition();
    navigate(`/produto/${product.id}`);
  };

  // **Radical Redesign based on GameStop reference and user feedback**
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-card shadow-sm", // Lighter border (gray-200), consistent radius
        "transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1", // Subtle shadow and lift hover effect
        "cursor-pointer",
        "w-full" // Ensure card takes full width in its container (for carousel/grid)
        // Removed fixed width/height to allow flexibility in carousel/grid
      )}
      onClick={handleCardNavigation}
    >
      {/* Image Section - Takes most space */}
      <ProductCardImage
        product={product}
      />

      {/* Content Section - Minimalist, below image */}
      <div className="flex flex-1 flex-col justify-between p-3"> {/* Use padding, justify-between */}
        {/* Top part: Info + Price */}
        <div>
          {/* Ensure ProductCardInfo uses appropriate text sizes/styles */}
          <ProductCardInfo product={product} />
          {/* Ensure ProductCardProPrice highlights the PRO price effectively */}
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions (aligned bottom) */}
        <div className="mt-2 flex items-center justify-between"> {/* Align stock and actions */}
          <ProductCardStock product={product} />
          {/* Pass the product object to ProductCardActions */}
          <ProductCardActions
            product={product}
            onAddToCart={onAddToCart} // Pass the function that expects the product
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

