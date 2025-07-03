import React, { memo } from 'react';
import ProductHero from '@/components/Product/ProductHero';
import ProductTabsEnhanced from '@/components/Product/ProductTabsEnhanced';
import RelatedProductsSection from '@/components/Product/RelatedProductsSection';
import ProductFAQ from '@/components/Product/ProductFAQ';
import ProductGuarantees from '@/components/Product/ProductGuarantees';
import PlatformSelector from '@/components/SKU/PlatformSelector';
import SKUPriceComparison from '@/components/SKU/SKUPriceComparison';
import { Product } from '@/hooks/useProducts/types';
import { SKUNavigation } from '@/hooks/useProducts/types';

interface ProductPageSKUContentProps {
  product: Product;
  viewingCount: number;
  shouldShowSKUComponents: boolean;
  skuNavigation: SKUNavigation | null;
  onAddToCart: (product: any) => Promise<void>;
}

const ProductPageSKUContent = memo(({ 
  product, 
  viewingCount, 
  shouldShowSKUComponents, 
  skuNavigation, 
  onAddToCart 
}: ProductPageSKUContentProps) => {
  return (
    <>
      {/* Hero do Produto */}
      <ProductHero 
        product={product}
        viewingCount={viewingCount}
        onAddToCart={onAddToCart}
      />

      {/* Seletor de Plataforma (apenas para produtos com SKUs) */}
      {shouldShowSKUComponents && skuNavigation && (
        <div className="mb-6">
          <PlatformSelector skuNavigation={skuNavigation} />
        </div>
      )}

      {/* Comparação de Preços (apenas para produtos com múltiplos SKUs) */}
      {shouldShowSKUComponents && skuNavigation && skuNavigation.availableSKUs && skuNavigation.availableSKUs.length > 1 && (
        <div className="mb-6">
          <SKUPriceComparison skuNavigation={skuNavigation} />
        </div>
      )}

      {/* Abas do Produto */}
      <ProductTabsEnhanced product={product} />

      {/* Produtos Relacionados */}
      <RelatedProductsSection product={product} />

      {/* FAQ */}
      <ProductFAQ product={product} />

      {/* Garantias */}
      <ProductGuarantees />
    </>
  );
});

ProductPageSKUContent.displayName = 'ProductPageSKUContent';

export default ProductPageSKUContent;