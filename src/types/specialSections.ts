
import { Database } from "../integrations/supabase/types";

// Base type for Special Section from the database
export type SpecialSection = Database["public"]["Tables"]["special_sections"]["Row"] & {
  background_type?: 'color' | 'image';
  background_value?: string;
  background_image_position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
};

// Base type for Special Section Element from the database with proper typing
export type SpecialSectionElement = {
  id: string;
  special_section_id?: string;
  element_type: string;
  title?: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  background_type?: 'transparent' | 'color' | 'gradient' | 'image';
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  content_type?: 'products' | 'tags' | 'manual';
  content_ids?: string[];
  grid_position?: string;
  grid_size?: string;
  width_percentage?: number;
  height_desktop?: number;
  height_mobile?: number;
  visible_items_desktop?: number;
  visible_items_tablet?: number;
  visible_items_mobile?: number;
  padding?: number;
  margin_bottom?: number;
  border_radius?: number;
  display_order?: number;
  is_active?: boolean;
  mobile_settings?: any;
  created_at?: string;
  updated_at?: string;
};

// Base type for Special Section Grid Layout from the database
export type SpecialSectionGridLayout = Database["public"]["Tables"]["special_section_grid_layouts"]["Row"];

// Input type for creating a new Special Section (excluding auto-generated fields)
export type SpecialSectionCreateInput = Omit<
  SpecialSection,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section (all fields optional)
export type SpecialSectionUpdateInput = Partial<SpecialSectionCreateInput>;

// Input type for creating a new Special Section Element
export type SpecialSectionElementCreateInput = Omit<
  SpecialSectionElement,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section Element
export type SpecialSectionElementUpdateInput = Partial<SpecialSectionElementCreateInput>;

// Input type for creating a new Special Section Grid Layout
export type SpecialSectionGridLayoutCreateInput = Omit<
  SpecialSectionGridLayout,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section Grid Layout
export type SpecialSectionGridLayoutUpdateInput = Partial<SpecialSectionGridLayoutCreateInput>;

// Add the missing CarouselConfig type
export interface CarouselConfig {
  title?: string;
  selection_mode?: 'tags' | 'products' | 'combined';
  tag_ids?: string[];
  product_ids?: string[];
}

// Add the missing FixedContentFormData type
export interface FixedContentFormData {
  banner_principal?: { image_url?: string; link_url?: string; };
  banner_medio_1?: { image_url?: string; title?: string; subtitle?: string; link_url?: string; };
  banner_medio_2?: { image_url?: string; title?: string; subtitle?: string; link_url?: string; };
  banner_pequeno?: { image_url?: string; link_url?: string; };
  banner_destaque?: { title?: string; subtitle?: string; link_url?: string; button_text?: string; };
  carrossel_1?: CarouselConfig;
  carrossel_2?: CarouselConfig;
}
