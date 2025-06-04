import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Import new subcomponents
import ProductModalHeader from './ProductModal/ProductModalHeader';
import ProductModalSkeleton from './ProductModal/ProductModalSkeleton';
import ProductModalNotFound from './ProductModal/ProductModalNotFound';
import ProductModalContent from './ProductModal/ProductModalContent';
import { useProductModal } from './ProductModal/useProductModal';

interface ProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ productId, isOpen, onOpenChange }) => {
  const isMobile = useIsMobile();
  const { products, loading: productsLoading } = useProducts();
  
  const {
    product,
    relatedProducts,
    isTransitioning,
    isLoadingProduct,
    scrollContainerRef,
    selectedCondition,
    selectedSize,
    selectedColor,
    quantity,
    setSelectedCondition,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    handleRelatedProductClick
  } = useProductModal({ productId, isOpen, products, productsLoading });

  // Determine what to show based on loading states
  const shouldShowLoading = productsLoading || isLoadingProduct;
  const shouldShowNotFound = !shouldShowLoading && !product && productId;
  const shouldShowProduct = !shouldShowLoading && product;

  // Mobile version using Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="h-full w-full p-0 border-none bg-background fixed inset-0 z-50"
          style={{
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            borderRadius: 0,
            border: 'none'
          }}
        >
          {/* Custom Header with Close Button */}
          <ProductModalHeader 
            product={product}
            shouldShowLoading={shouldShowLoading}
          />

          {/* Content Area */}
          <div className="h-[calc(100vh-45px)]">
            {shouldShowLoading ? (
              <ProductModalSkeleton />
            ) : shouldShowProduct ? (
              <ProductModalContent
                product={product}
                relatedProducts={relatedProducts}
                currentProductId={productId}
                isTransitioning={isTransitioning}
                scrollContainerRef={scrollContainerRef}
                selectedCondition={selectedCondition}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                quantity={quantity}
                onConditionChange={setSelectedCondition}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
                onQuantityChange={setQuantity}
                onRelatedProductClick={handleRelatedProductClick}
              />
            ) : shouldShowNotFound ? (
              <ProductModalNotFound />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version using Dialog (unchanged)
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 border-none overflow-hidden",
          "sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw]",
          "max-h-[98vh]",
          "w-[95vw]"
        )}
        style={{
          maxWidth: '90vw',
          width: '90vw',
          maxHeight: '98vh'
        }}
      >
        {/* Custom Header with Close Button */}
        <ProductModalHeader 
          product={product}
          shouldShowLoading={shouldShowLoading}
        />

        {/* Content Area */}
        <div className="h-[calc(98vh-45px)]">
          {shouldShowLoading ? (
            <ProductModalSkeleton />
          ) : shouldShowProduct ? (
            <ProductModalContent
              product={product}
              relatedProducts={relatedProducts}
              currentProductId={productId}
              isTransitioning={isTransitioning}
              scrollContainerRef={scrollContainerRef}
              selectedCondition={selectedCondition}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              onConditionChange={setSelectedCondition}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onQuantityChange={setQuantity}
              onRelatedProductClick={handleRelatedProductClick}
            />
          ) : shouldShowNotFound ? (
            <ProductModalNotFound />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
