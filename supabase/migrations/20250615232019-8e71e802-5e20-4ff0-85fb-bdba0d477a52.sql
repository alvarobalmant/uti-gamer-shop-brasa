
-- Security Fixes Implementation - Phase 1 (Revised)
-- Handle existing policies by dropping them first

-- 1. Enable RLS on tables that don't have it but should (these are safe to run multiple times)
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_layout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_section_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies first, then recreate them

-- Banners policies
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;
DROP POLICY IF EXISTS "Only admins can manage banners" ON public.banners;

CREATE POLICY "Anyone can view active banners"
  ON public.banners
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage banners"
  ON public.banners
  FOR ALL
  USING (public.is_admin());

-- Pages policies
DROP POLICY IF EXISTS "Anyone can view active pages" ON public.pages;
DROP POLICY IF EXISTS "Only admins can manage pages" ON public.pages;

CREATE POLICY "Anyone can view active pages"
  ON public.pages
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage pages"
  ON public.pages
  FOR ALL
  USING (public.is_admin());

-- Page layout items policies
DROP POLICY IF EXISTS "Anyone can view page layout items for active pages" ON public.page_layout_items;
DROP POLICY IF EXISTS "Only admins can manage page layout items" ON public.page_layout_items;

CREATE POLICY "Anyone can view page layout items for active pages"
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

CREATE POLICY "Only admins can manage page layout items"
  ON public.page_layout_items
  FOR ALL
  USING (public.is_admin());

-- Tags policies
DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can manage tags" ON public.tags;

CREATE POLICY "Anyone can view tags"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage tags"
  ON public.tags
  FOR ALL
  USING (public.is_admin());

-- Cart items policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;

CREATE POLICY "Users can view their own cart items"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart items"
  ON public.cart_items
  FOR ALL
  USING (auth.uid() = user_id);

-- Pro codes policies
DROP POLICY IF EXISTS "Only admins can view all pro codes" ON public.pro_codes;
DROP POLICY IF EXISTS "Only admins can create pro codes" ON public.pro_codes;
DROP POLICY IF EXISTS "Only admins can update pro codes" ON public.pro_codes;

CREATE POLICY "Only admins can view all pro codes"
  ON public.pro_codes
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Only admins can create pro codes"
  ON public.pro_codes
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update pro codes"
  ON public.pro_codes
  FOR UPDATE
  USING (public.is_admin());

-- User subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Only admins can manage user subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only admins can manage user subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (public.is_admin());

-- Subscription plans policies
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Only admins can manage subscription plans" ON public.subscription_plans;

CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage subscription plans"
  ON public.subscription_plans
  FOR ALL
  USING (public.is_admin());

-- Service cards policies
DROP POLICY IF EXISTS "Anyone can view active service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Only admins can manage service cards" ON public.service_cards;

CREATE POLICY "Anyone can view active service cards"
  ON public.service_cards
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage service cards"
  ON public.service_cards
  FOR ALL
  USING (public.is_admin());

-- Quick links policies
DROP POLICY IF EXISTS "Anyone can view active quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Only admins can manage quick links" ON public.quick_links;

CREATE POLICY "Anyone can view active quick links"
  ON public.quick_links
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage quick links"
  ON public.quick_links
  FOR ALL
  USING (public.is_admin());

-- Special sections policies
DROP POLICY IF EXISTS "Anyone can view active special sections" ON public.special_sections;
DROP POLICY IF EXISTS "Only admins can manage special sections" ON public.special_sections;

CREATE POLICY "Anyone can view active special sections"
  ON public.special_sections
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage special sections"
  ON public.special_sections
  FOR ALL
  USING (public.is_admin());

-- Special section elements policies
DROP POLICY IF EXISTS "Anyone can view active special section elements" ON public.special_section_elements;
DROP POLICY IF EXISTS "Only admins can manage special section elements" ON public.special_section_elements;

CREATE POLICY "Anyone can view active special section elements"
  ON public.special_section_elements
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can manage special section elements"
  ON public.special_section_elements
  FOR ALL
  USING (public.is_admin());

-- News articles policies
DROP POLICY IF EXISTS "Anyone can view news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Only admins can manage news articles" ON public.news_articles;

CREATE POLICY "Anyone can view news articles"
  ON public.news_articles
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage news articles"
  ON public.news_articles
  FOR ALL
  USING (public.is_admin());

-- 3. Update the admin user trigger to use a more secure approach
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email,
    'cliente'  -- Default role for all new users
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Create utility functions for admin management
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_users()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE role = 'admin'
  );
$$;
