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

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <div className="w-full"> {/* Ensure the container takes full width */}
      <Button
        size="default" // Use default size for a full-width button
        variant="default"
        onClick={handleAddToCartClick}
        disabled={isOutOfStock}
        className={cn(
          "w-full rounded-md py-2 text-base font-semibold", // Full width, adjusted padding and font
          "transition-all duration-200 ease-in-out",
          isOutOfStock
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700", // GameStop-like red button
          "flex items-center justify-center gap-2" // Center content and add gap for icon/text
        )}
        aria-label={isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
      >
        {!isOutOfStock ? (
          <>
            <ShoppingCart className="h-5 w-5" />
            <span>Adicionar ao Carrinho</span>
          </>
        ) : (
          <span>Esgotado</span>
        )}
      </Button>
    </div>
  );
};

export default ProductCardActions;


