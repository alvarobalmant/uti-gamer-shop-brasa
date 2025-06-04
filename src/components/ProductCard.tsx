
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // No longer needed for navigation
import { Product } from '@/hooks/useProducts';
// import { useIsMobile } from '@/hooks/use-mobile'; // Keep if needed for other logic
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
  onCardClick: (productId: string) => void; // New prop to handle card click and open modal
}

const ProductCard = ({ product, onAddToCart, onCardClick }: ProductCardProps) => {
  // const navigate = useNavigate(); // Removed
  // const isMobile = useIsMobile(); // Keep if needed

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent modal opening if clicking on action buttons (like add to cart)
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    
    // Call the callback function passed from the parent to open the modal
    onCardClick(product.id);
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-card shadow-sm",
        "transition-all duration-300 ease-in-out",
        // Hover effects only on desktop
        "md:hover:shadow-md md:hover:-translate-y-1",
        "cursor-pointer", // Keep cursor pointer to indicate clickability
        "w-full"
      )}
      onClick={handleCardClick} // Use the modified handler
    >
      {/* Image Section */}
      <ProductCardImage
        product={product}
      />

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-3">
        {/* Top part: Info + Price */}
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        {/* Bottom part: Stock + Actions */}
        <div className="mt-2 flex items-center justify-between">
          <ProductCardStock product={product} />
          {/* Mark the actions container to prevent card click */}
          <div data-action="true">
            <ProductCardActions
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

