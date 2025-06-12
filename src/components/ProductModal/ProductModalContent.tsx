
import React from 'react';
import { Product } from '@/hooks/useProducts';
import ProductModalHeader from './ProductModalHeader';
import ProductModalGallery from './ProductModalGallery';
import ProductModalInfo from './ProductModalInfo';
import ProductModalDescription from './ProductModalDescription';
import ProductModalFeatures from './ProductModalFeatures';
import ProductModalActions from './ProductModalActions';
import RelatedProducts from './RelatedProducts';

interface ProductModalContentProps {
  product: Product;
  relatedProducts: Product[];
  currentProductId: string;
  isTransitioning: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement> | null;
  onAddToCart: () => void;
  onClose: () => void;
  onWishlistToggle: () => void;
  onShareClick: () => void;
  onFullscreenToggle: () => void;
  onRelatedProductClick?: (productId: string) => void;
}

const ProductModalContent: React.FC<ProductModalContentProps> = ({
  product,
  relatedProducts,
  currentProductId,
  isTransitioning,
  scrollContainerRef,
  onAddToCart,
  onClose,
  onWishlistToggle,
  onShareClick,
  onFullscreenToggle,
  onRelatedProductClick
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <ProductModalGallery 
        product={product}
        onFullscreenToggle={onFullscreenToggle}
      />
      
      <div className="space-y-6">
        <ProductModalHeader 
          product={product}
          onClose={onClose}
          onWishlistToggle={onWishlistToggle}
          onShareClick={onShareClick}
        />
        
        <ProductModalInfo product={product} />
        
        <ProductModalActions 
          product={product}
          onAddToCart={onAddToCart}
        />
        
        <ProductModalDescription product={product} />
        
        <ProductModalFeatures product={product} />
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="col-span-full">
          <RelatedProducts 
            products={relatedProducts}
            currentProductId={currentProductId}
            onProductClick={onRelatedProductClick}
          />
        </div>
      )}
    </div>
  );
};

export default ProductModalContent;
