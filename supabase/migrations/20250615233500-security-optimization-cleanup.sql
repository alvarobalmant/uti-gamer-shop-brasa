
-- Security Optimization - RLS Policy Cleanup and Hardening
-- This migration cleans up duplicate policies and ensures proper security

-- 1. Drop any duplicate or conflicting policies first
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;
DROP POLICY IF EXISTS "Only admins can manage banners" ON public.banners;
DROP POLICY IF EXISTS "Anyone can view active pages" ON public.pages;
DROP POLICY IF EXISTS "Only admins can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Anyone can view page layout items for active pages" ON public.page_layout_items;
DROP POLICY IF EXISTS "Only admins can manage page layout items" ON public.page_layout_items;
DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Only admins can view all pro codes" ON public.pro_codes;
DROP POLICY IF EXISTS "Only admins can create pro codes" ON public.pro_codes;
DROP POLICY IF EXISTS "Only admins can update pro codes" ON public.pro_codes;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Only admins can manage user subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Only admins can manage subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Anyone can view active service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Only admins can manage service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Anyone can view active quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Only admins can manage quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Anyone can view active special sections" ON public.special_sections;
DROP POLICY IF EXISTS "Only admins can manage special sections" ON public.special_sections;
DROP POLICY IF EXISTS "Anyone can view active special section elements" ON public.special_section_elements;
DROP POLICY IF EXISTS "Only admins can manage special section elements" ON public.special_section_elements;
DROP POLICY IF EXISTS "Anyone can view news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Only admins can manage news articles" ON public.news_articles;

-- 2. Recreate optimized policies with consistent naming
-- Banners policies
CREATE POLICY "banners_public_read_policy"
  ON public.banners
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "banners_admin_full_policy"
  ON public.banners
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Pages policies
CREATE POLICY "pages_public_read_policy"
  ON public.pages
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "pages_admin_full_policy"
  ON public.pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Page layout items policies
CREATE POLICY "page_layout_items_public_read_policy"
  ON public.page_layout_items
  FOR SELECT
  USING (
    is_visible = true AND 
    EXISTS (
      SELECT 1 FROM public.pages 
      WHERE pages.id = page_layout_items.page_id 
      AND pages.is_active = true
    ) OR public.is_admin()
  );

CREATE POLICY "page_layout_items_admin_full_policy"
  ON public.page_layout_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tags policies
CREATE POLICY "tags_public_read_policy"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "tags_admin_full_policy"
  ON public.tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Cart items policies - user-specific access
CREATE POLICY "cart_items_user_read_policy"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "cart_items_user_write_policy"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_user_update_policy"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "cart_items_user_delete_policy"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- Pro codes policies - admin only
CREATE POLICY "pro_codes_admin_read_policy"
  ON public.pro_codes
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "pro_codes_admin_write_policy"
  ON public.pro_codes
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "pro_codes_admin_update_policy"
  ON public.pro_codes
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pro_codes_admin_delete_policy"
  ON public.pro_codes
  FOR DELETE
  USING (public.is_admin());

-- User subscriptions policies
CREATE POLICY "user_subscriptions_user_read_policy"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_subscriptions_admin_full_policy"
  ON public.user_subscriptions
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Subscription plans policies
CREATE POLICY "subscription_plans_public_read_policy"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "subscription_plans_admin_full_policy"
  ON public.subscription_plans
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Service cards policies
CREATE POLICY "service_cards_public_read_policy"
  ON public.service_cards
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "service_cards_admin_full_policy"
  ON public.service_cards
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Quick links policies
CREATE POLICY "quick_links_public_read_policy"
  ON public.quick_links
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "quick_links_admin_full_policy"
  ON public.quick_links
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Special sections policies
CREATE POLICY "special_sections_public_read_policy"
  ON public.special_sections
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "special_sections_admin_full_policy"
  ON public.special_sections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Special section elements policies
CREATE POLICY "special_section_elements_public_read_policy"
  ON public.special_section_elements
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "special_section_elements_admin_full_policy"
  ON public.special_section_elements
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- News articles policies
CREATE POLICY "news_articles_public_read_policy"
  ON public.news_articles
  FOR SELECT
  USING (true);

CREATE POLICY "news_articles_admin_full_policy"
  ON public.news_articles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Add missing RLS on tables that need it
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products policies - public read, admin write
CREATE POLICY "products_public_read_policy"
  ON public.products
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "products_admin_full_policy"
  ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Profiles policies - users can read their own, admins can read all
CREATE POLICY "profiles_user_read_own_policy"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_user_update_own_policy"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_admin_full_policy"
  ON public.profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Create security audit function for monitoring
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT auth.uid(),
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log security events for audit trail
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details,
    created_at
  ) VALUES (
    event_type,
    user_id,
    details,
    NOW()
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Silently fail to not interrupt normal operations
    NULL;
END;
$$;

-- Create security audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "security_audit_log_admin_read_policy"
  ON public.security_audit_log
  FOR SELECT
  USING (public.is_admin());

-- System can insert audit logs
CREATE POLICY "security_audit_log_system_insert_policy"
  ON public.security_audit_log
  FOR INSERT
  WITH CHECK (true);
