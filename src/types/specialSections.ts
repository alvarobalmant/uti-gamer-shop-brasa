
import { Database } from "../integrations/supabase/types";

// Base type for Special Section from the database
export type SpecialSection = Database["public"]["Tables"]["special_sections"]["Row"] & {
  background_type?: 'color' | 'image';
  background_value?: string;
  background_image_position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  title_part1?: string;
  title_part2?: string;
  title_color1?: string;
  title_color2?: string;
};

// Base type for Special Section Element from the database
export type SpecialSectionElement = Database["public"]["Tables"]["special_section_elements"]["Row"] & {
  content_ids?: string[];
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

// NOVO: Tipo para as linhas de carrossel no estilo GameStop
export interface CarouselRowConfig {
  row_id: string;
  title: string;
  showTitle: boolean;
  titleAlignment: 'left' | 'center' | 'right';
  selection_mode: 'tags' | 'products' | 'combined';
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
  carousel_rows?: CarouselRowConfig[]; // NOVO: Array de carrosseis estilo GameStop
}
