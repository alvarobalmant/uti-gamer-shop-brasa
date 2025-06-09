import React from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardProPriceProps {
  product: Product;
}

const ProductCardProPrice: React.FC<ProductCardProPriceProps> = ({ product }) => {
  const proPrice = product.price * 0.95; // Assuming this is the pro price calculation

  return (
    <div className="mt-0 text-left"> {/* Removendo margem superior já que o espaçamento vem do título */}
      <span className="text-base font-bold text-[#00ff41]"> {/* Cor neon verde para o preço, como na GameStop */}
        R$ {proPrice.toFixed(2)}
      </span>
      <span className="text-sm text-gray-400 ml-1"> for Pros</span> {/* Cor fosca para 'for Pros' com espaçamento */}
    </div>
  );
};

export default ProductCardProPrice;


