
import React from 'react';
import { Product } from '@/hooks/useProducts';
import ProductCardImage from './ProductCard/ProductCardImage';
import ProductCardInfo from './ProductCard/ProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardStock from './ProductCard/ProductCardStock';
import ProductCardActions from './ProductCard/ProductCardActions';
import { Card, CardContent } from '@/components/ui/card';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <Card className="group overflow-hidden border border-border/60 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/40">
      <CardContent className="p-0">
        <ProductCardImage product={product} />
        
        <div className="p-4 space-y-3">
          <ProductCardInfo product={product} />
          <ProductCardPrice product={product} />
          <ProductCardStock product={product} />
          <ProductCardActions 
            product={product} 
            onAddToCart={onAddToCart}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
