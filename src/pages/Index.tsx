import { useEffect } from "react";
import { useHomepageLayout } from "@/hooks/useHomepageLayout";
import { useProducts } from "@/hooks/useProducts";
import { useTopDeals } from "@/hooks/useTopDeals";
import { useProductSections } from "@/hooks/useProductSections";
import { useBanners } from "@/hooks/useBanners";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { useServiceCards } from "@/hooks/useServiceCards";
import { useCart } from "@/hooks/useCart";
import HeroBannerCarousel from "@/components/HeroBannerCarousel";
import HeroQuickLinks from "@/components/HeroQuickLinks";
import PromotionalBanner from "@/components/PromotionalBanner";
import FeaturedProductsSection from "@/components/FeaturedProducts/FeaturedProductsSection";
import ServiceCards from "@/components/ServiceCards";
import TopDealsSectionRenderer from "@/components/TopDeals/TopDealsSectionRenderer";

const Index = () => {
  const { layoutItems, loading: layoutLoading } = useHomepageLayout();
  const { products, loading: productsLoading } = useProducts();
  const { sections: productSections, loading: productSectionsLoading } = useProductSections();
  const { sections: topDealSections, loading: topDealSectionsLoading } = useTopDeals();
  const { banners, loading: bannersLoading } = useBanners();
  const { quickLinks, loading: quickLinksLoading } = useQuickLinks();
  const { serviceCards, loading: serviceCardsLoading } = useServiceCards();
  const { addToCart } = useCart();

  // Render a section based on its key
  const renderSection = (sectionKey: string) => {
    // Fixed sections
    if (sectionKey === 'hero_banner') {
      return <HeroBannerCarousel key={sectionKey} banners={banners} loading={bannersLoading} />;
    }
    
    if (sectionKey === 'hero_quick_links') {
      return <HeroQuickLinks key={sectionKey} quickLinks={quickLinks} loading={quickLinksLoading} />;
    }
    
    if (sectionKey === 'promo_banner') {
      return <PromotionalBanner key={sectionKey} />;
    }
    
    if (sectionKey === 'specialized_services' || sectionKey === 'why_choose_us' || sectionKey === 'contact_help') {
      return <ServiceCards key={sectionKey} type={sectionKey} serviceCards={serviceCards} loading={serviceCardsLoading} />;
    }
    
    // Dynamic product sections
    if (sectionKey.startsWith('product_section_')) {
      const sectionId = sectionKey.replace('product_section_', '');
      const section = productSections.find(s => s.id === sectionId);
      
      if (!section) return null;
      
      // Get products for this section
      const sectionProducts = section.items
        ? products.filter(product => 
            section.items?.some(item => 
              (item.item_type === 'product' && item.item_id === product.id) ||
              (item.item_type === 'tag' && product.tags?.some(tag => tag.name === item.item_id))
            )
          )
        : [];
      
      return (
        <FeaturedProductsSection
          key={sectionKey}
          products={sectionProducts}
          loading={productsLoading || productSectionsLoading}
          onAddToCart={addToCart}
          title={section.title}
          viewAllLink={section.view_all_link || undefined}
        />
      );
    }
    
    // Top Deals sections
    if (sectionKey.startsWith('top_deal_section_')) {
      const sectionId = sectionKey.replace('top_deal_section_', '');
      const section = topDealSections.find(s => s.id === sectionId);
      
      if (!section) return null;
      
      return (
        <TopDealsSectionRenderer
          key={sectionKey}
          layoutItem={{ id: 0, section_key: sectionKey, display_order: 0, is_visible: true }}
          section={section}
          products={products}
          loading={productsLoading || topDealSectionsLoading}
          onAddToCart={addToCart}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen">
      {layoutLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Carregando página inicial...</p>
        </div>
      ) : (
        <>
          {/* Render sections in order based on layout configuration */}
          {layoutItems
            .filter(item => item.is_visible)
            .map(item => renderSection(item.section_key))}
        </>
      )}
    </div>
  );
};

export default Index;
