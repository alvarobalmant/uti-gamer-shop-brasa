
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
        "font-bold mb-1 md:mb-2 text-white line-clamp-2 transition-colors duration-150",
        // Mobile: tamanho mínimo de 14px, Desktop: mantém original
        isGame 
          ? "text-xs md:text-sm leading-tight" // Games: texto menor mas legível
          : "text-sm md:text-lg leading-tight md:leading-normal" // Outros: texto adaptativo
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
