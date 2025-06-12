
import React from 'react';
import { Product } from '@/hooks/useProducts';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';
import { SpecialSection } from '@/types/specialSections';

interface SectionRendererProps {
  sectionKey: string;
  products?: Product[];
  specialSection?: SpecialSection;
  loading?: boolean;
  onAddToCart: (product: Product) => void;
  onProductCardClick: (productId: string) => void;
  sectionConfig?: any;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  sectionKey,
  products = [],
  specialSection,
  loading = false,
  onAddToCart,
  onProductCardClick,
  sectionConfig
}) => {
  console.log(`[SectionRenderer] Rendering section: ${sectionKey}`, {
    productsCount: products.length,
    hasSpecialSection: !!specialSection,
    loading,
    sectionConfig
  });

  // Handle special sections
  if (specialSection) {
    return (
      <SpecialSectionRenderer 
        section={specialSection} 
        onProductCardClick={onProductCardClick}
      />
    );
  }

  // Handle product sections based on section key
  switch (sectionKey) {
    case 'featured_products':
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          title="Produtos em Destaque"
          onCardClick={onProductCardClick}
        />
      );

    case 'console_deals':
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          title="Ofertas em Consoles"
          onCardClick={onProductCardClick}
        />
      );

    case 'game_deals':
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          title="Jogos em Promoção"
          onCardClick={onProductCardClick}
        />
      );

    case 'accessories':
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          title="Acessórios"
          onCardClick={onProductCardClick}
        />
      );

    default:
      // Use config-based rendering for custom sections
      const title = sectionConfig?.title || 'Produtos';
      const subtitle = sectionConfig?.subtitle;
      
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          title={title}
          subtitle={subtitle}
          onCardClick={onProductCardClick}
        />
      );
  }
};

export default SectionRenderer;
