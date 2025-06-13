
import React from 'react';
import { RelatedProductsProps } from './RelatedProductsProps';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  currentProductId,
  onProductClick
}) => {
  const { addToCart } = useCart();

  if (relatedProducts.length === 0) {
    return null;
  }

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleProductClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Produtos Relacionados
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onCardClick={handleProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
