
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardImageProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
  className?: string;
  isHovered?: boolean;
}

const ProductCardImage = ({ product, variant = "default", className, isHovered = false }: ProductCardImageProps) => {
  const isGame = variant === "game";
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg",
      // Mantendo aspect ratio consistente
      isGame ? "aspect-[3/4]" : "aspect-square",
      className
    )}>
      <img 
        src={product.image || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center'} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-200 ease-out"
        style={{
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
    </div>
  );
};

export default ProductCardImage;
