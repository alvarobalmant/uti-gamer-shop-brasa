
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
          // Base styling - Remove all default paddings and margins
          "p-0 border-none overflow-hidden",
          // Mobile specific (Drawer) - Complete coverage with no margins
          isMobile ? [
            "h-[100dvh] w-full", // Use dvh for better mobile support
            "bg-background",
            "fixed inset-0", // Ensure complete coverage
            "m-0", // Force no margins
            "rounded-none", // Remove any border radius that could show background
            "border-0" // Remove any borders
          ] : [
            // Desktop specific (Dialog) - Much larger and better scrolling
            "sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw]",
            "max-h-[98vh]", // Almost full height for maximum scroll area
            "w-[95vw]" // Ensure good width utilization
          ]
        )}
        style={isMobile ? {
          // Force remove any potential margins/padding on mobile
          margin: 0,
          padding: 0,
          backgroundColor: 'hsl(var(--background))',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0
        } : {
          // Desktop - ensure good positioning
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

        {/* Content Area - Optimized for both mobile and desktop */}
        <div className={cn(
          isMobile ? "h-[calc(100dvh-45px)]" : "h-[calc(98vh-45px)]"
        )}>
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
