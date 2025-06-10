
import React from 'react';
import { PageLayoutItem, Page } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';

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
  // Filter products with base on section configuration
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

  if (!section.is_visible) return null;
  
  switch (section.section_type) {
    case 'banner':
      return (
        <HeroBanner
          key={section.id}
          title={section.section_config?.title || section.title || ''}
          subtitle={section.section_config?.subtitle || ''}
          imageUrl={section.section_config?.imageUrl || '/banners/default-banner.jpg'}
          ctaText={section.section_config?.ctaText}
          ctaLink={section.section_config?.ctaLink}
          theme={page?.theme}
        />
      );
    
    case 'products':
    case 'featured':
      const sectionProducts = getFilteredProducts(section.section_config);
      return (
        <FeaturedProductsSection
          key={section.id}
          products={sectionProducts}
          loading={false} // Not showing loading here to avoid flickering
          onAddToCart={onAddToCart}
          title={section.title || ''}
          onCardClick={onProductCardClick}
        />
      );
    
    case 'custom':
      return (
        <div key={section.id} className="py-8 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.section_config?.content || '' }} />
        </div>
      );
    
    default:
      return null;
  }
};

export default PlatformSectionRenderer;
