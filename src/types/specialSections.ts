
export interface SpecialSection {
  id: string;
  title: string;
  description?: string;
  background_type: 'color' | 'image' | 'gradient';
  background_color?: string;
  background_image_url?: string;
  background_gradient?: string;
  padding_top?: number;
  padding_bottom?: number;
  padding_left?: number;
  padding_right?: number;
  margin_top?: number;
  margin_bottom?: number;
  border_radius?: number;
  is_active: boolean;
  display_order: number;
  mobile_settings?: any;
  created_at: string;
  updated_at: string;
  elements?: SpecialSectionElement[];
}

export interface SpecialSectionElement {
  id: string;
  special_section_id: string;
  element_type: 'banner' | 'product_grid' | 'text_block' | 'image_grid' | 'cta_button';
  title?: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  background_type?: 'color' | 'image' | 'gradient';
  background_color?: string;
  background_image_url?: string;
  background_gradient?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  content_type?: 'products' | 'tags' | 'custom';
  content_ids?: any;
  grid_position?: string;
  grid_size?: string;
  width_percentage?: number;
  height_desktop?: number;
  height_mobile?: number;
  padding?: number;
  margin_bottom?: number;
  border_radius?: number;
  visible_items_desktop?: number;
  visible_items_tablet?: number;
  visible_items_mobile?: number;
  is_active: boolean;
  display_order: number;
  mobile_settings?: any;
  created_at: string;
  updated_at: string;
}

export interface SpecialSectionGridLayout {
  id: string;
  name: string;
  description?: string;
  layout_structure: any;
  preview_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateSpecialSectionInput = Omit<SpecialSection, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSpecialSectionInput = Partial<CreateSpecialSectionInput> & { id: string };

export type CreateSpecialSectionElementInput = Omit<SpecialSectionElement, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSpecialSectionElementInput = Partial<CreateSpecialSectionElementInput> & { id: string };
