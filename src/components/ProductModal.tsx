
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';
import ProductModalContent from './ProductModal/ProductModalContent';
import ProductModalSkeleton from './ProductModal/ProductModalSkeleton';
import ProductModalNotFound from './ProductModal/ProductModalNotFound';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  productId?: string | null;
  product?: Product | null;
  loading?: boolean;
  relatedProducts?: Product[];
  onRelatedProductClick?: (productId: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  productId,
  product,
  loading = false,
  relatedProducts = [],
  onRelatedProductClick
}) => {
  if (!isOpen) return null;

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {loading ? (
          <ProductModalSkeleton />
        ) : product ? (
          <ProductModalContent 
            product={product}
            relatedProducts={relatedProducts}
            currentProductId={product.id}
            isTransitioning={false}
            scrollContainerRef={null}
            onRelatedProductClick={onRelatedProductClick}
            onClose={onClose}
            onShareProduct={() => {}}
            onToggleFavorite={() => {}}
            isFavorite={false}
          />
        ) : (
          <ProductModalNotFound />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
