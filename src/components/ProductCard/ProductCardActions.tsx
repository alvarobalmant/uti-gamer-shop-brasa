import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardActionsProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent | React.TouchEvent) => void;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  product,
  onAddToCart
}) => {
  const isOutOfStock = product.stock === 0;

  // Minimalist approach: Button appears subtly on hover (desktop)
  // For mobile, clicking the card navigates, so button might be less critical here
  // or could be a smaller icon button if desired.
  return (
    <div className="absolute bottom-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"> {/* Show on hover */}
      <Button
        size="icon" // Use icon size for a smaller footprint
        variant="default" // Use primary color (UTI Red)
        onClick={onAddToCart}
        onTouchEnd={onAddToCart} // Ensure touch works
        disabled={isOutOfStock}
        className={cn(
          "h-8 w-8 rounded-full shadow-md transition-all duration-300 active:scale-90",
          isOutOfStock
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-uti-red text-primary-foreground hover:bg-uti-red/90"
        )}
        aria-label={isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        style={{ touchAction: 'manipulation' }}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardActions;

