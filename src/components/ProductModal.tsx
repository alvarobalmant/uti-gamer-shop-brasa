
import React, { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"; // Use Drawer for mobile
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Import and adapt subcomponents from ProductPage
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery';
import ProductInfo from '@/components/ProductPage/ProductInfo';
import ProductPricing from '@/components/ProductPage/ProductPricing';
import ProductOptions from '@/components/ProductPage/ProductOptions';
import ProductActions from '@/components/ProductPage/ProductActions';
import ProductDescription from '@/components/ProductPage/ProductDescription';
import RelatedProducts from '@/components/ProductPage/RelatedProducts';
import { Separator } from '@/components/ui/separator';

interface ProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ productId, isOpen, onOpenChange }) => {
  const isMobile = useIsMobile();
  const { products, loading: productsLoading } = useProducts();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);

  // State for product options (similar to ProductPage)
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when productId changes and modal is open
  useEffect(() => {
    if (isOpen && productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
      // Reset and set default options if product found
      if (foundProduct) {
        setSelectedCondition(foundProduct.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
        setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
        setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
        setQuantity(1);
      } else {
        // Reset if product not found (or ID is null)
        setProduct(null);
      }
    } else if (!isOpen) {
      // Optionally reset product when modal closes to prevent stale data flash
      // setProduct(null);
    }
  }, [isOpen, productId, products]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
    // Maybe close modal after adding? Or show success message?
    // onOpenChange(false); 
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 h-full overflow-y-auto">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-10 w-1/2 rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );

  const renderNotFound = () => (
    <div className="flex flex-col items-center justify-center text-center p-6 h-full">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Produto Não Encontrado</h2>
      <p className="text-muted-foreground mb-6">Não conseguimos encontrar os detalhes deste produto.</p>
      <DrawerClose asChild>
         <Button variant="outline">Fechar</Button>
      </DrawerClose>
    </div>
  );

  const renderProductContent = () => {
    if (!product) return null; // Should be handled by loading/not found states

    return (
      <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300">
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
              onConditionChange={setSelectedCondition}
            />
            <ProductOptions
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onQuantityChange={setQuantity}
            />
            <Separator className="my-2" />
            <ProductActions
              product={product}
              onAddToCart={handleAddToCart}
              isLoading={cartLoading}
            />
          </div>
        </div>

        {/* Bottom Section: Description + Related Products */}
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 gap-8">
           {/* Removed lg:grid-cols-3 and lg:col-span-2 for simplicity in modal */}
          <div>
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Related products might be too much for a modal, consider removing or simplifying */}
        {/* <Separator className="my-8" />
        <RelatedProducts product={product} /> */}
      </div>
    );
  };

  const ModalComponent = isMobile ? Drawer : Dialog;
  const ModalContentComponent = isMobile ? DrawerContent : DialogContent;

  return (
    <ModalComponent open={isOpen} onOpenChange={onOpenChange}>
      <ModalContentComponent
        className={cn(
          // Base styling for both Dialog and Drawer
          "p-0 border-none overflow-hidden",
          // Desktop specific (Dialog)
          "sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl", // Control max width
          "h-[90vh] max-h-[90vh]", // Control height
          // Mobile specific (Drawer)
          "h-[90%]" // Drawer takes 90% height from bottom
        )}
      >
        {/* Custom Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold truncate pr-4">
            {product ? product.name : productsLoading ? 'Carregando...' : 'Produto'}
          </h2>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogClose>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-65px)]"> {/* Adjust height based on header height */}
          {productsLoading ? (
            renderLoadingSkeleton()
          ) : product ? (
            renderProductContent()
          ) : (
            renderNotFound()
          )}
        </div>

      </ModalContentComponent>
    </ModalComponent>
  );
};

export default ProductModal;

