export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          background_type: string | null
          button_image_url: string | null
          button_link: string | null
          button_link_desktop: string | null
          button_link_mobile: string | null
          button_text: string | null
          created_at: string
          device_type: string
          display_order: number | null
          gradient: string
          id: string
          image_url: string | null
          image_url_desktop: string | null
          image_url_mobile: string | null
          is_active: boolean
          position: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_type?: string | null
          button_image_url?: string | null
          button_link?: string | null
          button_link_desktop?: string | null
          button_link_mobile?: string | null
          button_text?: string | null
          created_at?: string
          device_type?: string
          display_order?: number | null
          gradient?: string
          id?: string
          image_url?: string | null
          image_url_desktop?: string | null
          image_url_mobile?: string | null
          is_active?: boolean
          position?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_type?: string | null
          button_image_url?: string | null
          button_link?: string | null
          button_link_desktop?: string | null
          button_link_mobile?: string | null
          button_text?: string | null
          created_at?: string
          device_type?: string
          display_order?: number | null
          gradient?: string
          id?: string
          image_url?: string | null
          image_url_desktop?: string | null
          image_url_mobile?: string | null
          is_active?: boolean
          position?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          product_id: string
          quantity: number
          size: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          size?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
        ]
      }
      homepage_layout: {
        Row: {
          created_at: string | null
          display_order: number
          id: number
          is_visible: boolean
          section_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: number
          is_visible?: boolean
          section_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: number
          is_visible?: boolean
          section_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          background_color: string | null
          created_at: string | null
          display_order: number
          hover_background_color: string | null
          hover_text_color: string | null
          icon_type: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          is_visible: boolean | null
          line_animation_duration: number | null
          line_color: string | null
          line_height: number | null
          link_type: string | null
          link_url: string
          show_line: boolean | null
          slug: string
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string | null
          display_order?: number
          hover_background_color?: string | null
          hover_text_color?: string | null
          icon_type?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_visible?: boolean | null
          line_animation_duration?: number | null
          line_color?: string | null
          line_height?: number | null
          link_type?: string | null
          link_url: string
          show_line?: boolean | null
          slug: string
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string | null
          display_order?: number
          hover_background_color?: string | null
          hover_text_color?: string | null
          icon_type?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          is_visible?: boolean | null
          line_animation_duration?: number | null
          line_color?: string | null
          line_height?: number | null
          link_type?: string | null
          link_url?: string
          show_line?: boolean | null
          slug?: string
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          category: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          link: string
          publish_date: string
          read_time: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          link: string
          publish_date?: string
          read_time?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          link?: string
          publish_date?: string
          read_time?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_layout_items: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          page_id: string
          section_config: Json | null
          section_key: string
          section_type: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          page_id: string
          section_config?: Json | null
          section_key: string
          section_type: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          page_id?: string
          section_config?: Json | null
          section_key?: string
          section_type?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_layout_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          background_color: string | null
          config: Json | null
          created_at: string
          display_order: number
          full_width: boolean | null
          id: string
          is_visible: boolean
          margin: string | null
          padding: string | null
          page_id: string
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          config?: Json | null
          created_at?: string
          display_order?: number
          full_width?: boolean | null
          id?: string
          is_visible?: boolean
          margin?: string | null
          padding?: string | null
          page_id: string
          title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          config?: Json | null
          created_at?: string
          display_order?: number
          full_width?: boolean | null
          id?: string
          is_visible?: boolean
          margin?: string | null
          padding?: string | null
          page_id?: string
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          description: string | null
          footer_style: string | null
          header_style: string | null
          id: string
          is_active: boolean
          keywords: string[] | null
          layout: string | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          theme: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          footer_style?: string | null
          header_style?: string | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          layout?: string | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          theme?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          footer_style?: string | null
          header_style?: string | null
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          layout?: string | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          theme?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      platforms: {
        Row: {
          color: string | null
          created_at: string
          display_order: number | null
          icon_emoji: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon_emoji?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon_emoji?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pro_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          duration_months: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          duration_months: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          duration_months?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      product_section_items: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: number
          item_id: string
          item_type: Database["public"]["Enums"]["section_item_type"]
          section_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          item_id: string
          item_type: Database["public"]["Enums"]["section_item_type"]
          section_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          item_id?: string
          item_type?: Database["public"]["Enums"]["section_item_type"]
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_section_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "product_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sections: {
        Row: {
          created_at: string | null
          id: string
          title: string
          title_color1: string | null
          title_color2: string | null
          title_part1: string | null
          title_part2: string | null
          updated_at: string | null
          view_all_link: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          title_color1?: string | null
          title_color2?: string | null
          title_part1?: string | null
          title_part2?: string | null
          updated_at?: string | null
          view_all_link?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          title_color1?: string | null
          title_color2?: string | null
          title_part1?: string | null
          title_part2?: string | null
          updated_at?: string | null
          view_all_link?: string | null
        }
        Relationships: []
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          product_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_tags_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product_tags_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "fk_product_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          available_variants: Json | null
          badge_color: string | null
          badge_text: string | null
          badge_visible: boolean | null
          breadcrumb_config: Json | null
          category: string | null
          colors: string[] | null
          condition: string | null
          created_at: string
          delivery_config: Json | null
          description: string | null
          digital_price: number | null
          discount_percentage: number | null
          discount_price: number | null
          display_config: Json | null
          free_shipping: boolean | null
          id: string
          image: string | null
          images: string[] | null
          inherit_from_master: Json | null
          installment_options: number | null
          is_active: boolean | null
          is_featured: boolean | null
          is_master_product: boolean | null
          list_price: number | null
          manual_related_products: Json | null
          master_slug: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          new_price: number | null
          parent_product_id: string | null
          pix_discount_percentage: number | null
          platform: string | null
          price: number
          pro_discount_percent: number | null
          pro_price: number | null
          product_descriptions: Json | null
          product_faqs: Json | null
          product_features: Json | null
          product_highlights: Json | null
          product_type: string | null
          product_videos: Json | null
          promotional_price: number | null
          rating: number | null
          rating_average: number | null
          rating_count: number | null
          related_products: Json | null
          related_products_auto: boolean | null
          reviews_config: Json | null
          reviews_enabled: boolean | null
          shipping_dimensions: Json | null
          shipping_time_max: number | null
          shipping_time_min: number | null
          shipping_weight: number | null
          show_rating: boolean | null
          show_stock: boolean | null
          sizes: string[] | null
          sku_code: string | null
          slug: string | null
          sort_order: number | null
          specifications: Json | null
          stock: number | null
          store_pickup_available: boolean | null
          technical_specs: Json | null
          title: string | null
          trust_indicators: Json | null
          updated_at: string
          uti_pro_custom_price: number | null
          uti_pro_enabled: boolean | null
          uti_pro_price: number | null
          uti_pro_type: string | null
          uti_pro_value: number | null
          variant_attributes: Json | null
        }
        Insert: {
          additional_images?: string[] | null
          available_variants?: Json | null
          badge_color?: string | null
          badge_text?: string | null
          badge_visible?: boolean | null
          breadcrumb_config?: Json | null
          category?: string | null
          colors?: string[] | null
          condition?: string | null
          created_at?: string
          delivery_config?: Json | null
          description?: string | null
          digital_price?: number | null
          discount_percentage?: number | null
          discount_price?: number | null
          display_config?: Json | null
          free_shipping?: boolean | null
          id?: string
          image?: string | null
          images?: string[] | null
          inherit_from_master?: Json | null
          installment_options?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_master_product?: boolean | null
          list_price?: number | null
          manual_related_products?: Json | null
          master_slug?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          new_price?: number | null
          parent_product_id?: string | null
          pix_discount_percentage?: number | null
          platform?: string | null
          price: number
          pro_discount_percent?: number | null
          pro_price?: number | null
          product_descriptions?: Json | null
          product_faqs?: Json | null
          product_features?: Json | null
          product_highlights?: Json | null
          product_type?: string | null
          product_videos?: Json | null
          promotional_price?: number | null
          rating?: number | null
          rating_average?: number | null
          rating_count?: number | null
          related_products?: Json | null
          related_products_auto?: boolean | null
          reviews_config?: Json | null
          reviews_enabled?: boolean | null
          shipping_dimensions?: Json | null
          shipping_time_max?: number | null
          shipping_time_min?: number | null
          shipping_weight?: number | null
          show_rating?: boolean | null
          show_stock?: boolean | null
          sizes?: string[] | null
          sku_code?: string | null
          slug?: string | null
          sort_order?: number | null
          specifications?: Json | null
          stock?: number | null
          store_pickup_available?: boolean | null
          technical_specs?: Json | null
          title?: string | null
          trust_indicators?: Json | null
          updated_at?: string
          uti_pro_custom_price?: number | null
          uti_pro_enabled?: boolean | null
          uti_pro_price?: number | null
          uti_pro_type?: string | null
          uti_pro_value?: number | null
          variant_attributes?: Json | null
        }
        Update: {
          additional_images?: string[] | null
          available_variants?: Json | null
          badge_color?: string | null
          badge_text?: string | null
          badge_visible?: boolean | null
          breadcrumb_config?: Json | null
          category?: string | null
          colors?: string[] | null
          condition?: string | null
          created_at?: string
          delivery_config?: Json | null
          description?: string | null
          digital_price?: number | null
          discount_percentage?: number | null
          discount_price?: number | null
          display_config?: Json | null
          free_shipping?: boolean | null
          id?: string
          image?: string | null
          images?: string[] | null
          inherit_from_master?: Json | null
          installment_options?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_master_product?: boolean | null
          list_price?: number | null
          manual_related_products?: Json | null
          master_slug?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          new_price?: number | null
          parent_product_id?: string | null
          pix_discount_percentage?: number | null
          platform?: string | null
          price?: number
          pro_discount_percent?: number | null
          pro_price?: number | null
          product_descriptions?: Json | null
          product_faqs?: Json | null
          product_features?: Json | null
          product_highlights?: Json | null
          product_type?: string | null
          product_videos?: Json | null
          promotional_price?: number | null
          rating?: number | null
          rating_average?: number | null
          rating_count?: number | null
          related_products?: Json | null
          related_products_auto?: boolean | null
          reviews_config?: Json | null
          reviews_enabled?: boolean | null
          shipping_dimensions?: Json | null
          shipping_time_max?: number | null
          shipping_time_min?: number | null
          shipping_weight?: number | null
          show_rating?: boolean | null
          show_stock?: boolean | null
          sizes?: string[] | null
          sku_code?: string | null
          slug?: string | null
          sort_order?: number | null
          specifications?: Json | null
          stock?: number | null
          store_pickup_available?: boolean | null
          technical_specs?: Json | null
          title?: string | null
          trust_indicators?: Json | null
          updated_at?: string
          uti_pro_custom_price?: number | null
          uti_pro_enabled?: boolean | null
          uti_pro_price?: number | null
          uti_pro_type?: string | null
          uti_pro_value?: number | null
          variant_attributes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_pro_member: boolean | null
          name: string | null
          pro_expires_at: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_pro_member?: boolean | null
          name?: string | null
          pro_expires_at?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_pro_member?: boolean | null
          name?: string | null
          pro_expires_at?: string | null
          role?: string
        }
        Relationships: []
      }
      promotional_ribbon_config: {
        Row: {
          background_color: string | null
          background_type: string | null
          created_at: string | null
          device_type: string
          gradient_colors: string | null
          id: string
          is_active: boolean | null
          link_url: string | null
          text: string
          text_color: string | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          background_type?: string | null
          created_at?: string | null
          device_type: string
          gradient_colors?: string | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          text?: string
          text_color?: string | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          background_type?: string | null
          created_at?: string | null
          device_type?: string
          gradient_colors?: string | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          text?: string
          text_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quick_links: {
        Row: {
          created_at: string
          icon_url: string
          id: string
          is_active: boolean
          label: string
          path: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon_url: string
          id?: string
          is_active?: boolean
          label: string
          path: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon_url?: string
          id?: string
          is_active?: boolean
          label?: string
          path?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_cards: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          link_url: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url: string
          is_active?: boolean
          link_url: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      special_section_elements: {
        Row: {
          background_color: string | null
          background_gradient: string | null
          background_image_url: string | null
          background_type: string | null
          border_radius: number | null
          button_color: string | null
          button_text_color: string | null
          content_ids: Json | null
          content_type: string | null
          created_at: string | null
          display_order: number | null
          element_type: string
          grid_position: string | null
          grid_size: string | null
          height_desktop: number | null
          height_mobile: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_text: string | null
          link_url: string | null
          margin_bottom: number | null
          mobile_settings: Json | null
          padding: number | null
          special_section_id: string | null
          subtitle: string | null
          text_color: string | null
          title: string | null
          updated_at: string | null
          visible_items_desktop: number | null
          visible_items_mobile: number | null
          visible_items_tablet: number | null
          width_percentage: number | null
        }
        Insert: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_url?: string | null
          background_type?: string | null
          border_radius?: number | null
          button_color?: string | null
          button_text_color?: string | null
          content_ids?: Json | null
          content_type?: string | null
          created_at?: string | null
          display_order?: number | null
          element_type: string
          grid_position?: string | null
          grid_size?: string | null
          height_desktop?: number | null
          height_mobile?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          margin_bottom?: number | null
          mobile_settings?: Json | null
          padding?: number | null
          special_section_id?: string | null
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string | null
          visible_items_desktop?: number | null
          visible_items_mobile?: number | null
          visible_items_tablet?: number | null
          width_percentage?: number | null
        }
        Update: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_url?: string | null
          background_type?: string | null
          border_radius?: number | null
          button_color?: string | null
          button_text_color?: string | null
          content_ids?: Json | null
          content_type?: string | null
          created_at?: string | null
          display_order?: number | null
          element_type?: string
          grid_position?: string | null
          grid_size?: string | null
          height_desktop?: number | null
          height_mobile?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          margin_bottom?: number | null
          mobile_settings?: Json | null
          padding?: number | null
          special_section_id?: string | null
          subtitle?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string | null
          visible_items_desktop?: number | null
          visible_items_mobile?: number | null
          visible_items_tablet?: number | null
          width_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "special_section_elements_special_section_id_fkey"
            columns: ["special_section_id"]
            isOneToOne: false
            referencedRelation: "special_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      special_section_grid_layouts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          layout_structure: Json
          name: string
          preview_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          layout_structure: Json
          name: string
          preview_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          layout_structure?: Json
          name?: string
          preview_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      special_sections: {
        Row: {
          background_color: string | null
          background_gradient: string | null
          background_image_crop_data: Json | null
          background_image_position: string | null
          background_image_url: string | null
          background_type: string
          background_value: string | null
          border_radius: number | null
          content_config: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          margin_bottom: number | null
          margin_top: number | null
          mobile_settings: Json | null
          padding_bottom: number | null
          padding_left: number | null
          padding_right: number | null
          padding_top: number | null
          title: string
          title_color1: string | null
          title_color2: string | null
          title_part1: string | null
          title_part2: string | null
          updated_at: string | null
        }
        Insert: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_crop_data?: Json | null
          background_image_position?: string | null
          background_image_url?: string | null
          background_type?: string
          background_value?: string | null
          border_radius?: number | null
          content_config?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          margin_bottom?: number | null
          margin_top?: number | null
          mobile_settings?: Json | null
          padding_bottom?: number | null
          padding_left?: number | null
          padding_right?: number | null
          padding_top?: number | null
          title: string
          title_color1?: string | null
          title_color2?: string | null
          title_part1?: string | null
          title_part2?: string | null
          updated_at?: string | null
        }
        Update: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_crop_data?: Json | null
          background_image_position?: string | null
          background_image_url?: string | null
          background_type?: string
          background_value?: string | null
          border_radius?: number | null
          content_config?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          margin_bottom?: number | null
          margin_top?: number | null
          mobile_settings?: Json | null
          padding_bottom?: number | null
          padding_left?: number | null
          padding_right?: number | null
          padding_top?: number | null
          title?: string
          title_color1?: string | null
          title_color2?: string | null
          title_part1?: string | null
          title_part2?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      storage_stats: {
        Row: {
          created_at: string
          id: string
          last_updated: string
          non_webp_images: number
          total_images: number
          total_size_bytes: number
          webp_images: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string
          non_webp_images?: number
          total_images?: number
          total_size_bytes?: number
          webp_images?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string
          non_webp_images?: number
          total_images?: number
          total_size_bytes?: number
          webp_images?: number
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number
          duration_months: number
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          duration_months: number
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          duration_months?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      top_deal_items: {
        Row: {
          created_at: string | null
          deal_label: string
          display_order: number | null
          id: number
          product_id: string
          section_id: string | null
        }
        Insert: {
          created_at?: string | null
          deal_label: string
          display_order?: number | null
          id?: number
          product_id: string
          section_id?: string | null
        }
        Update: {
          created_at?: string | null
          deal_label?: string
          display_order?: number | null
          id?: number
          product_id?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top_deal_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "top_deal_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      top_deal_sections: {
        Row: {
          banner_button_link: string | null
          banner_button_text: string | null
          banner_image_url: string | null
          banner_subtitle: string | null
          banner_title: string | null
          created_at: string | null
          id: string
          is_pro_exclusive: boolean | null
          subtitle: string | null
          title: string
          updated_at: string | null
          view_all_link: string | null
        }
        Insert: {
          banner_button_link?: string | null
          banner_button_text?: string | null
          banner_image_url?: string | null
          banner_subtitle?: string | null
          banner_title?: string | null
          created_at?: string | null
          id?: string
          is_pro_exclusive?: boolean | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          view_all_link?: string | null
        }
        Update: {
          banner_button_link?: string | null
          banner_button_text?: string | null
          banner_image_url?: string | null
          banner_subtitle?: string | null
          banner_title?: string | null
          created_at?: string | null
          id?: string
          is_pro_exclusive?: boolean | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          view_all_link?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_subscriptions_plan_id"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_subscriptions_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          data_cadastro: string
          data_expiracao: string | null
          desconto: number | null
          email: string
          id: string
          nome: string
          papel: string
          plano: string | null
          status_assinatura: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_cadastro?: string
          data_expiracao?: string | null
          desconto?: number | null
          email: string
          id?: string
          nome: string
          papel?: string
          plano?: string | null
          status_assinatura?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_cadastro?: string
          data_expiracao?: string | null
          desconto?: number | null
          email?: string
          id?: string
          nome?: string
          papel?: string
          plano?: string | null
          status_assinatura?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_product_with_tags: {
        Row: {
          additional_images: string[] | null
          available_variants: Json | null
          badge_color: string | null
          badge_text: string | null
          badge_visible: boolean | null
          breadcrumb_config: Json | null
          colors: string[] | null
          created_at: string | null
          delivery_config: Json | null
          display_config: Json | null
          free_shipping: boolean | null
          inherit_from_master: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          is_master_product: boolean | null
          list_price: number | null
          manual_related_products: Json | null
          master_slug: string | null
          meta_description: string | null
          meta_title: string | null
          parent_product_id: string | null
          pro_price: number | null
          product_description: string | null
          product_descriptions: Json | null
          product_faqs: Json | null
          product_features: Json | null
          product_highlights: Json | null
          product_id: string | null
          product_image: string | null
          product_name: string | null
          product_price: number | null
          product_stock: number | null
          product_type: string | null
          product_videos: Json | null
          reviews_config: Json | null
          shipping_weight: number | null
          sizes: string[] | null
          sku_code: string | null
          slug: string | null
          sort_order: number | null
          specifications: Json | null
          tag_id: string | null
          tag_name: string | null
          technical_specs: Json | null
          trust_indicators: Json | null
          updated_at: string | null
          uti_pro_custom_price: number | null
          uti_pro_enabled: boolean | null
          uti_pro_type: string | null
          uti_pro_value: number | null
          variant_attributes: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
        ]
      }
    }
    Functions: {
      adicionar_meses_assinatura: {
        Args: { user_id: string; meses: number }
        Returns: boolean
      }
      cancelar_assinatura: {
        Args: { user_id: string }
        Returns: boolean
      }
      get_active_subscription: {
        Args: { user_id: string }
        Returns: {
          subscription_id: string
          plan_name: string
          discount_percentage: number
          end_date: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_active_subscription: {
        Args: { user_id: string }
        Returns: boolean
      }
      has_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: { event_type: string; user_id?: string; details?: Json }
        Returns: undefined
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      redeem_pro_code: {
        Args: { p_code_id: string; p_user_id: string; p_end_date: string }
        Returns: Json
      }
      remover_meses_assinatura: {
        Args: { user_id: string; meses: number }
        Returns: boolean
      }
      test_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_user_id: string
          user_exists: boolean
          user_role: string
          is_admin_result: boolean
          can_read_profiles: boolean
        }[]
      }
    }
    Enums: {
      section_item_type: "product" | "tag"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      section_item_type: ["product", "tag"],
    },
  },
} as const
