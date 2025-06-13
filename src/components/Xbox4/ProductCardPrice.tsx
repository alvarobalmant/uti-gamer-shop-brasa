
import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
=======
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320
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
<<<<<<< HEAD
      "flex items-center justify-between mb-3",
      isGame ? "mb-2" : "mb-4"
    )}>
      <motion.div 
        className="text-xl font-black text-[#107C10]"
        whileHover={{ 
          scale: 1.05,
          textShadow: "0 0 8px rgba(16, 124, 16, 0.8)",
          transition: { duration: 0.15 }
        }}
      >
        R$ {product.price?.toFixed(2)}
      </motion.div>
      {product.list_price && product.list_price > product.price && (
        <div className="text-sm text-gray-400 line-through">
          R$ {product.list_price.toFixed(2)}
=======
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
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
