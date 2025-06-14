
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
  className?: string;
}

const ProductCardActions = ({ product, onAddToCart, onProductClick, variant = "default", className }: ProductCardActionsProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "flex gap-2",
      isGame ? "justify-center" : "justify-between",
      className
    )}>
      {isGame ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          <Button 
            size="sm"
            className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-150 shadow-lg hover:shadow-[0_0_20px_rgba(16,124,16,0.6)]"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            ADICIONAR
          </Button>
        </motion.div>
      ) : (
        <>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <Button 
              className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-150 shadow-lg hover:shadow-[0_0_20px_rgba(16,124,16,0.6)]"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              COMPRAR
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button 
              variant="outline" 
              size="icon"
              className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-150 hover:shadow-[0_0_15px_rgba(16,124,16,0.5)]"
              onClick={() => onProductClick(product.id)}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ProductCardActions;
