
import React from 'react';
import { Product } from '../ProductCard';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Crown } from 'lucide-react';

interface ProductCardProPriceProps {
  product: Product;
}

const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const { hasActiveSubscription, getDiscountPercentage } = useSubscriptions();
  
  const isProMember = hasActiveSubscription();
  const discountPercentage = getDiscountPercentage();
  const proPrice = product.price * (1 - discountPercentage / 100);
  const originalPrice = product.price * 1.15;
  const savings = product.price - proPrice;

  return (
    <div className="mb-4 md:mb-4 mb-3">
      {/* UTI PRO Price - Show first if user is PRO member */}
      {isProMember && (
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
              Preço UTI PRO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-yellow-800">
              R$ {proPrice.toFixed(2)}
            </span>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            Economia de R$ {savings.toFixed(2)}
          </div>
        </div>
      )}

      {/* Regular Price */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xl font-bold ${isProMember ? 'text-gray-500 line-through' : 'text-gray-900'} md:text-xl text-lg`}>
          R$ {product.price.toFixed(2)}
        </span>
        {!isProMember && (
          <span className="text-sm text-gray-500 line-through md:text-sm text-xs">
            R$ {originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {/* UTI PRO teaser for non-members */}
      {!isProMember && (
        <div className="text-sm font-medium text-purple-600 mb-1 md:text-sm text-xs">
          R$ {proPrice.toFixed(2)} Membros PRO
        </div>
      )}
      
      {/* Installments */}
      <div className="text-xs text-gray-500 md:text-xs text-[10px]">
        ou 12x de R$ {((isProMember ? proPrice : product.price) / 12).toFixed(2)}
      </div>
    </div>
  );
};

export default ProductCardProPrice;
