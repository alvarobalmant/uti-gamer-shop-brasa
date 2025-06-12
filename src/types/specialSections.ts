
export interface SpecialSectionElement {
  id?: string;
  special_section_id?: string;
  element_type: 'banner_full' | 'banner_medium' | 'banner_small' | 'banner_product_highlight' | 'product_carousel' | 'text_block';
  title?: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  background_type?: 'color' | 'image' | 'gradient' | 'transparent';
  background_color?: string;
  background_image_url?: string;
  background_gradient?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  content_type?: string;
  content_ids?: string[];
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
  display_order?: number;
  is_active?: boolean;
  mobile_settings?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialSection {
  id: string;
  title: string;
  description?: string;
  background_type: 'color' | 'image' | 'gradient';
  background_value?: string;
  background_image_url?: string;
  background_gradient?: string;
  background_image_position?: string;
  background_image_crop_data?: any;
  padding_top?: number;
  padding_bottom?: number;
  padding_left?: number;
  padding_right?: number;
  margin_top?: number;
  margin_bottom?: number;
  border_radius?: number;
  display_order?: number;
  is_active?: boolean;
  mobile_settings?: any;
  content_config?: any;
  created_at?: string;
  updated_at?: string;
}
