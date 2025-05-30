import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { AlertCircle } from 'lucide-react';

// Import radically redesigned subcomponents (assuming they will be created/modified)
import ProductPageHeader from '@/components/ProductPage/ProductPageHeader'; // Keep or simplify
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery'; // Needs redesign
import ProductInfo from '@/components/ProductPage/ProductInfo'; // Needs redesign
import ProductPricing from '@/components/ProductPage/ProductPricing'; // Needs redesign
import ProductOptions from '@/components/ProductPage/ProductOptions'; // Needs redesign
import ProductActions from '@/components/ProductPage/ProductActions'; // Needs redesign
import ProductDescription from '@/components/ProductPage/ProductDescription'; // New component for description section
import RelatedProducts from '@/components/ProductPage/RelatedProducts'; // New component for related products
import { CartContextType } from '@/contexts/CartContext';

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart() as CartContextType; // Assuming cart context provides loading state
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      // Set default options if product found
      if (foundProduct) {
        setSelectedCondition(foundProduct.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
        if (foundProduct.sizes && foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
        if (foundProduct.colors && foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
      }
    }
  }, [products, id]);

  const handleAddToCart = async () => {
    if (!product) return;
    // Add logic to handle quantity if needed, GameStop seems to add 1 by default
    await addToCart(product, selectedSize || undefined, selectedColor || undefined);
    // Optional: Add feedback like toast notification
  };

  const handleBackClick = () => navigate(-1);

  // --- Loading State --- 
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProductPageHeader onBackClick={handleBackClick} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Skeleton for Gallery */}
            <Skeleton className="aspect-square w-full rounded-lg" />
            {/* Skeleton for Info */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/4 rounded" />
              <Skeleton className="h-10 w-1/2 rounded" />
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Not Found State --- 
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Produto Não Encontrado</h2>
        <p className="text-muted-foreground mb-6">Não conseguimos encontrar o produto que você está procurando.</p>
        <Button onClick={() => navigate('/')} variant="outline">
          Voltar à Loja
        </Button>
      </div>
    );
  }

  // --- Main Product Page Layout (GameStop Inspired) --- 
  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Header - Breadcrumbs might go here */}
      <ProductPageHeader onBackClick={handleBackClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Section: Gallery + Info/Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
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
            {/* Options might be integrated differently or simplified */}
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
            />
            {/* Trust badges/Delivery info can go here */}
            {/* <ProductTrustBadges /> */}
          </div>
        </div>

        {/* Bottom Section: Description + Related Products */}
        <Separator className="mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ProductDescription product={product} />
          </div>
          <div className="lg:col-span-1">
            {/* Placeholder for potential sidebar content or ads */}
          </div>
        </div>

        <Separator className="my-12" />
        <RelatedProducts product={product} />

      </main>
    </div>
  );
};

export default ProductPage;
