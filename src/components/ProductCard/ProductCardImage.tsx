
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductCardImageProps {
  product: Product;
  // Wishlist props can be added back if the feature is confirmed needed
  // onWishlistClick: (e: React.MouseEvent | React.TouchEvent) => void;
  // isWishlisted: boolean;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductCardImage: React.FC<ProductCardImageProps> = ({ product }) => {
  const isOutOfStock = product.stock === 0;

  // Simplified badge logic based on GameStop's cleaner look
  const getConditionBadge = () => {
    if (product.tags?.some(tag => tag.name.toLowerCase().includes('novo'))) {
      // Optional: Could return a small "Novo" badge if desired, but GameStop often omits
      return null; // Keep it clean like GameStop reference
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
    <div className="relative aspect-square w-full overflow-hidden bg-uti-gray-light rounded-t-lg"> {/* Consistent square aspect ratio like many e-commerce sites */}
      {/* Product Image - Centered and covers */}
      <img
        src={product.image || '/placeholder-image.webp'} // Use placeholder
        alt={product.name}
        className={cn(
          "h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105 p-2", // Use contain to show full product, add padding
          isOutOfStock ? "grayscale filter opacity-70" : "" // Subtle grayscale + opacity
        )}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder-image-error.webp';
        }}
      />

      {/* Condition Badge (Optional & Subtle) */}
      {getConditionBadge()}

      {/* Wishlist Button (Optional - Keep subtle if added) */}
      {/* Example Wishlist Button - uncomment and style if needed
      <button
        onClick={onWishlistClick}
        className={cn(
          "absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-background/60 backdrop-blur-sm",
          "text-muted-foreground transition-all duration-200 hover:bg-background hover:text-uti-red hover:border-uti-gray-dark/20 active:scale-90",
          isWishlisted ? "text-uti-red border-uti-red/30 bg-uti-red/10" : ""
        )}
        aria-label={isWishlisted ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
      >
        <Heart className={cn("h-3.5 w-3.5", isWishlisted ? "fill-current" : "fill-none")} />
      </button>
      */}

      {/* Out of Stock Overlay - Minimalist */}
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

