
// Core types for pages and layouts
export interface PageTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  bannerImage?: string;
}

export interface PageFilter {
  tagIds?: string[];
  categoryIds?: string[];
  excludeTagIds?: string[];
  excludeCategoryIds?: string[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  theme: PageTheme;
  filters: PageFilter;
  createdAt: string;
  updatedAt: string;
}

export interface PageLayoutItem {
  id: string;
  page_id: string;
  section_key: string;
  title?: string;
  display_order: number;
  is_visible: boolean;
  section_type: 'banner' | 'products' | 'featured' | 'custom';
  section_config?: any;
}
