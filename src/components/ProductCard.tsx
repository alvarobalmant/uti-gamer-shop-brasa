import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardReducedPriceBadge from './ProductCard/ProductCardReducedPriceBadge';

export type { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
}

const ProductCard = ({ product, onCardClick }: ProductCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    onCardClick(product.id);
  };

  const hasDiscount = product.price < (product.originalPrice || product.price);

  return (
    <Card
      className={cn(
        "group relative flex flex-col bg-white", // Removido overflow-hidden aqui
        "border border-gray-200",
        "rounded-xl",
        "shadow-none",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-sm hover:-translate-y-0.5",
        "cursor-pointer",
        "w-[210px] h-[340px]",
        "px-2 py-3",
        "m-0.5" // Reduzindo margem para diminuir espaçamento entre cards
      )}
      onClick={handleCardClick}
    >
      <ProductCardReducedPriceBadge isVisible={hasDiscount} />
      <ProductCardImage
        product={product}
      />

      <div className="flex flex-1 flex-col justify-between p-3 text-left">
        <div>
          <ProductCardInfo product={product} />
          {product.price ? (
            <ProductCardPrice product={product} />
          ) : (
            <ProductCardProPrice product={product} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;


