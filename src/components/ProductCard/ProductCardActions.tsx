
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardActionsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  product,
  onAddToCart
}) => {
  const isOutOfStock = product.stock === 0;

  // Handler que previne propagação do evento
  const handleAddToCartClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Impede que o clique propague para o card
    e.preventDefault();
    
    console.log(`[ProductCardActions] Add to cart clicked: ${product.name}`);
    
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        size="sm"
        variant="default"
        onClick={handleAddToCartClick}
        disabled={isOutOfStock}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all duration-200 active:scale-95",
          isOutOfStock
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-uti-red text-primary-foreground hover:bg-uti-red/90"
        )}
        aria-label={isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        style={{ 
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <ShoppingCart className="h-3 w-3 mr-1" />
        {isOutOfStock ? 'Esgotado' : 'Adicionar'}
      </Button>
    </div>
  );
};

export default ProductCardActions;
