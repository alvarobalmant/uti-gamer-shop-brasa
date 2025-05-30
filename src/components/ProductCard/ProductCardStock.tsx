
import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductCardStockProps {
  product: Product;
}

const ProductCardStock: React.FC<ProductCardStockProps> = ({ product }) => {
  const isLowStock = product.stock && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="mb-4 md:mb-4 mb-3">
      {isOutOfStock ? (
        <span className="text-sm text-red-600 font-medium md:text-sm text-xs">Esgotado</span>
      ) : isLowStock ? (
        <span className="text-sm text-orange-600 font-medium md:text-sm text-xs">
          <span className="md:inline hidden">Restam {product.stock} unidades</span>
          <span className="md:hidden inline">Restam {product.stock}</span>
        </span>
      ) : (
        <span className="text-sm text-green-600 font-medium md:text-sm text-xs">Em estoque</span>
      )}
    </div>
  );
};

export default ProductCardStock;
