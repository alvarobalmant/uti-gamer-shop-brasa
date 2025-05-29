import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions'; // Assuming this hook provides Pro status
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProPriceProps {
  product: Product;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const { hasActiveSubscription } = useSubscriptions(); // Simplified hook usage example
  const isProMember = hasActiveSubscription();

  // Calculate Pro price (example: 10% discount)
  // Replace with actual logic if different (e.g., specific pro_price field)
  const proDiscount = 0.10; // Example 10% discount
  const proPrice = product.price ? product.price * (1 - proDiscount) : null;

  // Use product.list_price if available for strikethrough, otherwise use regular price
  const displayPrice = product.price.toFixed(2);
  const displayListPrice = product.list_price ? product.list_price.toFixed(2) : null;
  const displayProPrice = proPrice ? proPrice.toFixed(2) : null;

  // Show strikethrough only if list_price is higher than current price
  const showListPriceStrike = displayListPrice && parseFloat(displayListPrice) > product.price;

  return (
    <div className="mt-1 mb-1"> {/* Minimal margins */}
      {/* Price Display - Mimicking GameStop structure */}
      <div className="flex flex-col items-start">
        {/* Regular Price - Always visible */}
        <span className={cn(
          "font-semibold text-foreground",
          showListPriceStrike ? "text-base" : "text-base" // Keep size consistent
        )}>
          R$ {displayPrice}
        </span>

        {/* List Price Strikethrough (if applicable) */}
        {showListPriceStrike && (
          <span className="text-xs text-muted-foreground line-through">
            R$ {displayListPrice}
          </span>
        )}

        {/* Pro Price Info */}
        {displayProPrice && (
          <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-uti-pro">
            <Crown className="h-3.5 w-3.5" />
            <span>R$ {displayProPrice}</span>
            <span className="ml-1 font-semibold">para Pros</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardProPrice;

