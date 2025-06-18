<<<<<<< HEAD
=======

>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
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
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={cn(
        "group relative bg-gray-900 rounded-xl overflow-hidden border border-transparent cursor-pointer",
        "p-2 md:p-6",
        // Responsive aspect ratios - mais compacto no mobile, normal no desktop
        isGame ? "aspect-[3/3.8] md:aspect-[3/4.5]" : "aspect-[3/3.5] md:aspect-[4/6]",
        "transition-all duration-300 ease-out",
        "hover:bg-gray-800 hover:border-[#107C10]/50",
        "active:scale-95 md:active:scale-100",
        // Mantendo largura responsiva mas proporcional
        "w-full max-w-[140px] sm:max-w-[160px] md:max-w-none",
        // Centralizando no mobile e adicionando margin para animações
        "mx-auto my-4 md:my-0",
<<<<<<< HEAD
        "flex flex-col", // Make the main card a flex column
=======
>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
        className
      )}
      onClick={() => onProductClick(product.id)}
      style={{ 
        transformOrigin: "center center",
        // Garantindo espaço para animações
        margin: "16px auto",
      }}
    >
      {/* Badges */}
      <ProductCardBadges product={product} variant={variant} />
      
      {/* Imagem do produto */}
<<<<<<< HEAD
      <div className="mb-1 md:mb-4 flex-1 flex items-center justify-center"> {/* flex-1 to take available space */} 
=======
      <div className="mb-1 md:mb-4 flex-1">
>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
        <ProductCardImage 
          product={product} 
          variant={variant}
        />
      </div>
      
<<<<<<< HEAD
      {/* Informações do produto, preço e ações - this block will be at the bottom */}
      <div className="flex flex-col justify-between flex-shrink-0"> {/* This container will hold the info, price, and actions */} 
        {/* Product Info (Title) */}
        <div className="min-h-[48px] flex items-start"> {/* Set min-height for title block, flex items-start to align text to top */} 
          <ProductCardInfo 
            product={product} 
            variant={variant}
            className="text-xs md:text-base"
          />
        </div>

        {/* Price and Actions - these will be pushed to the bottom of their parent flex container */}
        <div className="mt-auto space-y-0.5 md:space-y-3"> {/* mt-auto pushes this block to the bottom */} 
=======
      {/* Informações do produto - layout mais compacto no mobile */}
      <div className="space-y-0.5 md:space-y-3 flex-shrink-0">
        <ProductCardInfo 
          product={product} 
          variant={variant}
          className="text-xs md:text-base"
        />
        
        {/* Preço com altura mínima reduzida no mobile */}
        <div className="min-h-[16px] md:min-h-[30px]">
>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
          <ProductCardPrice 
            product={product} 
            variant={variant}
            className="text-xs md:text-base"
          />
<<<<<<< HEAD
          
          <ProductCardActions 
            product={product} 
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
            variant={variant}
            className="text-xs md:text-sm"
          />
        </div>
=======
        </div>
        
        <ProductCardActions 
          product={product} 
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          variant={variant}
          className="text-xs md:text-sm"
        />
>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
      </div>
    </motion.div>
  );
};

export default ProductCard;
<<<<<<< HEAD


=======
>>>>>>> 1b5064c2294c1a0b334ecd46e8d234b6a219189b
