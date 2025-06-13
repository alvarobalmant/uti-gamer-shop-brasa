
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardPriceProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
}

const ProductCardPrice = ({ product, variant = "default" }: ProductCardPriceProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "flex items-center justify-between",
      // Mobile: more spacing for visual clarity
      "mb-3 md:mb-4",
      isGame ? "flex-col items-start gap-1" : "flex-row"
    )}>
      <div className={cn(
        "font-black text-[#107C10]",
        // Mobile: better price visibility
        isGame 
          ? "text-base md:text-xl" // Games: larger on mobile
          : "text-lg md:text-xl" // Outros: prominent pricing
      )}>
        R$ {product.price?.toFixed(2)}
      </div>
      {product.originalPrice && product.originalPrice > product.price && (
        <div className={cn(
          "text-gray-400 line-through",
          // Mobile: proportional original price
          isGame 
            ? "text-sm md:text-base" 
            : "text-base md:text-lg"
        )}>
          R$ {product.originalPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
