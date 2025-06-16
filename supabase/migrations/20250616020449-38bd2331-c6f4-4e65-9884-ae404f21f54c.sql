
-- FASE 1: Correções Críticas de Dados e Implementação de RLS (Corrigida v2)

-- 1. Criar tabela de auditoria de segurança se não existir
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS em todas as tabelas críticas
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas RLS otimizadas para security_audit_log
DROP POLICY IF EXISTS "security_audit_log_admin_read_policy" ON public.security_audit_log;
DROP POLICY IF EXISTS "security_audit_log_system_insert_policy" ON public.security_audit_log;

CREATE POLICY "security_audit_log_admin_read_policy"
  ON public.security_audit_log
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "security_audit_log_system_insert_policy"
  ON public.security_audit_log
  FOR INSERT
  WITH CHECK (true);

-- 4. Corrigir dados inconsistentes de produtos
-- Remover produtos duplicados mantendo apenas um por nome
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at DESC) as rn
  FROM public.products
  WHERE name IS NOT NULL
)
DELETE FROM public.products 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 5. Padronizar tags Xbox
UPDATE public.tags SET name = 'xbox' WHERE LOWER(name) IN ('xbox4', 'xbox 4', 'xbox one', 'xbox series');
UPDATE public.tags SET name = 'console' WHERE LOWER(name) IN ('consoles', 'console xbox');
UPDATE public.tags SET name = 'game' WHERE LOWER(name) IN ('games', 'jogos', 'jogo');
UPDATE public.tags SET name = 'accessory' WHERE LOWER(name) IN ('accessories', 'acessorios', 'acessório');
UPDATE public.tags SET name = 'offer' WHERE LOWER(name) IN ('ofertas', 'promocao', 'promoção', 'deal');

-- 6. Inserir tags essenciais se não existirem
INSERT INTO public.tags (name) 
SELECT * FROM (VALUES ('xbox'), ('console'), ('game'), ('accessory'), ('offer')) AS t(name)
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE tags.name = t.name);

-- 7. Criar produtos Xbox de exemplo se não existirem (usando apenas valores válidos)
DO $$
DECLARE
    xbox_tag_id UUID;
    console_tag_id UUID;
    game_tag_id UUID;
    accessory_tag_id UUID;
    offer_tag_id UUID;
    product_id UUID;
BEGIN
    -- Buscar IDs das tags
    SELECT id INTO xbox_tag_id FROM public.tags WHERE name = 'xbox' LIMIT 1;
    SELECT id INTO console_tag_id FROM public.tags WHERE name = 'console' LIMIT 1;
    SELECT id INTO game_tag_id FROM public.tags WHERE name = 'game' LIMIT 1;
    SELECT id INTO accessory_tag_id FROM public.tags WHERE name = 'accessory' LIMIT 1;
    SELECT id INTO offer_tag_id FROM public.tags WHERE name = 'offer' LIMIT 1;

    -- Inserir produtos console se não existirem
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE category = 'console' AND platform = 'xbox') THEN
        -- Xbox Series X
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock)
        VALUES 
        ('Xbox Series X', 'Xbox Series X Console', 'Console de nova geração com 4K e 120fps', 2999.99, 'console', 'xbox', 'new', true, true, '/lovable-uploads/xbox-series-x.jpg', 10)
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, console_tag_id);

        -- Xbox Series S
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock)
        VALUES 
        ('Xbox Series S', 'Xbox Series S Console', 'Console compacto de nova geração', 1999.99, 'console', 'xbox', 'new', true, true, '/lovable-uploads/xbox-series-s.jpg', 15)
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, console_tag_id);
    END IF;

    -- Inserir jogos se não existirem
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE category = 'game' AND platform = 'xbox') THEN
        -- Halo Infinite
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock)
        VALUES 
        ('Halo Infinite', 'Halo Infinite', 'O mais novo capítulo da saga Halo', 199.99, 'game', 'xbox', 'new', true, true, '/lovable-uploads/halo-infinite.jpg', 50)
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, game_tag_id);

        -- Forza Horizon 5
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock, discount_price, badge_visible, badge_text, badge_color)
        VALUES 
        ('Forza Horizon 5', 'Forza Horizon 5', 'Corrida em mundo aberto no México', 249.99, 'game', 'xbox', 'new', true, true, '/lovable-uploads/forza-horizon-5.jpg', 30, 179.99, true, 'OFERTA', 'red')
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, game_tag_id), (product_id, offer_tag_id);
    END IF;

    -- Inserir acessórios se não existirem
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE category = 'accessory' AND platform = 'xbox') THEN
        -- Controle Xbox Wireless
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock)
        VALUES 
        ('Xbox Wireless Controller', 'Controle Xbox Wireless', 'Controle oficial Xbox com tecnologia sem fio', 399.99, 'accessory', 'xbox', 'new', true, true, '/lovable-uploads/xbox-controller.jpg', 25)
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, accessory_tag_id);

        -- Xbox Game Pass Ultimate (usando 'new' em vez de 'digital')
        INSERT INTO public.products (name, title, description, price, category, platform, condition, is_active, is_featured, image, stock, discount_price, badge_visible, badge_text, badge_color)
        VALUES 
        ('Xbox Game Pass Ultimate 3 Meses', 'Xbox Game Pass Ultimate', 'Acesso a centenas de jogos por 3 meses', 89.99, 'accessory', 'xbox', 'new', true, true, '/lovable-uploads/gamepass-ultimate.jpg', 100, 59.99, true, 'PROMOÇÃO', 'green')
        RETURNING id INTO product_id;
        
        INSERT INTO public.product_tags (product_id, tag_id) VALUES 
        (product_id, xbox_tag_id), (product_id, accessory_tag_id), (product_id, offer_tag_id);
    END IF;
END $$;

-- 8. Criar artigos de notícias de exemplo se não existirem
INSERT INTO public.news_articles (title, excerpt, link, category, tags, image_url, read_time)
SELECT * FROM (VALUES 
  ('Xbox Game Pass adiciona novos jogos em junho', 'Confira os novos títulos que chegam ao serviço este mês', 'https://news.xbox.com/gamepass-junho', 'Gaming', ARRAY['xbox', 'gamepass'], '/lovable-uploads/gamepass-news.jpg', '3 min'),
  ('Halo Infinite recebe nova atualização', 'Novos mapas e modos de jogo chegam ao FPS da Microsoft', 'https://news.xbox.com/halo-update', 'Gaming', ARRAY['xbox', 'halo'], '/lovable-uploads/halo-news.jpg', '5 min'),
  ('Xbox Series X|S bate recordes de vendas', 'Consoles da Microsoft continuam em alta no mercado', 'https://news.xbox.com/vendas-record', 'Hardware', ARRAY['xbox', 'console'], '/lovable-uploads/xbox-sales.jpg', '4 min')
) AS t(title, excerpt, link, category, tags, image_url, read_time)
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE news_articles.title = t.title);

-- 9. Garantir que a página Xbox4 existe
INSERT INTO public.pages (title, slug, description, is_active, theme)
SELECT 'Xbox 4', 'xbox4', 'Página dedicada aos produtos e novidades do Xbox', true, '{"primaryColor": "#107C10", "secondaryColor": "#3A3A3A"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'xbox4');

-- 10. Criar seções de layout para a página Xbox4 se não existirem
DO $$
DECLARE
    xbox4_page_id UUID;
BEGIN
    SELECT id INTO xbox4_page_id FROM public.pages WHERE slug = 'xbox4' LIMIT 1;
    
    IF xbox4_page_id IS NOT NULL THEN
        -- Seção de Consoles
        INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
        SELECT xbox4_page_id, 'xbox4_consoles', 'CONSOLES XBOX', 1, true, 'products', '{"filter": {"tagIds": ["xbox", "console"], "limit": 4}, "products": []}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM public.page_layout_items WHERE page_id = xbox4_page_id AND section_key = 'xbox4_consoles');

        -- Seção de Jogos
        INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
        SELECT xbox4_page_id, 'xbox4_games', 'JOGOS EM ALTA', 2, true, 'products', '{"filter": {"tagIds": ["xbox", "game"], "limit": 6}, "products": []}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM public.page_layout_items WHERE page_id = xbox4_page_id AND section_key = 'xbox4_games');

        -- Seção de Acessórios
        INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
        SELECT xbox4_page_id, 'xbox4_accessories', 'ACESSÓRIOS XBOX', 3, true, 'products', '{"filter": {"tagIds": ["xbox", "accessory"], "limit": 4}, "products": []}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM public.page_layout_items WHERE page_id = xbox4_page_id AND section_key = 'xbox4_accessories');

        -- Seção de Ofertas
        INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
        SELECT xbox4_page_id, 'xbox4_deals', 'OFERTAS IMPERDÍVEIS', 4, true, 'products', '{"filter": {"tagIds": ["xbox", "offer"], "limit": 4}, "products": []}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM public.page_layout_items WHERE page_id = xbox4_page_id AND section_key = 'xbox4_deals');

        -- Seção de Notícias
        INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
        SELECT xbox4_page_id, 'xbox4_news', 'NOTÍCIAS & TRAILERS', 5, true, 'news', '{"filter": {"tags": ["xbox"], "limit": 3}, "articles": []}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM public.page_layout_items WHERE page_id = xbox4_page_id AND section_key = 'xbox4_news');
    END IF;
END $$;

-- 11. Atualizar função de log de segurança
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
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details,
    created_at
  ) VALUES (
    event_type,
    user_id,
    details || jsonb_build_object('timestamp', NOW()),
    NOW()
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log de fallback em caso de erro
    RAISE LOG 'Erro ao registrar evento de segurança: %', SQLERRM;
END;
$$;
