
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardActionsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
  variant?: "default" | "game" | "accessory" | "deal";
}

const ProductCardActions = ({ product, onAddToCart, onProductClick, variant = "default" }: ProductCardActionsProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "flex gap-2 md:gap-3",
      isGame ? "justify-center" : "justify-between"
    )}>
      {isGame ? (
        <Button 
          size="sm"
          className={cn(
            "w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
            "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
            // Mobile: better touch targets and visual appeal
            "min-h-[48px] rounded-lg", // Increased touch area
            "text-sm md:text-base px-4 md:px-6 py-3", // Better padding
            // Improved mobile feedback
            "active:scale-95 md:active:scale-100",
            "shadow-md active:shadow-sm" // Visual press feedback
          )}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
          <span className="truncate">ADICIONAR</span>
        </Button>
      ) : (
        <>
          <Button 
            className={cn(
              "flex-1 bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
              "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
              // Mobile: improved touch experience
              "min-h-[48px] rounded-lg", // Better touch area
              "text-sm md:text-base px-4 md:px-6 py-3", // Generous padding
              // Enhanced mobile feedback
              "active:scale-95 md:active:scale-100",
              "shadow-md active:shadow-sm"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
            <span className="truncate">COMPRAR</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              "border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-300",
              "transform hover:scale-110",
              // Mobile: optimal touch area for icon button
              "min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg", // Square touch area
              // Enhanced mobile feedback
              "active:scale-95 md:active:scale-100",
              "shadow-md hover:shadow-lg active:shadow-sm"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product.id);
            }}
          >
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ProductCardActions;
