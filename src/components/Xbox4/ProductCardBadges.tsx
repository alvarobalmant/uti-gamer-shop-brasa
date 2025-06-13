
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardBadgesProps {
  product: Product;
  variant?: "default" | "game" | "accessory" | "deal";
}

const ProductCardBadges = ({ product, variant = "default" }: ProductCardBadgesProps) => {
  const isDeal = variant === "deal";
  
  return (
    <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1 md:gap-2 z-10">
      {product.is_featured && (
        <Badge className="bg-yellow-500 text-black font-bold text-xs px-2 md:px-3 py-1 rounded-full shadow-lg">
          DESTAQUE
        </Badge>
      )}
      {product.isNew && (
        <Badge className="bg-red-500 text-white font-bold text-xs px-2 md:px-3 py-1 rounded-full shadow-lg">
          NOVO
        </Badge>
      )}
      {isDeal && product.discount && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-yellow-500 text-black font-bold text-xs px-2 md:px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
        >
          <Tag size={10} className="md:w-3 md:h-3" />
          {product.discount}% OFF
        </motion.div>
      )}
    </div>
  );
};

export default ProductCardBadges;
