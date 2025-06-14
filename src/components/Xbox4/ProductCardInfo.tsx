
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardInfoProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
  className?: string;
}

const ProductCardInfo = ({ product, variant = "default", className }: ProductCardInfoProps) => {
  const isGame = variant === "game";
  
  return (
    <motion.h3 
      className={cn(
        "font-bold text-white line-clamp-2 transition-colors duration-150 leading-tight",
        "max-w-[90%] px-1 md:px-0",
        isGame ? "text-xs md:text-sm mb-1 md:mb-2" : "text-xs md:text-lg mb-1 md:mb-2",
        className
      )}
      whileHover={{ 
        color: "#107C10",
        transition: { duration: 0.15 }
      }}
    >
      {product.name}
    </motion.h3>
  );
};

export default ProductCardInfo;
