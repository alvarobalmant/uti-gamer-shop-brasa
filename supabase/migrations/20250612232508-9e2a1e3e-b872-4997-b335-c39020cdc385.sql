
-- First, let's ensure the xbox4 page exists
INSERT INTO public.pages (slug, title, description, is_active, theme)
SELECT 'xbox4', 'Xbox Gaming', 'Página dedicada aos jogos e acessórios Xbox', true, '{"primaryColor": "#107C10", "secondaryColor": "#3A3A3A", "accentColor": "#0E6B0E"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.pages WHERE slug = 'xbox4');

-- Clean up any existing sections for xbox4 to avoid duplicates
DELETE FROM public.page_layout_items 
WHERE page_id IN (SELECT id FROM public.pages WHERE slug = 'xbox4');

-- Now let's insert all required sections for xbox4 page
WITH xbox4_page AS (
  SELECT id FROM public.pages WHERE slug = 'xbox4'
)
INSERT INTO public.page_layout_items (page_id, section_key, title, section_type, display_order, is_visible, section_config)
SELECT 
  xbox4_page.id,
  section_data.section_key,
  section_data.title,
  section_data.section_type,
  section_data.display_order,
  true,
  section_data.section_config::jsonb
FROM xbox4_page,
(VALUES
  ('xbox4_featured_products', 'Produtos em Destaque', 'products', 1, '{"filter": {"tagIds": [], "limit": 6}, "columns": 3, "showPrices": true, "showBadges": true}'),
  ('xbox4_news_section', 'Notícias Xbox', 'news', 2, '{"layout": "grid", "articles": []}'),
  ('xbox4_offers_section', 'Ofertas Especiais', 'products', 3, '{"filter": {"tagIds": [], "featured": true, "limit": 4}, "columns": 2, "showPrices": true}'),
  ('xbox4_secondary_banners', 'Banners Secundários', 'banner', 4, '{"type": "hero", "layout": "full-width", "title": "", "subtitle": ""}')
) AS section_data(section_key, title, section_type, display_order, section_config);
