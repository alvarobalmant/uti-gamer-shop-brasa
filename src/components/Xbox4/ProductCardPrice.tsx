
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
      "flex items-center justify-between mb-2 md:mb-3",
      isGame ? "mb-1 md:mb-2 flex-col items-start gap-1" : "flex-row"
    )}>
      <div className={cn(
        "font-black text-[#107C10]",
        // Mobile: texto legível mas compacto
        isGame 
          ? "text-sm md:text-xl" // Games: menor no mobile
          : "text-base md:text-xl" // Outros: tamanho adaptativo
      )}>
        R$ {product.price?.toFixed(2)}
      </div>
      {product.originalPrice && product.originalPrice > product.price && (
        <div className={cn(
          "text-gray-400 line-through",
          // Mobile: texto proporcional
          isGame 
            ? "text-xs md:text-sm" 
            : "text-sm md:text-base"
        )}>
          R$ {product.originalPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
