
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/hooks/useProducts';
import ProductCardImage from './ProductCardImage';
import ProductCardBadges from './ProductCardBadges';
import ProductCardInfo from './ProductCardInfo';
import ProductCardPrice from './ProductCardPrice';
import ProductCardActions from './ProductCardActions';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
  variant?: "default" | "game" | "accessory" | "deal";
  index?: number;
}

const ProductCard = ({ product, onAddToCart, onProductClick, variant = "default", index = 0 }: ProductCardProps) => {
  const isGame = variant === "game";
  const isDeal = variant === "deal";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.03, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.03,
        rotateY: 2,
        rotateX: 1,
        boxShadow: "0 0 30px -5px rgba(16, 124, 16, 0.8), 0 0 15px -8px rgba(16, 124, 16, 0.6)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      whileTap={{ 
        scale: 0.97,
        transition: { duration: 0.1 }
      }}
      className={cn(
        "group relative bg-gray-900 rounded-xl overflow-hidden border border-transparent cursor-pointer",
        "transform-gpu will-change-transform transition-all duration-150 ease-in-out",
        // Mobile: visual breathing room with shadows
        "shadow-lg hover:shadow-xl",
        // Mobile responsive aspect ratios with better proportions
        isGame 
          ? "aspect-[2/3]" // Games mantém proporção vertical
          : "aspect-square", // Outros produtos
        isDeal ? "bg-gradient-to-br from-[#107C10]/20 via-black to-black" : "",
        // Mobile touch feedback
        "active:scale-95 md:active:scale-100",
        // Better minimum size for mobile
        "min-h-[220px] md:min-h-0"
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <ProductCardImage product={product} variant={variant} />
      <ProductCardBadges product={product} variant={variant} />
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent",
        // Mobile: generous padding for readability
        isGame 
          ? "p-3 md:p-4 pt-16 md:pt-20" // Games: more padding
          : "p-4 md:p-6" // Outros: even more padding
      )}>
        <ProductCardInfo product={product} variant={variant} />
        <ProductCardPrice product={product} variant={variant} />
        <ProductCardActions 
          product={product} 
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          variant={variant}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
