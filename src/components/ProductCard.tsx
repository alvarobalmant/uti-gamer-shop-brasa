import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCardClick: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart, onCardClick }: ProductCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    onCardClick(product.id);
  };

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md bg-white shadow-md",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-lg",
        "cursor-pointer",
        "w-full h-full",
        "border border-gray-200", // GameStop-like border
        "hover:border-red-500", // GameStop-like hover border
        "p-2" // Adjusted padding
      )}
      onClick={handleCardClick}
    >
      <ProductCardImage
        product={product}
      />

      <div className="flex flex-1 flex-col justify-between p-3 text-center">
        <div>
          <ProductCardInfo product={product} />
          <ProductCardProPrice product={product} />
        </div>

        <div className="mt-2 flex flex-col items-center justify-center">
          <ProductCardStock product={product} />
          <div data-action="true" className="w-full mt-2">
            <ProductCardActions
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;


