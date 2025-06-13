
import React, { useEffect } from 'react';
import { PageLayoutItem, Page } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import { BannerConfig, ProductShowcase, PlatformTheme, NewsSection } from '@/types/platformPages';
import PlatformBanner from '@/components/Platform/PlatformBanner';
import PlatformProductSection from '@/components/Platform/PlatformProductSection';
import PlatformNewsSection from '@/components/Platform/PlatformNewsSection';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import { ProductOverride } from '@/types/xbox4Admin';

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
      type: 'grid' as const,
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
      cardStyle: 'compact' as const
    };
  };

  // Convert Supabase section_config to NewsSection array
  const convertToNewsConfig = (sectionConfig: any): NewsSection[] => {
    // Check if this is an Xbox4 specific news section
    if (section.section_key === 'xbox4_news' && sectionConfig?.articles) {
      return sectionConfig.articles.map((item: any) => ({
        id: item.id || Math.random().toString(),
        title: item.title || '',
        category: item.category || 'Notícias',
        excerpt: item.excerpt || '',
        imageUrl: item.imageUrl || '/news/default-news.jpg',
        publishDate: item.publishDate || new Date().toISOString(),
        readTime: item.readTime || '3 min',
        tags: item.tags || [],
        link: item.link || '#'
      }));
    }
    
    // Default news configuration
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

  // CORREÇÃO CRÍTICA: Filter and enhance products based on section configuration
  const getFilteredProducts = (sectionConfig: any) => {
    if (!sectionConfig) return products;
    
    // PRIORITY 1: Handle Xbox4 specific product configuration with specific products and overrides
    const specificProducts = sectionConfig.products || [];
    
    if (specificProducts && specificProducts.length > 0) {
      console.log(`Renderizando produtos específicos para seção ${section.title}:`, specificProducts);
      
      // Map specific products to complete product objects
      const productsToRender = specificProducts
        .map((specificProduct: ProductOverride) => {
          // Find the base product by ID
          const baseProduct = products.find(p => p.id === specificProduct.productId);
          if (!baseProduct) {
            console.warn(`Produto com ID ${specificProduct.productId} não encontrado`);
            return null;
          }
          
          // Apply overrides if provided
          return {
            ...baseProduct,
            // Apply title override if provided
            name: specificProduct.title || baseProduct.name,
            // Apply image override if provided
            image: specificProduct.imageUrl || baseProduct.image,
            // Apply badge override if provided
            badge_text: specificProduct.badge?.text || baseProduct.badge_text,
            badge_color: specificProduct.badge?.color || baseProduct.badge_color
          };
        })
        .filter(Boolean); // Remove nulls
      
      console.log(`Produtos renderizados para ${section.title}:`, productsToRender.map(p => p?.name));
      return productsToRender;
    }
    
    // FALLBACK: Default product filtering logic (by tags)
    const { tagIds, limit } = sectionConfig.filter || {};
    
    console.log(`Usando filtro de tags para seção ${section.title}:`, tagIds);
    
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

  // Use both naming conventions for compatibility
  const isVisible = section.is_visible ?? section.isVisible ?? true;
  const sectionType = section.section_type || section.sectionType || 'products';
  const sectionConfig = section.sectionConfig || {};
  const sectionTitle = section.title || '';

  if (!isVisible) return null;

  const theme = convertToPlatformTheme(page?.theme);
  
  switch (sectionType) {
    case 'banner':
      const bannerConfig = convertToBannerConfig(sectionConfig, sectionTitle);
      return (
        <PlatformBanner
          key={section.id}
          config={bannerConfig}
          theme={theme}
        />
      );
    
    case 'products':
    case 'featured':
      const productConfig = convertToProductConfig(sectionConfig, sectionTitle);
      const sectionProducts = getFilteredProducts(sectionConfig);
      
      return (
        <PlatformProductSection
          key={section.id}
          config={productConfig}
          theme={theme}
          products={sectionProducts}
          onAddToCart={onAddToCart}
          onProductClick={onProductCardClick}
        />
      );
    
    case 'news' as any:
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
        <div 
          key={section.id} 
          className="py-8 container mx-auto"
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
          <div dangerouslySetInnerHTML={{ __html: sectionConfig?.content || '' }} />
        </div>
      );
    
    default:
      return null;
  }
};

export default PlatformSectionRenderer;
