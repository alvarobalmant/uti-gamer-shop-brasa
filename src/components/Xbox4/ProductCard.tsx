
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
  className?: string;
}

const ProductCard = ({ product, onAddToCart, onProductClick, variant = "default", index = 0, className }: ProductCardProps) => {
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
        scale: 1.02,
        rotateY: 1,
        rotateX: 0.5,
        boxShadow: "0 0 25px -5px rgba(16, 124, 16, 0.6), 0 0 12px -8px rgba(16, 124, 16, 0.4)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={cn(
        "group relative bg-gray-900 rounded-xl overflow-visible border border-transparent cursor-pointer",
        "p-2 md:p-6",
        "h-[240px] md:min-h-[400px]",
        "transition-all duration-300 ease-out",
        "hover:bg-gray-800 hover:border-[#107C10]/50",
        "active:scale-95 md:active:scale-100",
        "w-[180px] md:w-full max-w-[180px] md:max-w-none",
        "flex-shrink-0 snap-start",
        "transform-gpu will-change-transform",
        className
      )}
      style={{
        transformOrigin: "center center",
        zIndex: 1
      }}
      onClick={() => onProductClick(product.id)}
    >
      {/* Badges */}
      <ProductCardBadges product={product} variant={variant} />
      
      {/* Imagem do produto */}
      <ProductCardImage 
        product={product} 
        variant={variant}
        className="mb-2 md:mb-4"
      />
      
      {/* Informações do produto */}
      <div className="space-y-1 md:space-y-3">
        <ProductCardInfo 
          product={product} 
          variant={variant}
          className="text-xs md:text-base"
        />
        
        <ProductCardPrice 
          product={product} 
          variant={variant}
          className="text-xs md:text-base"
        />
        
        <ProductCardActions 
          product={product} 
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          variant={variant}
          className="text-xs md:text-sm"
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
