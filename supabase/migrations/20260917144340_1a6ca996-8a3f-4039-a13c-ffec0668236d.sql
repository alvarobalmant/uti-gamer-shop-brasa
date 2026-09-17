-- 1. daily_bonus_codes: remove leitura pública dos códigos ativos
DROP POLICY IF EXISTS "Everyone can view active codes" ON public.daily_bonus_codes;
REVOKE ALL ON public.daily_bonus_codes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_bonus_codes TO authenticated;
GRANT ALL ON public.daily_bonus_codes TO service_role;

-- 2. daily_codes: remove insert público e leitura irrestrita
DROP POLICY IF EXISTS "System can insert codes" ON public.daily_codes;
DROP POLICY IF EXISTS "Everyone can view current codes" ON public.daily_codes;
DROP POLICY IF EXISTS "Admins can manage daily codes" ON public.daily_codes;
CREATE POLICY "Admins can manage daily codes"
  ON public.daily_codes FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
REVOKE ALL ON public.daily_codes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_codes TO authenticated;
GRANT ALL ON public.daily_codes TO service_role;

-- 3. integra_tags: escrita apenas para admins
DROP POLICY IF EXISTS "Admin pode gerenciar tags" ON public.integra_tags;
CREATE POLICY "Admins podem gerenciar tags"
  ON public.integra_tags FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. usuarios: cada pessoa só cria o próprio registro
DROP POLICY IF EXISTS "System can insert in usuarios" ON public.usuarios;
CREATE POLICY "Users can insert their own record in usuarios"
  ON public.usuarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 5. Consolidação de políticas de leitura duplicadas
-- banners
DROP POLICY IF EXISTS "banners_optimized_read" ON public.banners;
DROP POLICY IF EXISTS "banners_read_policy" ON public.banners;
CREATE POLICY "banners_read_policy"
  ON public.banners FOR SELECT
  USING ((is_active = true) OR public.is_admin());

-- quick_links
DROP POLICY IF EXISTS "Active quick links are viewable by everyone" ON public.quick_links;
DROP POLICY IF EXISTS "Allow public read access" ON public.quick_links;
DROP POLICY IF EXISTS "Allow public read access to active quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Permitir leitura pública de quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Public can view active quick links" ON public.quick_links;
DROP POLICY IF EXISTS "Public read access for quick links" ON public.quick_links;
DROP POLICY IF EXISTS "quick_links_public_read" ON public.quick_links;
DROP POLICY IF EXISTS "quick_links_read_policy" ON public.quick_links;
CREATE POLICY "quick_links_read_policy"
  ON public.quick_links FOR SELECT
  USING ((is_active = true) OR public.is_admin());

-- service_cards
DROP POLICY IF EXISTS "Active service cards are viewable by everyone" ON public.service_cards;
DROP POLICY IF EXISTS "Allow public read access to active service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Cards de serviço são visíveis para todos" ON public.service_cards;
DROP POLICY IF EXISTS "Permitir leitura pública de cartões de serviço" ON public.service_cards;
DROP POLICY IF EXISTS "Public can view active service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Public read access for service cards" ON public.service_cards;
DROP POLICY IF EXISTS "service_cards_public_read" ON public.service_cards;
DROP POLICY IF EXISTS "service_cards_read_policy" ON public.service_cards;
CREATE POLICY "service_cards_read_policy"
  ON public.service_cards FOR SELECT
  USING ((is_active = true) OR public.is_admin());

-- news_articles (tabela sem coluna de ativo: leitura pública única)
DROP POLICY IF EXISTS "Allow public read access to news_articles" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can view news articles" ON public.news_articles;
DROP POLICY IF EXISTS "news_articles_public_read" ON public.news_articles;
DROP POLICY IF EXISTS "news_articles_read_policy" ON public.news_articles;
CREATE POLICY "news_articles_read_policy"
  ON public.news_articles FOR SELECT
  USING (true);

-- homepage_layout
DROP POLICY IF EXISTS "homepage_layout_optimized_read" ON public.homepage_layout;
DROP POLICY IF EXISTS "homepage_layout_read_policy" ON public.homepage_layout;
CREATE POLICY "homepage_layout_read_policy"
  ON public.homepage_layout FOR SELECT
  USING (true);