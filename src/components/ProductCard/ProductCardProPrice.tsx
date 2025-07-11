import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useUTIProOptimized } from '@/hooks/useUTIProOptimized';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';

interface ProductCardProPriceProps {
  product: Product;
}

const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const utiPro = useUTIProOptimized(product);

  // Só renderiza se UTI Pro estiver habilitado, carregamento terminou e tem preço PRO
  if (utiPro.loading || !utiPro.isEnabled || !utiPro.proPrice) {
    return null;
  }

  return (
    <div className="mt-0 text-left">
      <span className="text-base font-bold text-[#00ff41]">
        {formatPrice(utiPro.proPrice)}
      </span>
      <span className="text-sm text-gray-400 ml-1">
        {utiPro.isUserPro ? ' seu preço PRO' : ' for Pros'}
      </span>
    </div>
  );
};

export default ProductCardProPrice;


