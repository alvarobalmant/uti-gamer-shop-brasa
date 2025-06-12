
import React, { useEffect } from 'react';
import { PageLayoutItem, Page } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import { BannerConfig, ProductShowcase, PlatformTheme, NewsSection } from '@/types/platformPages';
import PlatformBanner from '@/components/Platform/PlatformBanner';
import PlatformProductSection from '@/components/Platform/PlatformProductSection';
import PlatformNewsSection from '@/components/Platform/PlatformNewsSection';
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
<<<<<<< HEAD
  // Convert Supabase data to PlatformTheme format
  const convertToPlatformTheme = (pageTheme: any): PlatformTheme => {
    return {
      primaryColor: pageTheme?.primaryColor || '#107C10',
      secondaryColor: pageTheme?.secondaryColor || '#3A3A3A',
      accentColor: pageTheme?.accentColor || '#0E6B0E',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      primaryGradient: `linear-gradient(135deg, ${pageTheme?.primaryColor || '#107C10'} 0%, ${pageTheme?.accentColor || '#0E6B0E'} 100%)`,
      shadowColor: `rgba(0, 0, 0, 0.1)`,
      borderRadius: '8px',
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      brandElements: {
        buttonStyle: 'rounded',
        cardStyle: 'elevated',
        animationStyle: 'smooth',
      }
    };
  };

  // Convert Supabase section_config to BannerConfig
  const convertToBannerConfig = (sectionConfig: any, sectionTitle: string): BannerConfig => {
    return {
      type: sectionConfig?.type || 'hero',
      layout: sectionConfig?.layout || 'full-width',
      title: sectionConfig?.title || sectionTitle || '',
      subtitle: sectionConfig?.subtitle || '',
      description: sectionConfig?.description || '',
      ctaText: sectionConfig?.ctaText || '',
      ctaLink: sectionConfig?.ctaLink || '',
      backgroundType: sectionConfig?.backgroundType || 'gradient',
      contentPosition: sectionConfig?.contentPosition || 'left',
      textAlign: sectionConfig?.textAlign || 'left',
      overlay: sectionConfig?.overlay || {
        color: 'rgba(0, 0, 0, 0.3)',
        opacity: 0.3
      }
    };
  };

  // Convert Supabase section_config to ProductShowcase
  const convertToProductConfig = (sectionConfig: any, sectionTitle: string): ProductShowcase => {
    return {
      type: sectionConfig?.type || 'grid',
      title: sectionTitle || '',
      subtitle: sectionConfig?.subtitle || '',
      filter: {
        tagIds: sectionConfig?.filter?.tagIds || [],
        categoryIds: sectionConfig?.filter?.categoryIds || [],
        featured: sectionConfig?.filter?.featured || false,
        newReleases: sectionConfig?.filter?.newReleases || false,
        onSale: sectionConfig?.filter?.onSale || false,
        limit: sectionConfig?.filter?.limit || 6
      },
      columns: sectionConfig?.columns || 3,
      showPrices: sectionConfig?.showPrices !== false,
      showBadges: sectionConfig?.showBadges !== false,
      cardStyle: sectionConfig?.cardStyle || 'compact'
    };
  };

  // Convert Supabase section_config to NewsSection array
  const convertToNewsConfig = (sectionConfig: any): NewsSection[] => {
    if (sectionConfig?.articles && Array.isArray(sectionConfig.articles)) {
      return sectionConfig.articles.map((article: any) => ({
        id: article.id || Math.random().toString(),
        title: article.title || '',
        category: article.category || 'Notícias',
        excerpt: article.excerpt || '',
        imageUrl: article.imageUrl || '/news/default-news.jpg',
        publishDate: article.publishDate || new Date().toISOString(),
        readTime: article.readTime || '3 min',
        tags: article.tags || [],
        link: article.link || '#'
      }));
    }
    return [];
  };

=======
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
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

<<<<<<< HEAD
  // Apply page theme to CSS variables
  useEffect(() => {
    const theme = convertToPlatformTheme(page?.theme);
    const root = document.documentElement;
    
    root.style.setProperty('--platform-primary', theme.primaryColor);
    root.style.setProperty('--platform-secondary', theme.secondaryColor);
    root.style.setProperty('--platform-accent', theme.accentColor);
    root.style.setProperty('--platform-background', theme.backgroundColor);
    root.style.setProperty('--platform-text', theme.textColor);
    
    if (theme.primaryGradient) {
      root.style.setProperty('--platform-gradient-primary', theme.primaryGradient);
    }

    return () => {
      root.style.removeProperty('--platform-primary');
      root.style.removeProperty('--platform-secondary');
      root.style.removeProperty('--platform-accent');
      root.style.removeProperty('--platform-background');
      root.style.removeProperty('--platform-text');
      root.style.removeProperty('--platform-gradient-primary');
    };
  }, [page?.theme]);

=======
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
  // Use both naming conventions for compatibility
  const isVisible = section.is_visible ?? section.isVisible ?? true;
  const sectionType = section.section_type || section.sectionType || 'products';
  const sectionConfig = section.sectionConfig || {};
<<<<<<< HEAD
  const sectionTitle = section.title || '';

  if (!isVisible) return null;

  const theme = convertToPlatformTheme(page?.theme);
=======

  if (!isVisible) return null;
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
  
  switch (sectionType) {
    case 'banner':
      const bannerConfig = convertToBannerConfig(sectionConfig, sectionTitle);
      return (
        <PlatformBanner
          key={section.id}
<<<<<<< HEAD
          config={bannerConfig}
          theme={theme}
=======
          title={sectionConfig?.title || section.title || ''}
          subtitle={sectionConfig?.subtitle || ''}
          imageUrl={sectionConfig?.imageUrl || '/banners/default-banner.jpg'}
          ctaText={sectionConfig?.ctaText}
          ctaLink={sectionConfig?.ctaLink}
          theme={page?.theme}
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
        />
      );
    
    case 'products':
    case 'featured':
<<<<<<< HEAD
      const productConfig = convertToProductConfig(sectionConfig, sectionTitle);
      const sectionProducts = getFilteredProducts(sectionConfig);
      
=======
      const sectionProducts = getFilteredProducts(sectionConfig);
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
      return (
        <PlatformProductSection
          key={section.id}
          config={productConfig}
          theme={theme}
          products={sectionProducts}
<<<<<<< HEAD
=======
          loading={false}
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
          onAddToCart={onAddToCart}
          onProductClick={onProductCardClick}
        />
      );
    
    case 'news':
      const newsArticles = convertToNewsConfig(sectionConfig);
      const newsLayout = sectionConfig?.layout || 'grid';
      
      if (newsArticles.length > 0) {
        return (
          <PlatformNewsSection
            key={section.id}
            articles={newsArticles}
            theme={theme}
            layout={newsLayout}
            title={sectionTitle}
            subtitle={sectionConfig?.subtitle}
          />
        );
      }
      
      // Fallback to simple section if no news articles
      return (
        <div 
          key={section.id} 
          className="py-16"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.textColor,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {sectionTitle}
            </h2>
            <p className="text-xl opacity-80">
              Seção de notícias em desenvolvimento...
            </p>
          </div>
        </div>
      );
    
    case 'custom':
      return (
<<<<<<< HEAD
        <div 
          key={section.id} 
          className="py-8 container mx-auto"
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
=======
        <div key={section.id} className="py-8 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
          <div dangerouslySetInnerHTML={{ __html: sectionConfig?.content || '' }} />
        </div>
      );
    
    default:
      return null;
  }
};

export default PlatformSectionRenderer;
