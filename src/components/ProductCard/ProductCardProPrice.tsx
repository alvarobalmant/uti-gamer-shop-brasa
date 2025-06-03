
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProPriceProps {
  product: Product;
}

// **Radical Redesign - Enhanced Pro Price Highlighting**
const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const { hasActiveSubscription } = useSubscriptions();
  const isProMember = hasActiveSubscription(); // Determine if the current user is a Pro member

  // Calculate Pro price (example: 10% discount since we don't have specific fields)
  const proDiscount = 0.10; // Default 10% discount
  const proPrice = product.price * (1 - proDiscount);

  const displayPrice = product.price.toFixed(2);
  const displayProPrice = proPrice.toFixed(2);

  // Since we don't have list_price in the Product type, we'll skip the strikethrough logic
  // and focus on showing the regular price and pro price

  return (
    <div className="mt-1 mb-1"> {/* Minimal margins */}
      <div className="flex flex-col items-start">
        {/* Regular Price - Always visible */}
        <span className="font-semibold text-foreground text-lg">
          R$ {displayPrice}
        </span>

        {/* Pro Price Info - Enhanced Highlighting */}
        <div className={cn(
          "mt-1 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
          // Use a distinct background/text color for Pro price with better contrast
          "bg-uti-pro/15 text-uti-pro border border-uti-pro/20"
          // Alternatively, use GameStop's purple: "bg-purple-100 text-purple-700"
        )}>
          <Crown className="h-3.5 w-3.5" />
          <span className="font-bold">R$ {displayProPrice}</span>
          <span className="ml-1 font-semibold">para Pros</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCardProPrice;
