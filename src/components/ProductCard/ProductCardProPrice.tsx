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

  // Calculate Pro price (example: 10% discount or use a specific field if available)
  const proDiscount = product.pro_discount_percent || 0.10; // Use specific discount or default
  const proPrice = product.pro_price || (product.price ? product.price * (1 - proDiscount) : null);

  const displayPrice = product.price.toFixed(2);
  const displayListPrice = product.list_price ? product.list_price.toFixed(2) : null;
  const displayProPrice = proPrice ? proPrice.toFixed(2) : null;

  // Show strikethrough only if list_price is higher than current price
  const showListPriceStrike = displayListPrice && parseFloat(displayListPrice) > product.price;

  return (
    <div className="mt-1 mb-1"> {/* Minimal margins */}
      <div className="flex flex-col items-start">
        {/* Regular Price - Always visible */}
        <span className={cn(
          "font-semibold text-foreground",
          showListPriceStrike ? "text-base" : "text-lg" // Make regular price slightly larger if no list price
        )}>
          R$ {displayPrice}
        </span>

        {/* List Price Strikethrough (if applicable) */}
        {showListPriceStrike && (
          <span className="text-xs text-muted-foreground line-through">
            R$ {displayListPrice}
          </span>
        )}

        {/* Pro Price Info - Enhanced Highlighting */}
        {displayProPrice && (
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
        )}
      </div>
    </div>
  );
};

export default ProductCardProPrice;

