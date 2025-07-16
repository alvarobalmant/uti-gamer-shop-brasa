
import React from 'react';
import { Button } from '@/components/ui/button';
import FavoriteButton from '@/components/FavoriteButton';
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
    onAddToCart(product);
  };

  if (isOutOfStock) {
    return (
      <div className="w-full space-y-2">
        <div className="text-center py-2">
          <span className="text-sm text-red-600 font-medium">Produto esgotado</span>
        </div>
        <FavoriteButton 
          productId={product.id} 
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Button
        size="default"
        variant="default"
        onClick={handleAddToCartClick}
        className={cn(
          "w-full rounded-md py-2 text-base font-semibold",
          "transition-all duration-200 ease-in-out",
          "bg-green-600 text-white hover:bg-green-700"
        )}
        aria-label="Adicionar ao Carrinho"
      >
        <span>Adicionar ao Carrinho</span>
      </Button>
      
      <FavoriteButton 
        productId={product.id} 
        className="w-full"
      />
    </div>
  );
};

export default ProductCardActions;
