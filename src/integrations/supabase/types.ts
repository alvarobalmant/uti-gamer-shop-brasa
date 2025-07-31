export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_login_links: {
        Row: {
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          is_active: boolean | null
          token: string
          used_at: string | null
          used_by_ip: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          token: string
          used_at?: string | null
          used_by_ip?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          token?: string
          used_at?: string | null
          used_by_ip?: string | null
        }
        Relationships: []
      }
      admin_security_logs: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
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
      coin_products: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          product_data: Json
          product_type: string
          stock: number | null
          updated_at: string
        }
        Insert: {
          cost: number
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          product_data?: Json
          product_type: string
          stock?: number | null
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          product_data?: Json
          product_type?: string
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      coin_redemptions: {
        Row: {
          cost: number
          id: string
          notes: string | null
          processed_at: string | null
          product_id: string
          redeemed_at: string
          status: string
          user_id: string
        }
        Insert: {
          cost: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          product_id: string
          redeemed_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cost?: number
          id?: string
          notes?: string | null
          processed_at?: string | null
          product_id?: string
          redeemed_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_redemptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "coin_products"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_rules: {
        Row: {
          action: string
          amount: number
          cooldown_minutes: number | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          max_per_day: number | null
          max_per_month: number | null
          updated_at: string
        }
        Insert: {
          action: string
          amount: number
          cooldown_minutes?: number | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          max_per_day?: number | null
          max_per_month?: number | null
          updated_at?: string
        }
        Update: {
          action?: string
          amount?: number
          cooldown_minutes?: number | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          max_per_day?: number | null
          max_per_month?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      coin_system_config: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          metadata: Json | null
          reason: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          reason: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          reason?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_actions: {
        Row: {
          action: string
          action_date: string
          count: number
          id: string
          last_performed_at: string
          user_id: string
        }
        Insert: {
          action: string
          action_date?: string
          count?: number
          id?: string
          last_performed_at?: string
          user_id: string
        }
        Update: {
          action?: string
          action_date?: string
          count?: number
          id?: string
          last_performed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_config: {
        Row: {
          company_address: string | null
          created_at: string
          from_email: string
          from_name: string
          id: string
          logo_url: string | null
          primary_color: string | null
          reply_to: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          reply_to?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          created_at?: string
          from_email?: string
          from_name?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          reply_to?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          text_content: string | null
          type: string
          updated_at: string
          variables: Json | null
          visual_config: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          text_content?: string | null
          type: string
          updated_at?: string
          variables?: Json | null
          visual_config?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          text_content?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
          visual_config?: Json | null
        }
        Relationships: []
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
      invalidated_sessions: {
        Row: {
          created_at: string
          id: string
          invalidated_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invalidated_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invalidated_at?: string
          session_id?: string
          user_id?: string
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
      prime_page_layout: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          is_visible: boolean | null
          page_id: string | null
          section_config: Json | null
          section_key: string
          section_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          page_id?: string | null
          section_config?: Json | null
          section_key: string
          section_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_visible?: boolean | null
          page_id?: string | null
          section_config?: Json | null
          section_key?: string
          section_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prime_page_layout_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "prime_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      prime_pages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
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
      product_faqs: {
        Row: {
          active: boolean | null
          answer: string
          category: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          order_index: number | null
          product_id: string | null
          question: string
          tags: Json | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          answer: string
          category?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          question: string
          tags?: Json | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          answer?: string
          category?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          question?: string
          tags?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
        ]
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
      product_specifications: {
        Row: {
          category: string
          created_at: string | null
          highlight: boolean | null
          icon: string | null
          id: string
          label: string
          order_index: number | null
          product_id: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string | null
          highlight?: boolean | null
          icon?: string | null
          id?: string
          label: string
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string | null
          highlight?: boolean | null
          icon?: string | null
          id?: string
          label?: string
          order_index?: number | null
          product_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
        ]
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
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          available_variants: Json | null
          badge_color: string | null
          badge_text: string | null
          badge_visible: boolean | null
          brand: string | null
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
          brand?: string | null
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
          brand?: string | null
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
      redemption_codes: {
        Row: {
          code: string
          cost: number
          created_at: string
          id: string
          product_id: string
          redeemed_at: string | null
          redeemed_by_admin: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          cost: number
          created_at?: string
          id?: string
          product_id: string
          redeemed_at?: string | null
          redeemed_by_admin?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          cost?: number
          created_at?: string
          id?: string
          product_id?: string
          redeemed_at?: string | null
          redeemed_by_admin?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemption_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "coin_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemption_codes_redeemed_by_admin_fkey"
            columns: ["redeemed_by_admin"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      security_flags: {
        Row: {
          created_at: string
          flag_type: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          flag_type: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          flag_type?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          suspicious: boolean | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          suspicious?: boolean | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          suspicious?: boolean | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
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
      site_settings: {
        Row: {
          created_at: string
          header_image_url: string | null
          header_layout_type: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          header_image_url?: string | null
          header_layout_type?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          header_image_url?: string | null
          header_layout_type?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
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
      specification_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          label: string
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      specification_template_items: {
        Row: {
          category_name: string
          created_at: string | null
          default_value: string | null
          highlight: boolean | null
          id: string
          is_required: boolean | null
          label: string
          order_index: number | null
          template_id: string | null
          validation_rules: Json | null
        }
        Insert: {
          category_name: string
          created_at?: string | null
          default_value?: string | null
          highlight?: boolean | null
          id?: string
          is_required?: boolean | null
          label: string
          order_index?: number | null
          template_id?: string | null
          validation_rules?: Json | null
        }
        Update: {
          category_name?: string
          created_at?: string | null
          default_value?: string | null
          highlight?: boolean | null
          id?: string
          is_required?: boolean | null
          label?: string
          order_index?: number | null
          template_id?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "specification_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "specification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          label: string
          name: string
          product_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          name: string
          product_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          name?: string
          product_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      storage_stats: {
        Row: {
          created_at: string
          id: string
          last_scan: string
          non_webp_images: number
          total_images: number
          total_size_mb: number
          updated_at: string
          webp_images: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_scan?: string
          non_webp_images?: number
          total_images?: number
          total_size_mb?: number
          updated_at?: string
          webp_images?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_scan?: string
          non_webp_images?: number
          total_images?: number
          total_size_mb?: number
          updated_at?: string
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
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_savings: {
        Row: {
          created_at: string | null
          id: string
          original_price: number
          paid_price: number
          product_id: string
          purchase_date: string | null
          savings_amount: number
          savings_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_price: number
          paid_price: number
          product_id: string
          purchase_date?: string | null
          savings_amount: number
          savings_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          original_price?: number
          paid_price?: number
          product_id?: string
          purchase_date?: string | null
          savings_amount?: number
          savings_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_savings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_savings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_product_with_tags"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "user_savings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_login_date: string | null
          longest_streak: number
          streak_multiplier: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          streak_multiplier?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          streak_multiplier?: number
          updated_at?: string
          user_id?: string
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
          nome: string | null
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
          nome?: string | null
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
          nome?: string | null
          papel?: string
          plano?: string | null
          status_assinatura?: string
          updated_at?: string
        }
        Relationships: []
      }
      uti_coins: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_homepage_layout_complete: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: number | null
          is_visible: boolean | null
          product_section_title: string | null
          product_section_title_color1: string | null
          product_section_title_color2: string | null
          product_section_title_part1: string | null
          product_section_title_part2: string | null
          product_section_view_all_link: string | null
          section_key: string | null
          special_section_background_color: string | null
          special_section_content_config: Json | null
          special_section_display_order: number | null
          special_section_is_active: boolean | null
          special_section_title: string | null
          special_section_title_color1: string | null
          special_section_title_color2: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      view_product_with_tags: {
        Row: {
          badge_color: string | null
          badge_text: string | null
          badge_visible: boolean | null
          created_at: string | null
          is_active: boolean | null
          is_featured: boolean | null
          product_description: string | null
          product_id: string | null
          product_image: string | null
          product_images: string[] | null
          product_name: string | null
          product_price: number | null
          product_specifications: Json | null
          product_stock: number | null
          product_type: string | null
          tag_id: string | null
          tag_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adicionar_meses_assinatura: {
        Args: { user_id: string; meses: number }
        Returns: boolean
      }
      analyze_index_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          index_name: string
          index_scans: number
          tuples_read: number
          tuples_fetched: number
        }[]
      }
      cancelar_assinatura: {
        Args: { user_id: string }
        Returns: boolean
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_invalidated_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_security_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_link: {
        Args: { duration_minutes: number }
        Returns: Json
      }
      create_admin_link_secure: {
        Args: { duration_minutes: number }
        Returns: Json
      }
      debug_column_references: {
        Args: Record<PropertyKey, never>
        Returns: {
          source_type: string
          source_name: string
          has_problematic_ref: boolean
        }[]
      }
      delete_master_product_cascade: {
        Args: { p_master_product_id: string }
        Returns: Json
      }
      earn_coins: {
        Args: {
          p_user_id: string
          p_action: string
          p_amount?: number
          p_description?: string
          p_metadata?: Json
        }
        Returns: Json
      }
      generate_admin_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_redemption_code: {
        Args: { p_user_id: string; p_product_id: string; p_cost: number }
        Returns: Json
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
      get_user_total_savings: {
        Args: { p_user_id: string }
        Returns: {
          total_savings: number
          promotion_savings: number
          uti_pro_savings: number
          total_purchases: number
        }[]
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
      is_email_confirmed: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_flagged: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action_type: string
          p_resource_type?: string
          p_resource_id?: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      log_security_event: {
        Args: { event_type: string; user_id?: string; details?: Json }
        Returns: undefined
      }
      monitor_query_performance: {
        Args: Record<PropertyKey, never>
        Returns: {
          query_type: string
          avg_duration_ms: number
          total_calls: number
          table_name: string
        }[]
      }
      process_daily_login: {
        Args: { p_user_id: string }
        Returns: Json
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      redeem_code_admin: {
        Args: { p_code: string; p_admin_id: string }
        Returns: Json
      }
      redeem_coin_product: {
        Args: { p_user_id: string; p_product_id: string }
        Returns: Json
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
      validate_admin_token: {
        Args: { p_token: string; p_ip?: string }
        Returns: Json
      }
      verify_redemption_code: {
        Args: { p_code: string }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
