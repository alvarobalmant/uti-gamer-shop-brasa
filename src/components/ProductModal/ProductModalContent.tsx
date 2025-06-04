
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onConditionChange: (condition: 'new' | 'pre-owned' | 'digital') => void;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
  onRelatedProductClick: (productId: string) => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
  product,
  relatedProducts,
  currentProductId,
  isTransitioning,
  scrollContainerRef,
  selectedCondition,
  selectedSize,
  selectedColor,
  quantity,
  onConditionChange,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onRelatedProductClick
}) => {
  const { addToCart, loading: cartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className={cn(
        "p-4 md:p-6 lg:p-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300",
        isTransitioning ? "opacity-0" : "opacity-100 transition-opacity duration-300"
      )}
    >
      {/* Top Section: Gallery + Info/Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8">
        {/* Left Column: Image Gallery */}
        <ProductImageGallery product={product} />

        {/* Right Column: Info, Pricing, Options, Actions */}
        <div className="flex flex-col space-y-4">
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
      <Separator className="mb-6" />
      <div className="grid grid-cols-1 gap-8">
        <div>
          <ProductDescription product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        relatedProducts={relatedProducts}
        currentProductId={currentProductId}
        onRelatedProductClick={onRelatedProductClick}
      />
    </div>
  );
};

export default ProductModalContent;
