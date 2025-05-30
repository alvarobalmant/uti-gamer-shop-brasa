
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardActionsProps {
  product: Product;
  showButton: boolean;
  onAddToCart: (e: React.MouseEvent | React.TouchEvent) => void;
}

const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  product,
  showButton,
  onAddToCart
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`transition-all duration-300 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} md:opacity-0 md:group-hover:opacity-100 opacity-100 translate-y-0`}>
      <Button
        onClick={onAddToCart}
        onTouchEnd={onAddToCart}
        disabled={isOutOfStock}
        className={`w-full font-semibold py-3 text-sm rounded-lg transition-all duration-300 active:scale-95 md:py-3 py-3.5 md:text-sm text-xs min-h-[44px] ${
          isOutOfStock 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-md'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <ShoppingCart className="w-4 h-4 mr-2 md:w-4 md:h-4 w-3.5 h-3.5" />
        <span className="md:inline hidden">{isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}</span>
        <span className="md:hidden inline">{isOutOfStock ? 'Esgotado' : 'Adicionar'}</span>
      </Button>
    </div>
  );
};

export default ProductCardActions;
