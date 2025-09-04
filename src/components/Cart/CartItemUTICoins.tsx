import React from 'react';
import { CartItem } from '@/types/cart';
import { Coins, Info } from 'lucide-react';
import { useUTICoinsProduct } from '@/hooks/useUTICoinsProduct';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';

interface CartItemUTICoinsProps {
  item: CartItem;
  className?: string;
}

const CartItemUTICoins: React.FC<CartItemUTICoinsProps> = ({ item, className }) => {
  const utiCoinsProduct = useUTICoinsProduct(item.product);

  // Se não está habilitado para UTI Coins, não mostrar
  if (!utiCoinsProduct.isEnabled || utiCoinsProduct.estimatedCashback === 0) {
    return null;
  }

  const totalCashback = utiCoinsProduct.estimatedCashback * item.quantity;

  return (
    <div className={cn("mt-2", className)}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
        <div className="flex items-center gap-1 text-xs">
          <Coins className="w-3 h-3 text-yellow-600" />
          <span className="text-yellow-700 font-medium">
            +{totalCashback.toLocaleString()} UTI Coins
          </span>
          <Info className="w-3 h-3 text-yellow-500" />
        </div>
        <div className="text-xs text-yellow-600 mt-1">
          Cashback: {formatPrice(totalCashback * 0.01)}
        </div>
      </div>
    </div>
  );
};

export default CartItemUTICoins;