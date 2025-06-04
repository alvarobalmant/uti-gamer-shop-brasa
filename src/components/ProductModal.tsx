import React, { useState, useEffect } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer"; // Use Drawer for mobile
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Import and adapt subcomponents from ProductPage
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery';
import ProductInfo from '@/components/ProductPage/ProductInfo';
import ProductPricing from '@/components/ProductPage/ProductPricing';
import ProductOptions from '@/components/ProductPage/ProductOptions';
import ProductActions from '@/components/ProductPage/ProductActions';
import ProductDescription from '@/components/ProductPage/ProductDescription';
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false); // New state for product loading

  // State for product options (similar to ProductPage)
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch product details when productId changes and modal is open
  useEffect(() => {
    if (isOpen && productId && products.length > 0) {
      console.log('Loading product with ID:', productId);
      setIsLoadingProduct(true); // Set loading state
      
      const foundProduct = products.find(p => p.id === productId);
      
      if (foundProduct) {
        setIsTransitioning(true);
        
        // Short delay for transition effect when changing products
        setTimeout(() => {
          setProduct(foundProduct);
          
          // Reset and set default options
          setSelectedCondition(foundProduct.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
          setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
          setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
          setQuantity(1);
          
          // Find related products
          findRelatedProducts(foundProduct);
          
          setIsTransitioning(false);
          setIsLoadingProduct(false); // Clear loading state
          console.log('Product loaded successfully:', foundProduct.name);
        }, 300);
      } else {
        // Product not found after a delay - this means it's actually missing
        setTimeout(() => {
          setIsLoadingProduct(false);
          setProduct(null);
          setRelatedProducts([]);
          console.log('Product not found for ID:', productId);
        }, 300);
      }
    } else if (isOpen && productId && products.length === 0 && !productsLoading) {
      // Products are loaded but empty, and we have a productId
      console.log('No products available but productId provided:', productId);
      setIsLoadingProduct(false);
      setProduct(null);
    } else if (isOpen && productId) {
      // Still loading products from database
      console.log('Waiting for products to load...');
      setIsLoadingProduct(true);
    } else if (!isOpen) {
      // Modal closed, reset states
      setIsLoadingProduct(false);
      setProduct(null);
      setRelatedProducts([]);
    }
  }, [isOpen, productId, products, productsLoading]);

  // Find related products based on tags
  const findRelatedProducts = (currentProduct: Product) => {
    if (products.length > 0) {
      // Simple related logic: find products with at least one common tag (excluding self)
      const currentProductTags = currentProduct.tags?.map(t => t.id) || [];
      const related = products.filter(p => 
        p.id !== currentProduct.id && 
        p.tags?.some(tag => currentProductTags.includes(tag.id))
      ).slice(0, 6); // Show up to 6 related products
      
      // If not enough tag-related products, fill with others (excluding self)
      if (related.length < 4) {
        const otherProducts = products.filter(p => 
          p.id !== currentProduct.id && 
          !related.some(r => r.id === p.id)
        );
        related.push(...otherProducts.slice(0, 4 - related.length));
      }

      setRelatedProducts(related);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
    // Maybe show success message?
  };

  // Handle clicking on a related product
  const handleRelatedProductClick = (relatedProductId: string) => {
    if (relatedProductId !== productId) {
      setIsTransitioning(true);
      setTimeout(() => {
        // This will trigger the useEffect to load the new product
        const foundProduct = products.find(p => p.id === relatedProductId);
        if (foundProduct) {
          setProduct(foundProduct);
          findRelatedProducts(foundProduct);
        }
        setIsTransitioning(false);
      }, 300);
    }
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
      <DialogClose asChild>
         <Button variant="outline">Fechar</Button>
      </DialogClose>
    </div>
  );

  const renderRelatedProducts = () => {
    if (relatedProducts.length === 0) return null;

    return (
      <>
        <Separator className="my-6" />
        <div className="mb-2">
          <h3 className="text-lg font-semibold mb-4">Produtos Relacionados</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id}
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                  className={cn(
                    "w-36 sm:w-40 flex-shrink-0 cursor-pointer",
                    "transition-all duration-200 hover:scale-105",
                    "border rounded-lg overflow-hidden",
                    relatedProduct.id === productId ? "ring-2 ring-primary" : "hover:shadow-md"
                  )}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={relatedProduct.image || '/placeholder-product.png'} 
                      alt={relatedProduct.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium line-clamp-1">{relatedProduct.name}</p>
                    <p className="text-sm text-primary font-semibold">
                      {relatedProduct.price ? `R$ ${relatedProduct.price.toFixed(2)}` : 'Preço indisponível'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderProductContent = () => {
    if (!product) return null; // Should be handled by loading/not found states

    return (
      <div 
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

        {/* Bottom Section: Description */}
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 gap-8">
          <div>
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Related Products Section */}
        {renderRelatedProducts()}
      </div>
    );
  };

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
          // Desktop specific (Dialog)
          "sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl", // Control max width
          "h-[90vh] max-h-[90vh]", // Control height
          // Mobile specific (Drawer)
          isMobile ? "h-[95%]" : "" // Drawer takes 95% height from bottom (increased from 90%)
        )}
      >
        {/* Custom Header with Close Button - REDUCED HEIGHT */}
        <div className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
          <h2 className="text-base font-medium truncate pr-4 ml-2">
            {product ? product.name : shouldShowLoading ? 'Carregando...' : 'Produto'}
          </h2>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </DialogClose>
        </div>

        {/* Content Area - ADJUSTED HEIGHT FOR SMALLER HEADER */}
        <div className="h-[calc(100%-45px)]"> {/* Reduced from 65px to 45px */}
          {shouldShowLoading ? (
            renderLoadingSkeleton()
          ) : shouldShowProduct ? (
            renderProductContent()
          ) : shouldShowNotFound ? (
            renderNotFound()
          ) : null}
        </div>

      </ModalContentComponent>
    </ModalComponent>
  );
};

export default ProductModal;
