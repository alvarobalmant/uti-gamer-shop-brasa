
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { ProductSection } from '@/hooks/useProductSections';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks';
import PromotionalBanner from '@/components/PromotionalBanner';
import SpecializedServicesUltraCompact from '@/components/ServiceCards/SpecializedServicesUltraCompact';
import WhyChooseUsWithReviews from '@/components/ServiceCards/WhyChooseUsWithReviews';
import ContactHelp from '@/components/ServiceCards/ContactHelp';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';


interface SectionRendererProps {
  sectionKey: string;
  bannerData: {
    imageUrl: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    targetBlank: boolean;
  };
  products: Product[];
  sections: ProductSection[];
  productsLoading: boolean;
  sectionsLoading: boolean;
  onAddToCart: (product: any, size?: string, color?: string) => void;
  reduceTopSpacing?: boolean;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  sectionKey,
  bannerData,
  products,
  sections,
  productsLoading,
  sectionsLoading,
  onAddToCart,
  reduceTopSpacing = false
}) => {
  const renderSection = () => {
    switch (sectionKey) {
      case 'hero_banner':
        return <HeroBannerCarousel key="hero_banner" />;
      
      case 'hero_quick_links':
        return <HeroQuickLinks key="hero_quick_links" />;

      case 'promo_banner':
        return (
          <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
            <PromotionalBanner {...bannerData} />
          </div>
        );
      
      case 'specialized_services':
        return <SpecializedServicesUltraCompact key="specialized_services" />;
      case 'why_choose_us':
        return <WhyChooseUsWithReviews key="why_choose_us" />;
      case 'contact_help':
        return <ContactHelp key="contact_help" />;
      
      default:
        // Handle product sections - Add safety checks
        if (sectionKey.startsWith('product_section_')) {
          const sectionId = sectionKey.replace('product_section_', '');
          
          // Safety check: Ensure sections array exists
          if (!sections || !Array.isArray(sections)) {
            console.warn(`[SectionRenderer] Sections not available for ${sectionKey}`);
            return null;
          }
          
          const section = sections.find(s => s.id === sectionId);
          
          if (!section) {
            console.warn(`[SectionRenderer] Section not found: ${sectionId}`);
            return null;
          }
          
          // Safety check: Ensure products array exists
          if (!products || !Array.isArray(products)) {
            console.warn(`[SectionRenderer] Products not available for ${sectionKey}`);
            return null;
          }
          
          // --- IMPROVED: Use products with is_featured or all products if no items configured ---
          const productMap = new Map<string, Product>();
          
          // Check if section has specific items configured
          const hasConfiguredItems = section.items && Array.isArray(section.items) && section.items.length > 0;
          
          if (hasConfiguredItems) {
            // Use configured items (legacy behavior)
            for (const item of section.items!) {
              if (item.item_type === 'product') {
                const product = products.find(p => p.id === item.item_id);
                if (product && product.product_type !== 'master' && !productMap.has(product.id)) {
                  productMap.set(product.id, product);
                }
              } else if (item.item_type === 'tag') {
                const tagProducts = products.filter(p => 
                  p.product_type !== 'master' &&
                  p.tags?.some(tag => tag.name.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                tagProducts.forEach(product => {
                  if (!productMap.has(product.id)) {
                     productMap.set(product.id, product);
                  }
                });
              }
            }
          } else {
            // Fallback: Use featured products or all products (limited to 12)
            const featuredProducts = products.filter(p => 
              p.product_type !== 'master' && p.is_featured
            );
            
            // If we have featured products, use them; otherwise use first 12 products
            const productsToShow = featuredProducts.length > 0 
              ? featuredProducts.slice(0, 12) 
              : products.filter(p => p.product_type !== 'master').slice(0, 12);
            
            productsToShow.forEach(product => {
              productMap.set(product.id, product);
            });
          }
          
          const uniqueSectionProducts = Array.from(productMap.values());
          // --- END IMPROVED ---
          
          return (
            <div data-section={sectionKey} data-testid="section-renderer">
              <FeaturedProductsSection
                key={sectionKey}
                sectionKey={sectionKey} // ← CRÍTICO: Adicionar sectionKey
                products={uniqueSectionProducts} // Pass unique products
                loading={productsLoading || sectionsLoading}
                onAddToCart={onAddToCart}
                title={section.title}
                titlePart1={section.title_part1}
                titlePart2={section.title_part2}
                titleColor1={section.title_color1}
                titleColor2={section.title_color2}
                viewAllLink={section.view_all_link || `/secao/${sectionKey}`}
                reduceTopSpacing={reduceTopSpacing}
              />
            </div>
          );
        }
        
        return null;
    }
  };

  return renderSection();
};

export default SectionRenderer;
