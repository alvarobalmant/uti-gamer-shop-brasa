
import React from 'react';
import { SectionRendererProps } from './SectionRendererProps';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import ServiceCards from '@/components/ServiceCards';
import HeroQuickLinks from '@/components/HeroQuickLinks';

const SectionRenderer: React.FC<SectionRendererProps> = ({
  sectionKey,
  bannerData,
  products,
  sections,
  productsLoading,
  sectionsLoading,
  onAddToCart
}) => {
  // Handle loading states
  if (productsLoading || sectionsLoading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <div className="text-xl text-gray-500">Carregando seção...</div>
      </div>
    );
  }

  switch (sectionKey) {
    case 'hero_banner':
      return <HeroBannerCarousel />;
    
    case 'hero_quick_links':
      return <HeroQuickLinks />;
    
    case 'service_cards':
      return <ServiceCards />;
    
    case 'featured_products':
      return (
        <FeaturedProductsSection
          products={products}
          onAddToCart={onAddToCart}
        />
      );
    
    default:
      // Handle product sections
      const section = sections.find(s => s.id === sectionKey);
      if (section) {
        return (
          <FeaturedProductsSection
            products={products}
            onAddToCart={onAddToCart}
            title={section.title}
            viewAllLink={section.view_all_link}
          />
        );
      }
      
      return null;
  }
};

export default SectionRenderer;
