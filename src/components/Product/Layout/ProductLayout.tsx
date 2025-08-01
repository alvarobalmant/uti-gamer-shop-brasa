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
      {/* Layout principal: 3 colunas + sidebar separada */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Container das 3 primeiras colunas + seções inferiores */}
        <div className="flex-1 lg:pr-6">
          {/* Top: Layout das 3 colunas superiores */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* COLUNA 1: Container da Galeria Vertical */}
            <div className="w-full lg:w-20 order-2 lg:order-1">
              {/* ELEMENTO sticky da galeria */}
              <div className="sticky top-4 z-10 h-fit">
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
              <div className="sticky top-4 z-10 h-fit">
                <ProductMainContent 
                  product={product}
                  skuNavigation={skuNavigation}
                  layout="main-image"
                />
              </div>
            </div>

            {/* COLUNA 3: Informações do Produto - ALTURA NATURAL */}
            <div className="flex-1 order-3" id="product-info-column">
              <ProductMainContent 
                product={product}
                skuNavigation={skuNavigation}
                layout="product-info"
              />
            </div>
          </div>

          {/* Seções inferiores - COMEÇAM IMEDIATAMENTE APÓS COLUNA 3 */}
          <div className="mt-12">
            {/* Desktop: mantém o alinhamento com as colunas acima */}
            <div className="hidden lg:flex lg:gap-6">
              {/* Espaço alinhado com coluna 1 */}
              <div className="w-20"></div>
              {/* Espaço alinhado com colunas 2+3 */}
              <div className="w-96 flex-1">
                <ProductMainContent 
                  product={product}
                  skuNavigation={skuNavigation}
                  layout="bottom-sections"
                />
              </div>
            </div>
            
            {/* Mobile: largura total */}
            <div className="block lg:hidden">
              <ProductMainContent 
                product={product}
                skuNavigation={skuNavigation}
                layout="bottom-sections"
              />
            </div>
          </div>
        </div>

        {/* COLUNA 4: Sidebar de Compra - STICKY independente, ao lado do conteúdo */}
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
    </div>
  );
};

export default ProductLayout;

