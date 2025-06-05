import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { cn } from '@/lib/utils';

interface ProductCardProPriceProps {
  product: Product;
}

const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const { hasActiveSubscription } = useSubscriptions();
  const isProMember = hasActiveSubscription();

  const proDiscount = product.pro_discount_percent || 0.10;
  const proPrice = product.pro_price || (product.price ? product.price * (1 - proDiscount) : null);

  const displayPrice = product.price.toFixed(2);
  const displayListPrice = product.list_price ? product.list_price.toFixed(2) : null;
  const displayProPrice = proPrice ? proPrice.toFixed(2) : null;

  const showListPriceStrike = displayListPrice && parseFloat(displayListPrice) > product.price;

  return (
    <div className="mt-1 mb-1 text-center"> {/* Centered text for prices */}
      <div className="flex flex-col items-center">
        {/* Regular Price */}
        <span className={cn(
          "font-bold text-lg text-gray-900", // Larger, bolder for main price
          showListPriceStrike ? "" : ""
        )}>
          R$ {displayPrice}
        </span>

        {/* List Price Strikethrough (if applicable) */}
        {showListPriceStrike && (
          <span className="text-sm text-gray-500 line-through">
            R$ {displayListPrice}
          </span>
        )}

        {/* Pro Price Info - Simplified and subtle */}
        {displayProPrice && (
          <span className={cn(
            "mt-1 text-xs font-semibold text-purple-700", // Distinct color for Pro price
            "bg-purple-100 px-1 py-0.5 rounded"
          )}>
            R$ {displayProPrice} (PRO)
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCardProPrice;


