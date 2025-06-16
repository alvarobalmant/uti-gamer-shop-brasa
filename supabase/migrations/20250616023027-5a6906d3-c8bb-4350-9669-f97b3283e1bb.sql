
-- Verificar e corrigir políticas RLS para garantir funcionamento correto do admin

-- 1. Verificar se a função is_admin está funcionando e adicionar logs
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result BOOLEAN;
  current_user_id UUID;
  user_role TEXT;
BEGIN
  current_user_id := auth.uid();
  
  -- Log para debug
  RAISE LOG 'is_admin() called for user: %', current_user_id;
  
  IF current_user_id IS NULL THEN
    RAISE LOG 'is_admin(): No authenticated user found';
    RETURN FALSE;
  END IF;
  
  -- Buscar role do usuário
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = current_user_id;
  
  -- Log do resultado
  RAISE LOG 'is_admin(): User % has role: %', current_user_id, user_role;
  
  result := (user_role = 'admin');
  
  RAISE LOG 'is_admin(): Returning %', result;
  
  RETURN result;
END;
$$;

-- 2. Adicionar políticas mais permissivas para tabelas que não têm RLS ativo
-- Verificar se RLS está ativo em todas as tabelas necessárias

-- Homepage Layout - permitir leitura pública
ALTER TABLE public.homepage_layout ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "homepage_layout_public_read" ON public.homepage_layout;
CREATE POLICY "homepage_layout_public_read"
  ON public.homepage_layout
  FOR SELECT
  USING (true); -- Permitir leitura pública

DROP POLICY IF EXISTS "homepage_layout_admin_full" ON public.homepage_layout;
CREATE POLICY "homepage_layout_admin_full"
  ON public.homepage_layout
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Sections - permitir leitura pública
ALTER TABLE public.product_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_sections_public_read" ON public.product_sections;
CREATE POLICY "product_sections_public_read"
  ON public.product_sections
  FOR SELECT
  USING (true); -- Permitir leitura pública

DROP POLICY IF EXISTS "product_sections_admin_full" ON public.product_sections;
CREATE POLICY "product_sections_admin_full"
  ON public.product_sections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Section Items - permitir leitura pública
ALTER TABLE public.product_section_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_section_items_public_read" ON public.product_section_items;
CREATE POLICY "product_section_items_public_read"
  ON public.product_section_items
  FOR SELECT
  USING (true); -- Permitir leitura pública

DROP POLICY IF EXISTS "product_section_items_admin_full" ON public.product_section_items;
CREATE POLICY "product_section_items_admin_full"
  ON public.product_section_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Special Sections - permitir leitura pública
ALTER TABLE public.special_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "special_sections_public_read" ON public.special_sections;
CREATE POLICY "special_sections_public_read"
  ON public.special_sections
  FOR SELECT
  USING (true); -- Permitir leitura pública

DROP POLICY IF EXISTS "special_sections_admin_full" ON public.special_sections;
CREATE POLICY "special_sections_admin_full"
  ON public.special_sections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- News Articles - permitir leitura pública
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_articles_public_read" ON public.news_articles;
CREATE POLICY "news_articles_public_read"
  ON public.news_articles
  FOR SELECT
  USING (true); -- Permitir leitura pública

DROP POLICY IF EXISTS "news_articles_admin_full" ON public.news_articles;
CREATE POLICY "news_articles_admin_full"
  ON public.news_articles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Pages - permitir leitura pública apenas para páginas ativas
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_public_read" ON public.pages;
CREATE POLICY "pages_public_read"
  ON public.pages
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "pages_admin_full" ON public.pages;
CREATE POLICY "pages_admin_full"
  ON public.pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Page Layout Items - permitir leitura pública para itens visíveis
ALTER TABLE public.page_layout_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "page_layout_items_public_read" ON public.page_layout_items;
CREATE POLICY "page_layout_items_public_read"
  ON public.page_layout_items
  FOR SELECT
  USING (is_visible = true);

DROP POLICY IF EXISTS "page_layout_items_admin_full" ON public.page_layout_items;
CREATE POLICY "page_layout_items_admin_full"
  ON public.page_layout_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Quick Links - permitir leitura pública
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quick_links_public_read" ON public.quick_links;
CREATE POLICY "quick_links_public_read"
  ON public.quick_links
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "quick_links_admin_full" ON public.quick_links;
CREATE POLICY "quick_links_admin_full"
  ON public.quick_links
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Service Cards - permitir leitura pública
ALTER TABLE public.service_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_cards_public_read" ON public.service_cards;
CREATE POLICY "service_cards_public_read"
  ON public.service_cards
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "service_cards_admin_full" ON public.service_cards;
CREATE POLICY "service_cards_admin_full"
  ON public.service_cards
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Banners - permitir leitura pública
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banners_public_read" ON public.banners;
CREATE POLICY "banners_public_read"
  ON public.banners
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "banners_admin_full" ON public.banners;
CREATE POLICY "banners_admin_full"
  ON public.banners
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tags - permitir leitura pública
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tags_public_read" ON public.tags;
CREATE POLICY "tags_public_read"
  ON public.tags
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "tags_admin_full" ON public.tags;
CREATE POLICY "tags_admin_full"
  ON public.tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Função de debug para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.debug_admin_status()
RETURNS TABLE(
  user_id UUID,
  user_role TEXT,
  is_admin_result BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.uid() as user_id,
    p.role as user_role,
    public.is_admin() as is_admin_result
  FROM public.profiles p
  WHERE p.id = auth.uid();
END;
$$;
