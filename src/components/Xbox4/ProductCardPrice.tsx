
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
      // Reduzindo margin bottom para cards menores
      isGame ? "mb-1" : "mb-2 md:mb-4",
      className
    )}>
      <motion.div 
        className={cn(
          "font-black text-[#107C10]",
          // Reduzindo tamanho da fonte do preço no mobile
          "text-sm md:text-xl"
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
