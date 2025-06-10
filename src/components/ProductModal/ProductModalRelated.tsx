import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

interface ProductModalRelatedProps {
  products: Product[];
  onProductClick?: (productId: string) => void;
}

const ProductModalRelated: React.FC<ProductModalRelatedProps> = ({
  products,
  onProductClick
}) => {
  if (products.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Você também pode gostar</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onProductClick?.(product.id)}
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 rounded-md mb-2 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                {product.name}
              </h4>
              
              <div className="text-sm font-semibold text-gray-900">
                {formatPrice(product.price)}
              </div>
              
              <div className="text-xs text-blue-600">
                {formatPrice(product.price * 0.9)} com Pro
              </div>
            </div>

            {/* Quick Add Button */}
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick?.(product.id);
              }}
            >
              Ver Detalhes
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductModalRelated;

