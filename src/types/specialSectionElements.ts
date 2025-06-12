
export type ElementType = 
  | 'banner_full'
  | 'banner_medium' 
  | 'banner_small'
  | 'banner_product_highlight'
  | 'product_carousel'
  | 'text_block';

export type BackgroundType = 'color' | 'image' | 'gradient' | 'transparent';

export interface ElementFormData {
  title: string;
  subtitle: string;
  element_type: ElementType;
  image_url: string;
  link_url: string;
  link_text: string;
  display_order: number;
  is_active: boolean;
  background_type: BackgroundType;
  background_value: string;
  text_color: string;
  font_size: number;
  font_weight: number;
  text_align: string;
  padding_top: number;
  padding_bottom: number;
  padding_left: number;
  padding_right: number;
  margin_top: number;
  margin_bottom: number;
  border_width: number;
  border_color: string;
  border_radius: number;
  shadow_type: string;
  animation_type: string;
  custom_css: string;
}
