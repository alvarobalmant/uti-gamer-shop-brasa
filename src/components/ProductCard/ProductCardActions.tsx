
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardActionsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  product,
  onAddToCart
}) => {
  const isOutOfStock = product.stock === 0;
  const isMobile = useIsMobile();

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <div className={cn(
      "absolute bottom-2 right-2 z-10 transition-opacity duration-300",
      // No mobile: sempre visível, no desktop: aparece só no hover
      isMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
    )}>
      <Button
        size="icon"
        variant="default"
        onClick={handleAddToCartClick}
        disabled={isOutOfStock}
        className={cn(
          "h-8 w-8 rounded-full shadow-md transition-all duration-300 active:scale-90",
          isOutOfStock
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-uti-red text-primary-foreground md:hover:bg-uti-red/90"
        )}
        aria-label={isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardActions;
