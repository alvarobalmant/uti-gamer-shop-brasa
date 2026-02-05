// Stub: product_section_items table removed
import { useState } from 'react';

export type SectionItemType = 'product' | 'tag';
export interface ProductSectionItem { id?: number; section_id: string; item_type: SectionItemType; item_id: string; display_order?: number; }
export interface ProductSection { id: string; title: string; items?: ProductSectionItem[]; }
export interface ProductSectionInput { id?: string; title: string; items: { type: SectionItemType; id: string }[]; }
export interface HomepageLayoutItem { id: number; section_key: string; display_order: number; is_visible: boolean; }

export const useProductSections = () => {
  const [sections] = useState<ProductSection[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  
  return {
    sections,
    loading,
    error,
    fetchSections: async () => {},
    addSection: async () => ({ success: false }),
    updateSection: async () => ({ success: false }),
    deleteSection: async () => ({ success: false }),
    refreshSections: async () => {},
  };
};