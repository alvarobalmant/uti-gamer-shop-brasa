
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';
import ProductModalContent from './ProductModal/ProductModalContent';
import ProductModalSkeleton from './ProductModal/ProductModalSkeleton';
import ProductModalNotFound from './ProductModal/ProductModalNotFound';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  product?: Product;
  loading?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  product,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {loading ? (
          <ProductModalSkeleton />
        ) : product ? (
          <ProductModalContent product={product} onClose={onClose} />
        ) : (
          <ProductModalNotFound onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
