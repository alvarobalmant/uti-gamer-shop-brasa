import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardImageProps {
  product: Product;
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({ product }) => {
  const isOutOfStock = product.stock === 0;
  const isMobile = useIsMobile();

  const getConditionBadge = () => {
    if (product.tags?.some(tag => tag.name.toLowerCase().includes('novo'))) {
      return null;
    }
    if (product.tags?.some(tag => tag.name.toLowerCase().includes('usado'))) {
      return (
        <Badge variant="secondary" className="absolute top-2 left-2 z-10 border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 shadow-sm">
          USADO
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center bg-gray-100" style={{ minHeight: '180px' }}> {/* Adjusted for GameStop-like image container */}
      <img
        src={product.image || '/placeholder-image.webp'}
        alt={product.name}
        className={cn(
          "h-full w-full object-contain transition-transform duration-300 ease-in-out p-4", // Added padding to image
          isOutOfStock ? "grayscale filter opacity-70" : ""
        )}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder-image-error.webp';
        }}
      />

      {getConditionBadge()}

      {isOutOfStock && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-black/50 p-1 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
            Esgotado
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCardImage;


