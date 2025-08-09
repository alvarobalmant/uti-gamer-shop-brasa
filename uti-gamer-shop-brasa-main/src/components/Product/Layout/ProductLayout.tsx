import React, { useEffect, useRef } from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';
import ProductMainContent from './ProductMainContent';
import ProductSidebar from './ProductSidebar';
import { useStickyWithBounds } from '@/hooks/useStickyWithBounds';

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
  const mainImageRef = useRef<HTMLDivElement>(null);
  
  // Initialize sticky behavior com offset natural para não grudar no header
  const { registerStickyElement, unregisterStickyElement, refreshBounds } = useStickyWithBounds({
    enabled: true,
    referenceElementId: 'product-info-column',
    naturalOffset: 120 // 120px de offset natural do header
  });

  // Register sticky elements when they mount - apenas imagem principal
  useEffect(() => {
    if (mainImageRef.current) {
      registerStickyElement('main-image-sticky', mainImageRef.current);
    }

    return () => {
      unregisterStickyElement('main-image-sticky');
    };
  }, [registerStickyElement, unregisterStickyElement]);

  // Refresh bounds when product changes (layout might change)
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshBounds();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [product, refreshBounds]);
  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-6", className)}>
      {/* Layout principal: 2 colunas + sidebar separada */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Container da imagem e galeria + seções inferiores */}
        <div className="flex-1 lg:pr-6">
          {/* Top: Layout das 2 colunas superiores */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* COLUNA 1: Container da Imagem Principal + Galeria UNIFICADOS */}
            <div className="w-full lg:w-[480px] order-1 lg:order-1">
              {/* ELEMENTO sticky unificado - imagem + galeria juntos */}
              <div ref={mainImageRef} className="h-fit z-10">
                <ProductMainContent 
                  product={product}
                  skuNavigation={skuNavigation}
                  layout="main-image"
                />
                
                {/* Galeria Horizontal centralizada - sempre abaixo da imagem */}
                <div className="mt-4 flex justify-center">
                  <ProductMainContent 
                    product={product}
                    skuNavigation={skuNavigation}
                    layout="gallery-horizontal"
                  />
                </div>
              </div>
            </div>

            {/* COLUNA 2: Informações do Produto - ALTURA NATURAL */}
            <div className="flex-1 order-2" id="product-info-column">
              <ProductMainContent 
                product={product}
                skuNavigation={skuNavigation}
                layout="product-info"
              />
            </div>
          </div>

          {/* Seções inferiores */}
          <div className="mt-12">
            {/* Desktop: mantém o alinhamento com as colunas acima */}
            <div className="hidden lg:flex lg:gap-6">
              {/* Container dos elementos inferiores alinhado com a imagem */}
              <div className="w-[480px] flex-1">
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

