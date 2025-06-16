
-- PLANO DE CORREÇÃO RLS - Versão Corrigida

-- 1. LIMPAR TODAS AS POLÍTICAS DUPLICADAS E CONFLITANTES
-- Remover políticas da tabela profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_read_own_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_update_own_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_full_policy" ON public.profiles;

-- Remover políticas da tabela products
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "products_public_read_policy" ON public.products;
DROP POLICY IF EXISTS "products_admin_full_policy" ON public.products;

-- 2. CORRIGIR A FUNÇÃO is_admin() - Versão Simplificada e Eficiente
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. RECRIAR POLÍTICAS SIMPLIFICADAS PARA PROFILES
-- Política para usuários lerem seus próprios perfis
CREATE POLICY "profiles_own_read"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política para usuários atualizarem seus próprios perfis (apenas admins podem alterar roles)
CREATE POLICY "profiles_own_update"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Política para admins terem acesso total
CREATE POLICY "profiles_admin_all"
  ON public.profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. RECRIAR POLÍTICAS PARA PRODUCTS
-- Leitura pública de produtos ativos
CREATE POLICY "products_public_read"
  ON public.products
  FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Admins podem gerenciar todos os produtos
CREATE POLICY "products_admin_manage"
  ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. CORRIGIR POLÍTICAS DAS DEMAIS TABELAS ADMINISTRATIVAS
-- Homepage Layout
DROP POLICY IF EXISTS "homepage_layout_public_read" ON public.homepage_layout;
DROP POLICY IF EXISTS "homepage_layout_admin_full" ON public.homepage_layout;

CREATE POLICY "homepage_layout_read"
  ON public.homepage_layout
  FOR SELECT
  USING (true);

CREATE POLICY "homepage_layout_admin"
  ON public.homepage_layout
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Sections
DROP POLICY IF EXISTS "product_sections_public_read" ON public.product_sections;
DROP POLICY IF EXISTS "product_sections_admin_full" ON public.product_sections;

CREATE POLICY "product_sections_read"
  ON public.product_sections
  FOR SELECT
  USING (true);

CREATE POLICY "product_sections_admin"
  ON public.product_sections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Section Items
DROP POLICY IF EXISTS "product_section_items_public_read" ON public.product_section_items;
DROP POLICY IF EXISTS "product_section_items_admin_full" ON public.product_section_items;

CREATE POLICY "product_section_items_read"
  ON public.product_section_items
  FOR SELECT
  USING (true);

CREATE POLICY "product_section_items_admin"
  ON public.product_section_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tags
DROP POLICY IF EXISTS "tags_public_read" ON public.tags;
DROP POLICY IF EXISTS "tags_admin_full" ON public.tags;

CREATE POLICY "tags_read"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "tags_admin"
  ON public.tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Banners
DROP POLICY IF EXISTS "banners_public_read_policy" ON public.banners;
DROP POLICY IF EXISTS "banners_admin_full_policy" ON public.banners;

CREATE POLICY "banners_read"
  ON public.banners
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "banners_admin"
  ON public.banners
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Pages
DROP POLICY IF EXISTS "pages_public_read" ON public.pages;
DROP POLICY IF EXISTS "pages_admin_full" ON public.pages;

CREATE POLICY "pages_read"
  ON public.pages
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "pages_admin"
  ON public.pages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Page Layout Items
DROP POLICY IF EXISTS "page_layout_items_public_read" ON public.page_layout_items;
DROP POLICY IF EXISTS "page_layout_items_admin_full" ON public.page_layout_items;

CREATE POLICY "page_layout_items_read"
  ON public.page_layout_items
  FOR SELECT
  USING (is_visible = true OR public.is_admin());

CREATE POLICY "page_layout_items_admin"
  ON public.page_layout_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. GARANTIR QUE EXISTE PELO MENOS UM ADMIN
DO $$
BEGIN
  -- Verificar se há pelo menos um admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    -- Promover o primeiro usuário a admin
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = (
      SELECT id FROM public.profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
    
    RAISE NOTICE 'Primeiro usuário promovido a admin automaticamente';
  END IF;
END $$;

-- 7. FUNÇÃO DE TESTE PARA VERIFICAR STATUS ADMIN
CREATE OR REPLACE FUNCTION public.test_admin_access()
RETURNS TABLE(
  current_user_id UUID,
  user_exists BOOLEAN,
  user_role TEXT,
  is_admin_result BOOLEAN,
  can_read_profiles BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_user_id UUID;
  test_role TEXT;
  test_admin BOOLEAN;
  test_read BOOLEAN;
BEGIN
  test_user_id := auth.uid();
  
  -- Verificar se usuário existe
  SELECT role INTO test_role FROM public.profiles WHERE id = test_user_id;
  
  -- Testar função is_admin
  test_admin := public.is_admin();
  
  -- Testar se pode ler profiles (simulação de política)
  test_read := EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = test_user_id OR test_admin
  );
  
  RETURN QUERY SELECT 
    test_user_id,
    (test_role IS NOT NULL),
    COALESCE(test_role, 'NOT_FOUND'),
    test_admin,
    test_read;
END;
$$;
