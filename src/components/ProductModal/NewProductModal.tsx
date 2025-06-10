import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductModalGallery from './ProductModalGallery';
import ProductModalInfo from './ProductModalInfo';
import ProductModalActions from './ProductModalActions';
import ProductModalFeatures from './ProductModalFeatures';
import ProductModalDescription from './ProductModalDescription';
import ProductModalRelated from './ProductModalRelated';

interface NewProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  loading?: boolean;
  relatedProducts?: Product[];
  onRelatedProductClick?: (productId: string) => void;
}

const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onOpenChange,
  product,
  loading = false,
  relatedProducts = [],
  onRelatedProductClick
}) => {
  const isMobile = useIsMobile();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const modalContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
          {product?.name || 'Produto'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="rounded-full h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : product ? (
          <div className="p-4 space-y-6">
            {/* Main Product Section */}
            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {/* Left: Gallery */}
              <ProductModalGallery
                product={product}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
              />

              {/* Right: Info & Actions */}
              <div className="space-y-4">
                <ProductModalInfo product={product} />
                <ProductModalActions product={product} onClose={handleClose} />
              </div>
            </div>

            {/* Features Section */}
            <ProductModalFeatures product={product} />

            {/* Description Section */}
            <ProductModalDescription product={product} />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <ProductModalRelated
                products={relatedProducts}
                onProductClick={onRelatedProductClick}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Produto não encontrado
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] p-0">
          {modalContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};

export default NewProductModal;

