
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
      "flex gap-1 md:gap-2 mt-2 md:mt-3",
      isGame ? "justify-center" : "justify-between"
    )}>
      {isGame ? (
        <Button 
          size="sm"
          className={cn(
            "w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
            "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
            // Mobile: área de toque mínima 44px
            "min-h-[44px] md:min-h-0",
            // Mobile: texto legível
            "text-xs md:text-sm px-2 md:px-4 py-2 md:py-2",
            // Touch feedback mobile
            "active:scale-95 md:active:scale-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">ADICIONAR</span>
        </Button>
      ) : (
        <>
          <Button 
            className={cn(
              "flex-1 bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
              "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
              // Mobile: área de toque e texto adequados
              "min-h-[44px] md:min-h-0",
              "text-xs md:text-sm px-2 md:px-4 py-2 md:py-2",
              // Touch feedback mobile
              "active:scale-95 md:active:scale-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="truncate">COMPRAR</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              "border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-300",
              "transform hover:scale-110",
              // Mobile: área de toque mínima
              "min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 w-11 h-11 md:w-10 md:h-10",
              // Touch feedback mobile
              "active:scale-95 md:active:scale-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product.id);
            }}
          >
            <Heart className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ProductCardActions;
