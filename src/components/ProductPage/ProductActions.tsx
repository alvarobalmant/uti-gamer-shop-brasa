
import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/FavoriteButton';

interface ProductActionsProps {
  product: Product;
  quantity?: number;
  selectedCondition?: 'new' | 'pre-owned' | 'digital';
  onAddToCart: () => void;
  onWhatsAppContact?: () => void;
  isLoading?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  onAddToCart, 
  isLoading
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex gap-2">
        <Button
          onClick={onAddToCart}
          size="lg"
          className={cn(
            "flex-1 font-bold text-lg rounded-lg shadow-md transition-all duration-300 active:scale-[0.98]",
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-uti-red text-primary-foreground md:hover:bg-uti-red/90 md:hover:shadow-lg"
          )}
          disabled={isOutOfStock || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adicionando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </>
          )}
        </Button>

        <FavoriteButton productId={product.id} size="lg" />
      </div>
    </div>
  );
};

export default ProductActions;
