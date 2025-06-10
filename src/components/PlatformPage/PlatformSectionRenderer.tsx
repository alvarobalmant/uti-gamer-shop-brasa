
import React from 'react';
import { PageLayoutItem, Page } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import SpecialSectionRenderer from '@/components/SpecialSections/SpecialSectionRenderer';
import { useSpecialSections } from '@/hooks/useSpecialSections';

interface PlatformSectionRendererProps {
  section: PageLayoutItem;
  page: Page;
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onProductCardClick: (productId: string) => void;
}

// Component responsible for rendering individual sections based on their type
const PlatformSectionRenderer: React.FC<PlatformSectionRendererProps> = ({
  section,
  page,
  products,
  onAddToCart,
  onProductCardClick
}) => {
  const { specialSections } = useSpecialSections();

  // Filter products based on section configuration
  const getFilteredProducts = (sectionConfig: any) => {
    if (!sectionConfig || !sectionConfig.filter) return products;
    
    const { tagIds, limit } = sectionConfig.filter;
    
    let filtered = products;
    
    // Filter by tags
    if (tagIds && tagIds.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => 
          tagIds.includes(tag.id) || tagIds.includes(tag.name.toLowerCase())
        )
      );
    }
    
    // Limit quantity
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  // Use both naming conventions for compatibility
  const isVisible = section.is_visible ?? section.isVisible ?? true;
  const sectionType = (section.section_type || section.sectionType || 'products') as 'products' | 'banner' | 'featured' | 'custom' | 'special';
  const sectionConfig = section.sectionConfig || {};

  console.log(`[PlatformSectionRenderer] Rendering section ${section.id} (${section.title}):`, {
    isVisible,
    sectionType,
    sectionConfig
  });

  if (!isVisible) {
    console.log(`[PlatformSectionRenderer] Section ${section.id} is not visible, skipping render`);
    return null;
  }
  
  switch (sectionType) {
    case 'banner':
      return (
        <HeroBanner
          key={section.id}
          title={sectionConfig?.title || section.title || ''}
          subtitle={sectionConfig?.subtitle || ''}
          imageUrl={sectionConfig?.imageUrl || '/banners/default-banner.jpg'}
          ctaText={sectionConfig?.ctaText}
          ctaLink={sectionConfig?.ctaLink}
          theme={page?.theme}
        />
      );
    
    case 'products':
    case 'featured':
      const sectionProducts = getFilteredProducts(sectionConfig);
      return (
        <FeaturedProductsSection
          key={section.id}
          products={sectionProducts}
          loading={false}
          onAddToCart={onAddToCart}
          title={section.title || ''}
          onCardClick={onProductCardClick}
        />
      );
    
    case 'special':
      // Renderizar seção especial se configurada
      if (sectionConfig?.specialSectionId) {
        const specialSection = specialSections.find(s => s.id === sectionConfig.specialSectionId);
        if (specialSection) {
          return (
            <SpecialSectionRenderer
              key={section.id}
              section={specialSection}
              onProductCardClick={onProductCardClick}
            />
          );
        }
      }
      return null;
    
    case 'custom':
      return (
        <div key={section.id} className="py-8 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: sectionConfig?.content || '' }} />
        </div>
      );
    
    default:
      console.warn(`[PlatformSectionRenderer] Unknown section type: ${sectionType}`);
      return null;
  }
};

export default PlatformSectionRenderer;
