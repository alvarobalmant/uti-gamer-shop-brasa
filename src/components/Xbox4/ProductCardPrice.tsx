
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardPriceProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
  className?: string;
}

const ProductCardPrice = ({ product, variant = "default", className }: ProductCardPriceProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "flex items-center justify-between",
      // Padding reduzido no mobile, normal no desktop
      "py-0.5 md:py-2",
      className
    )}>
      <motion.div 
        className={cn(
          "font-black text-[#107C10]",
          // Tamanho da fonte responsivo
          "text-sm md:text-xl",
          // Altura mínima reduzida no mobile
          "min-h-[14px] md:min-h-[24px] flex items-center"
        )}
        whileHover={{ 
          scale: 1.05,
          textShadow: "0 0 8px rgba(16, 124, 16, 0.8)",
          transition: { duration: 0.15 }
        }}
      >
        R$ {product.price?.toFixed(2)}
      </motion.div>
      {product.list_price && product.list_price > product.price && (
        <div className="text-xs text-gray-400 line-through">
          R$ {product.list_price.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default ProductCardPrice;
