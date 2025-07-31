import React from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';

// Importar componentes especializados da MainContent
import ProductGalleryEnhanced from '../MainContent/ProductGalleryEnhanced';
import PlatformSelectorExpanded from '../MainContent/PlatformSelectorExpanded';
import RelatedProductsSection from '../RelatedProductsSection';
import ProductSpecificationsTable from '../MainContent/ProductSpecificationsTable';
import ProductDescriptionExpandable from '../MainContent/ProductDescriptionExpandable';
import ProductReviewsWithPhotos from '../MainContent/ProductReviewsWithPhotos';
import ProductFAQSection from '../MainContent/ProductFAQSection';

interface ProductMainContentProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  className?: string;
}

const ProductMainContent: React.FC<ProductMainContentProps> = ({
  product,
  skuNavigation,
  className
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      {/* 1. Galeria de Imagens - Destaque Principal */}
      <ProductGalleryEnhanced product={product} />

      {/* 2. Seletor de Plataformas Expandido (se aplicável) */}
      {skuNavigation && (
        <PlatformSelectorExpanded skuNavigation={skuNavigation} />
      )}

      {/* 3. Produtos Relacionados */}
      <RelatedProductsSection 
        product={product}
      />

      {/* 4. Especificações Técnicas */}
      <ProductSpecificationsTable product={product} />

      {/* 5. Descrição Expandível */}
      <ProductDescriptionExpandable product={product} />

      {/* 6. Avaliações com Fotos */}
      <ProductReviewsWithPhotos product={product} />

      {/* 7. Perguntas Frequentes */}
      <ProductFAQSection product={product} />

      {/* 8. Seção Final - Produtos Relacionados Adicional */}
      <div className="border-t border-gray-200 pt-8">
        <RelatedProductsSection 
          product={product}
        />
      </div>

      {/* 9. Call-to-Action Final */}
      <div className="bg-gradient-to-r from-red-50 to-blue-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <h4 className="text-xl font-bold text-gray-900 mb-2">
          🎮 Gostou deste produto?
        </h4>
        <p className="text-gray-700 mb-4">
          Adicione ao carrinho agora e aproveite nossas condições especiais!
        </p>
        <div className="flex gap-3 justify-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            🛒 Adicionar ao Carrinho
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            ⚡ Comprar Agora
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-3">
          ✅ Frete grátis • ✅ Garantia • ✅ UTI Coins • ✅ Suporte especializado
        </div>
      </div>
    </div>
  );
};

export default ProductMainContent;

