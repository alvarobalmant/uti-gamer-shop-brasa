
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Product } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

// Assuming these components exist for product page details
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery';
import ProductInfo from '@/components/ProductPage/ProductInfo';
import ProductPricing from '@/components/ProductPage/ProductPricing';
import ProductOptions from '@/components/ProductPage/ProductOptions';
import ProductActions from '@/components/ProductPage/ProductActions';
import ProductDescription from '@/components/ProductPage/ProductDescription';

interface ProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  loading?: boolean;
  productId?: string | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  product, 
  loading = false,
  productId 
}) => {
  const { addToCart, loading: cartLoading } = useCart();
  const [selectedCondition, setSelectedCondition] = React.useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    if (product) {
      setSelectedCondition(product.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
      if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
      if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
    // Optionally close modal or show toast
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{product?.name || 'Detalhes do Produto'}</DialogTitle>
          <DialogDescription className="sr-only">Visualizar detalhes do produto</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 pt-0">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
                <Separator className="my-4" />
                <ProductActions 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                  isLoading={cartLoading} 
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Produto não encontrado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
