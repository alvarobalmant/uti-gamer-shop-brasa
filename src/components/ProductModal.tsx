
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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

  const ModalComponent = isMobile ? Drawer : Dialog;
  const ModalContentComponent = isMobile ? DrawerContent : DialogContent;

  // Determine what to show based on loading states
  const shouldShowLoading = productsLoading || isLoadingProduct;
  const shouldShowNotFound = !shouldShowLoading && !product && productId;
  const shouldShowProduct = !shouldShowLoading && product;

  return (
    <ModalComponent open={isOpen} onOpenChange={onOpenChange}>
      <ModalContentComponent
        className={cn(
          // Base styling for both Dialog and Drawer
          "p-0 border-none overflow-hidden",
          // Desktop specific (Dialog) - Increased max height for better scrolling
          "sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl",
          "max-h-[95vh]", // Increased from 90vh to 95vh for more content space
          // Mobile specific (Drawer) - Remove black margins
          isMobile ? "h-[98%] bg-background" : "" // Increased height and explicit background
        )}
        style={isMobile ? {
          // Remove any black margins on mobile
          margin: 0,
          backgroundColor: 'hsl(var(--background))'
        } : {}}
      >
        {/* Custom Header with Close Button */}
        <ProductModalHeader 
          product={product}
          shouldShowLoading={shouldShowLoading}
        />

        {/* Content Area */}
        <div className="h-[calc(100%-45px)]">
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

      </ModalContentComponent>
    </ModalComponent>
  );
};

export default ProductModal;
