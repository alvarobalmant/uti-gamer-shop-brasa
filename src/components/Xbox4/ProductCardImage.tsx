
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardImageProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
  className?: string;
}

const ProductCardImage = ({ product, variant = "default", className }: ProductCardImageProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "overflow-hidden",
      isGame ? "h-full" : "aspect-square",
      className
    )}>
      <motion.img 
        src={product.image || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center'} 
        alt={product.name}
        className="w-full h-full object-cover"
        whileHover={{ 
          scale: 1.08,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
    </div>
  );
};

export default ProductCardImage;
