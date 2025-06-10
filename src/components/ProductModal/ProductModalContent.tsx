
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

// Import subcomponents from ProductPage
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery';
import ProductInfo from '@/components/ProductPage/ProductInfo';
import ProductPricing from '@/components/ProductPage/ProductPricing';
import ProductOptions from '@/components/ProductPage/ProductOptions';
import ProductActions from '@/components/ProductPage/ProductActions';
import ProductDescription from '@/components/ProductPage/ProductDescription';
import RelatedProducts from './RelatedProducts';

interface ProductModalContentProps {
  product: Product;
  relatedProducts: Product[];
  currentProductId: string | null;
  isTransitioning: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  selectedCondition?: 'new' | 'pre-owned' | 'digital';
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  onConditionChange?: (condition: 'new' | 'pre-owned' | 'digital') => void;
  onSizeChange?: (size: string) => void;
  onColorChange?: (color: string) => void;
  onQuantityChange?: (quantity: number) => void;
  onRelatedProductClick?: (productId: string) => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
  product,
  relatedProducts,
  currentProductId,
  isTransitioning,
  scrollContainerRef,
  selectedCondition = 'new',
  selectedSize = '',
  selectedColor = '',
  quantity = 1,
  onConditionChange = () => {},
  onSizeChange = () => {},
  onColorChange = () => {},
  onQuantityChange = () => {},
  onRelatedProductClick = () => {}
}) => {
  const isMobile = useIsMobile();
  const { addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={cn(
        "h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
        "overscroll-behavior-y-contain",
        isTransitioning ? "opacity-0" : "opacity-100 transition-opacity duration-300",
        // Mantém padding original no mobile, aumentado no desktop
        isMobile ? "p-4" : "p-4 md:p-6 lg:p-8"
      )}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Top Section: Gallery + Info/Actions */}
      <div className={cn(
        "grid gap-4 mb-6",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 lg:gap-8 xl:gap-12"
      )}>
        {/* Left Column: Image Gallery */}
        <ProductImageGallery product={product} />

        {/* Right Column: Info, Pricing, Options, Actions */}
        <div className="flex flex-col space-y-3 lg:space-y-4">
          <ProductInfo product={product} />
          <ProductPricing
            product={product}
            selectedCondition={selectedCondition}
            onConditionChange={onConditionChange}
          />
          <ProductOptions
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            onSizeChange={onSizeChange}
            onColorChange={onColorChange}
            onQuantityChange={onQuantityChange}
          />
          <Separator className="my-2" />
          <ProductActions
            product={product}
            onAddToCart={handleAddToCart}
            isLoading={cartLoading}
          />
        </div>
      </div>

      {/* Bottom Section: Description */}
      <Separator className="mb-4 lg:mb-6" />
      <div className="grid grid-cols-1 gap-4 mb-6">
        <ProductDescription product={product} />
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        relatedProducts={relatedProducts}
        currentProductId={currentProductId}
        onRelatedProductClick={onRelatedProductClick}
      />
      
      {/* Extra bottom padding to ensure full scroll access */}
      <div className="h-8 lg:h-12" />
    </div>
  );
};

export default ProductModalContent;
