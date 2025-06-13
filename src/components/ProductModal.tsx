
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import ProductModalContent from './ProductModal/ProductModalContent';
import ProductModalSkeleton from './ProductModal/ProductModalSkeleton';
import ProductModalNotFound from './ProductModal/ProductModalNotFound';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  relatedProducts?: Product[];
  onRelatedProductClick?: (productId: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onOpenChange,
  onClose,
  relatedProducts = [],
  onRelatedProductClick
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product);
    toast({
      title: "Produto adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleWishlistToggle = () => {
    // Implement wishlist functionality
    toast({
      title: "Lista de desejos",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleShareClick = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description || '',
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "O link do produto foi copiado para a área de transferência.",
      });
    }
  };

  const handleFullscreenToggle = () => {
    // Implement fullscreen functionality
    console.log('Toggle fullscreen');
  };

  if (!product) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <ProductModalNotFound />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        
        <ProductModalContent
          product={product}
          relatedProducts={relatedProducts}
          currentProductId={product.id}
          isTransitioning={isTransitioning}
          scrollContainerRef={scrollContainerRef}
          onAddToCart={handleAddToCart}
          onClose={onClose}
          onWishlistToggle={handleWishlistToggle}
          onShareClick={handleShareClick}
          onFullscreenToggle={handleFullscreenToggle}
          onRelatedProductClick={onRelatedProductClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
