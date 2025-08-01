import React from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';
import ProductMainContent from './ProductMainContent';
import ProductSidebar from './ProductSidebar';

interface ProductLayoutProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  onAddToCart: (product: Product) => void;
  className?: string;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({
  product,
  skuNavigation,
  onAddToCart,
  className
}) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-6", className)}>
      {/* Layout em 4 colunas com sticky nos ELEMENTOS das colunas 1 e 2 */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* COLUNA 1: Container da Galeria Vertical */}
        <div className="w-full lg:w-20 order-2 lg:order-1">
          {/* ELEMENTO sticky da galeria */}
          <div className="sticky top-4 z-10">
            <ProductMainContent 
              product={product}
              skuNavigation={skuNavigation}
              layout="gallery-vertical"
            />
          </div>
        </div>

        {/* COLUNA 2: Container da Imagem Principal */}
        <div className="w-full lg:w-96 order-1 lg:order-2">
          {/* ELEMENTO sticky da imagem */}
          <div className="sticky top-4 z-10">
            <ProductMainContent 
              product={product}
              skuNavigation={skuNavigation}
              layout="main-image"
            />
          </div>
        </div>

        {/* COLUNA 3: Informações do Produto - ALTURA NATURAL */}
        <div className="flex-1 order-3">
          <ProductMainContent 
            product={product}
            skuNavigation={skuNavigation}
            layout="product-info"
          />
        </div>

        {/* COLUNA 4: Sidebar de Compra - STICKY independente */}
        <div className="w-full lg:w-80 order-4">
          <div className="sticky top-4 z-10">
            <ProductSidebar
              product={product}
              skuNavigation={skuNavigation}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Seções inferiores */}
      <div className="mt-12">
        <ProductMainContent 
          product={product}
          skuNavigation={skuNavigation}
          layout="bottom-sections"
        />
      </div>
    </div>
  );
};

export default ProductLayout;

