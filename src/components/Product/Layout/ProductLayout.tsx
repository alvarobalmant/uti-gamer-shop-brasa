import React from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';
import ProductMainContent from './ProductMainContent';
import ProductSidebar from './ProductSidebar';

interface ProductLayoutProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  viewingCount: number;
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({
  product,
  skuNavigation,
  viewingCount,
  onAddToCart,
  className
}) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-6", className)}>
      {/* Layout Grid 65/35 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Principal (65% - 8 colunas de 12) */}
        <div className="lg:col-span-8">
          <ProductMainContent 
            product={product}
            skuNavigation={skuNavigation}
          />
        </div>

        {/* Sidebar (35% - 4 colunas de 12) */}
        <div className="lg:col-span-4">
          <ProductSidebar
            product={product}
            skuNavigation={skuNavigation}
            viewingCount={viewingCount}
            onAddToCart={onAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;

