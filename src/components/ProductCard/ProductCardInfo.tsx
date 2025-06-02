import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Keep Badge if needed for 'Usado'
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardInfoProps {
  product: Product;
  // getPlatformColor is removed as platform badges are likely omitted in the minimalist design
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductCardInfo: React.FC<ProductCardInfoProps> = ({ product }) => {
  // Minimalist approach like GameStop: Focus on the title.
  // Badges (like platform) are generally omitted on the card itself in the reference.
  // Rating is also omitted for a cleaner look.
  const isMobile = useIsMobile();

  return (
    <div className="mb-1"> {/* Minimal bottom margin */}
      {/* Product Title - Clean and concise */}
      <h3
        className={cn(
          "text-sm font-medium leading-tight line-clamp-2 transition-colors duration-200",
          // No aplicar efeito de cor no mobile, manter preto padrão
          isMobile 
            ? "text-foreground" 
            : "text-foreground group-hover:text-uti-red"
        )}
        title={product.name} // Tooltip for full name
      >
        {product.name}
      </h3>

      {/* Optional: Badge for 'Usado' could be placed here if needed, but kept minimal */}
      {/* {product.tags?.some(tag => tag.name.toLowerCase().includes('usado')) && (
        <Badge variant="outline" className="mt-1 px-1.5 py-0.5 text-[10px] font-medium">
          Usado
        </Badge>
      )} */}
    </div>
  );
};

export default ProductCardInfo;
