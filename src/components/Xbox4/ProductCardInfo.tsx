
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardInfoProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
}

const ProductCardInfo = ({ product, variant = "default" }: ProductCardInfoProps) => {
  const isGame = variant === "game";
  
  return (
    <motion.h3 
      className={cn(
        "font-bold text-white line-clamp-2 transition-colors duration-150",
        // Mobile: more generous spacing and better readability
        "mb-2 md:mb-3 leading-snug",
        // Mobile: improved font sizes for better readability
        isGame 
          ? "text-sm md:text-base" // Games: readable on mobile
          : "text-base md:text-lg" // Outros: larger and more prominent
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
