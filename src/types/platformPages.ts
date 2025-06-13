
// Platform page types
export interface PlatformTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  primaryGradient: string;
  shadowColor: string;
  borderRadius: string;
  fontFamily: string;
  headingFont: string;
  brandElements: {
    buttonStyle: string;
    cardStyle: string;
    animationStyle: string;
  };
}

export interface BannerConfig {
  type: 'hero' | 'promotional' | 'feature';
  layout: 'full-width' | 'centered' | 'split';
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundType: 'image' | 'gradient' | 'color';
  contentPosition: 'left' | 'center' | 'right';
  textAlign: 'left' | 'center' | 'right';
  overlay?: {
    color: string;
    opacity: number;
  };
}

export interface ProductShowcase {
  type: 'grid' | 'carousel' | 'featured';
  title: string;
  subtitle?: string;
  filter: {
    tagIds: string[];
    categoryIds: string[];
    featured: boolean;
    newReleases: boolean;
    onSale: boolean;
    limit: number;
  };
  columns: number;
  showPrices: boolean;
  showBadges: boolean;
  cardStyle: 'compact' | 'detailed' | 'minimal';
  // Add Xbox4 specific properties
  imageAspectRatio?: string;
  imageObjectFit?: string;
  hoverEffects?: boolean;
  gridGap?: string;
  responsiveBreakpoints?: any;
  productOverrides?: any[];
}

export interface NewsSection {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  publishDate: string;
  readTime: string;
  tags: string[];
  link: string;
}
