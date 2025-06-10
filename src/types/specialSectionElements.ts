
export interface SpecialSectionElement {
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
}
