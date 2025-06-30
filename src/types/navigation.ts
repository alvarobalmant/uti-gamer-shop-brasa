
export interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  icon_url?: string;
  icon_type: 'image' | 'emoji' | 'icon';
  background_color: string;
  text_color: string;
  hover_background_color?: string;
  hover_text_color?: string;
  link_url: string;
  link_type: 'internal' | 'external';
  display_order: number;
  line_color: string;
  line_height: number;
  line_animation_duration: number;
  show_line: boolean;
  is_visible: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNavigationItemData {
  title: string;
  slug: string;
  icon_url?: string;
  icon_type: 'image' | 'emoji' | 'icon';
  background_color: string;
  text_color: string;
  hover_background_color?: string;
  hover_text_color?: string;
  link_url: string;
  link_type: 'internal' | 'external';
  display_order: number;
  line_color: string;
  line_height: number;
  line_animation_duration: number;
  show_line: boolean;
  is_visible: boolean;
  is_active: boolean;
}

export interface UpdateNavigationItemData extends CreateNavigationItemData {
  id: string;
}
