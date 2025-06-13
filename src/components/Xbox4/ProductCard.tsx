
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
  variant?: "default" | "game" | "accessory" | "deal";
  index?: number;
}

const ProductCard = ({ product, onAddToCart, onProductClick, variant = "default", index = 0 }: ProductCardProps) => {
  const isGame = variant === "game";
  const isAccessory = variant === "accessory";
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
      className={cn(
        "group relative bg-gray-900 rounded-xl overflow-hidden border border-transparent cursor-pointer",
        "transform-gpu will-change-transform", // GPU optimization
        isGame ? "aspect-[2/3]" : "aspect-square",
        isDeal ? "bg-gradient-to-br from-[#107C10]/20 via-black to-black" : ""
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <div className={cn(
        "overflow-hidden",
        isGame ? "h-full" : "aspect-square"
      )}>
        <motion.img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.08,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {product.isFeatured && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
              DESTAQUE
            </Badge>
          </motion.div>
        )}
        {product.isNew && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
              NOVO
            </Badge>
          </motion.div>
        )}
        {isDeal && product.discount && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            className="bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <Tag size={12} />
            {product.discount}% OFF
          </motion.div>
        )}
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent",
        isGame ? "pb-3 pt-16" : "p-6"
      )}>
        <motion.h3 
          className={cn(
            "font-bold mb-2 text-white line-clamp-2 transition-colors duration-150",
            isGame ? "text-sm" : "text-lg"
          )}
          whileHover={{ 
            color: "#107C10",
            transition: { duration: 0.15 }
          }}
        >
          {product.name}
        </motion.h3>
        
        <div className={cn(
          "flex items-center justify-between mb-3",
          isGame ? "mb-2" : "mb-4"
        )}>
          <motion.div 
            className="text-xl font-black text-[#107C10]"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 8px rgba(16, 124, 16, 0.8)",
              transition: { duration: 0.15 }
            }}
          >
            R$ {product.price?.toFixed(2)}
          </motion.div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-sm text-gray-400 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex gap-2",
          isGame ? "justify-center" : "justify-between"
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
      </div>
    </motion.div>
  );
};

export default ProductCard;
