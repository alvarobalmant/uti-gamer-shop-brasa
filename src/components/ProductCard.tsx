import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  getPlatformColor: (product: Product) => string;
}

import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardProPrice from './ProductCard/ProductCardProPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';

const ProductCard = ({ product, onAddToCart, getPlatformColor }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <ProductCardImage product={product} getPlatformColor={getPlatformColor} />
      
      <div className="p-4 flex-1 flex flex-col">
        <ProductCardInfo product={product} />
        <ProductCardProPrice product={product} />
        <ProductCardStock product={product} />
        
        <div className="mt-auto">
          <ProductCardActions product={product} onAddToCart={onAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
