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
          button_link: string
          button_text: string
          created_at: string
          display_order: number | null
          gradient: string
          id: string
          image_url: string | null
          is_active: boolean
          position: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_type?: string | null
          button_image_url?: string | null
          button_link: string
          button_text: string
          created_at?: string
          display_order?: number | null
          gradient?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          position?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_type?: string | null
          button_image_url?: string | null
          button_link?: string
          button_text?: string
          created_at?: string
          display_order?: number | null
          gradient?: string
          id?: string
          image_url?: string | null
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
          updated_at: string | null
          view_all_link: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          view_all_link?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
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
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          price: number
          sizes: string[] | null
          stock: number | null
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price: number
          sizes?: string[] | null
          stock?: number | null
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          sizes?: string[] | null
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
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
          product_description: string | null
          product_id: string | null
          product_image: string | null
          product_name: string | null
          product_price: number | null
          product_stock: number | null
          tag_id: string | null
          tag_name: string | null
        }
        Relationships: []
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
      has_active_subscription: {
        Args: { user_id: string }
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
      redeem_pro_code: {
        Args: { p_code_id: string; p_user_id: string; p_end_date: string }
        Returns: Json
      }
      remover_meses_assinatura: {
        Args: { user_id: string; meses: number }
        Returns: boolean
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
