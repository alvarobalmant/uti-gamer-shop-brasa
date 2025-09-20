-- Criar enum para categorias de tags
CREATE TYPE tag_category_enum AS ENUM (
  'platform',         -- Console/PC (peso 7) - Xbox, PS5, PC, etc
  'product_type',      -- Tipo do produto (peso 6) - Console, Jogo, Controle, etc  
  'game_title',        -- Nome específico do jogo (peso 6) - FIFA, GTA, etc
  'console_model',     -- Modelo específico do console (peso 5) - PS5 Slim, Xbox Series X
  'brand',             -- Marca (peso 5) - Sony, Microsoft, Ubisoft, etc
  'accessory_type',    -- Tipo de acessório (peso 4) - Headset, Mouse, Teclado
  'collectible',       -- Colecionáveis (peso 4) - Funko Pop, Action Figure
  'clothing',          -- Roupas (peso 4) - Camiseta, Moletom, Boné
  'genre',             -- Gênero do jogo (peso 3) - Ação, RPG, Esporte
  'feature',           -- Características (peso 3) - Bluetooth, USB, LED
  'edition',           -- Edição especial (peso 3) - Deluxe, Gold, Standard
  'condition',         -- Estado (peso 2) - Novo, Usado, Lacrado
  'physical_attribute', -- Atributos físicos (peso 1) - Cor, Tamanho
  'generic'            -- Tags genéricas (peso 1)
);

-- Adicionar nova coluna para categoria enum
ALTER TABLE tags ADD COLUMN category_enum tag_category_enum;

-- Migrar dados existentes
UPDATE tags SET category_enum = 
  CASE 
    WHEN category = 'platform' THEN 'platform'::tag_category_enum
    WHEN category = 'product_type' THEN 'product_type'::tag_category_enum
    WHEN category = 'game_title' THEN 'game_title'::tag_category_enum
    WHEN category = 'brand' THEN 'brand'::tag_category_enum
    WHEN category = 'genre' THEN 'genre'::tag_category_enum
    WHEN category = 'condition' THEN 'condition'::tag_category_enum
    WHEN category = 'physical_attribute' THEN 'physical_attribute'::tag_category_enum
    ELSE 'generic'::tag_category_enum
  END;

-- Criar tabela para configuração de categorias
CREATE TABLE tag_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category_enum tag_category_enum NOT NULL UNIQUE,
  default_weight INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  color TEXT DEFAULT '#666666',
  icon_emoji TEXT DEFAULT '🏷️',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Popular tabela de categorias com dados padrão
INSERT INTO tag_categories (name, category_enum, default_weight, description, color, icon_emoji, display_order) VALUES
('Plataforma', 'platform', 7, 'Console, PC ou plataforma digital', '#3b82f6', '🎮', 1),
('Tipo de Produto', 'product_type', 6, 'Console, jogo, controle, etc.', '#10b981', '📦', 2),
('Título do Jogo', 'game_title', 6, 'Nome específico do jogo', '#8b5cf6', '🎯', 3),
('Modelo do Console', 'console_model', 5, 'Modelo específico do console', '#06b6d4', '🎮', 4),
('Marca', 'brand', 5, 'Fabricante ou desenvolvedora', '#f59e0b', '🏢', 5),
('Tipo de Acessório', 'accessory_type', 4, 'Headset, mouse, teclado, etc.', '#ef4444', '🎧', 6),
('Colecionável', 'collectible', 4, 'Funko Pop, action figures, etc.', '#ec4899', '🏆', 7),
('Vestuário', 'clothing', 4, 'Camisetas, moletons, bonés', '#84cc16', '👕', 8),
('Gênero', 'genre', 3, 'Ação, RPG, esporte, etc.', '#6366f1', '🎪', 9),
('Características', 'feature', 3, 'Bluetooth, USB, LED, etc.', '#14b8a6', '⚡', 10),
('Edição', 'edition', 3, 'Standard, Deluxe, Gold, etc.', '#f97316', '💎', 11),
('Condição', 'condition', 2, 'Novo, usado, lacrado', '#71717a', '📋', 12),
('Atributo Físico', 'physical_attribute', 1, 'Cor, tamanho, peso', '#a3a3a3', '📏', 13),
('Genérica', 'generic', 1, 'Tags não categorizadas', '#6b7280', '🏷️', 14);

-- Atualizar pesos baseado na nova categorização
UPDATE tags SET weight = tc.default_weight
FROM tag_categories tc 
WHERE tags.category_enum = tc.category_enum;

-- Criar função para busca inteligente com sinônimos e matching
CREATE OR REPLACE FUNCTION search_products_enhanced(
  search_terms TEXT[],
  limit_count INTEGER DEFAULT 20
) RETURNS TABLE(
  product_id UUID,
  product_name TEXT,
  product_price NUMERIC,
  product_image TEXT,
  product_slug TEXT,
  relevance_score NUMERIC,
  matched_tags JSONB,
  debug_info JSONB
) LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  term TEXT;
  synonym_map JSONB := '{
    "play": ["playstation", "ps"],
    "ps": ["playstation", "play"],
    "playstation": ["ps", "play"],
    "xbox": ["microsoft"],
    "nintendo": ["switch"],
    "controle": ["controller", "joystick"],
    "controller": ["controle", "joystick"],
    "console": ["videogame"],
    "jogo": ["game"],
    "game": ["jogo"]
  }';
  expanded_terms TEXT[] := search_terms;
BEGIN
  -- Expandir termos com sinônimos
  FOREACH term IN ARRAY search_terms LOOP
    IF synonym_map ? LOWER(term) THEN
      expanded_terms := expanded_terms || (
        SELECT ARRAY(SELECT jsonb_array_elements_text(synonym_map->LOWER(term)))
      );
    END IF;
  END LOOP;

  RETURN QUERY
  WITH search_matches AS (
    SELECT 
      p.id,
      p.name::TEXT,
      p.price,
      COALESCE(p.image, '')::TEXT as img,
      COALESCE(p.slug, '')::TEXT as slug_text,
      
      -- Score base melhorado
      (
        -- Match exato no nome (peso alto)
        CASE WHEN EXISTS (
          SELECT 1 FROM unnest(expanded_terms) term 
          WHERE LOWER(p.name) = LOWER(term)
        ) THEN 50.0 ELSE 0.0 END
        +
        -- Match parcial no nome
        CASE WHEN EXISTS (
          SELECT 1 FROM unnest(expanded_terms) term 
          WHERE LOWER(p.name) LIKE '%' || LOWER(term) || '%'
        ) THEN 20.0 ELSE 0.0 END
        +
        -- Match em tags
        COUNT(DISTINCT t.id) * 5.0
      )::NUMERIC as base_score,
      
      -- Score ponderado por categoria
      COALESCE(SUM(DISTINCT 
        CASE 
          WHEN tc.category_enum = 'platform' AND EXISTS (
            SELECT 1 FROM unnest(expanded_terms) term 
            WHERE LOWER(t.name) LIKE '%' || LOWER(term) || '%'
          ) THEN tc.default_weight * 3.0
          WHEN tc.category_enum = 'product_type' AND EXISTS (
            SELECT 1 FROM unnest(expanded_terms) term 
            WHERE LOWER(t.name) LIKE '%' || LOWER(term) || '%'
          ) THEN tc.default_weight * 2.5
          WHEN tc.category_enum = 'game_title' AND EXISTS (
            SELECT 1 FROM unnest(expanded_terms) term 
            WHERE LOWER(t.name) LIKE '%' || LOWER(term) || '%'
          ) THEN tc.default_weight * 2.5
          ELSE tc.default_weight
        END
      ), 0)::NUMERIC as weighted_score,
      
      -- Sistema de boost inteligente
      (
        CASE 
          -- Console + modelo/número
          WHEN EXISTS (SELECT 1 FROM unnest(expanded_terms) term WHERE LOWER(term) ~ '(ps|play|xbox|nintendo|switch)') 
               AND EXISTS (SELECT 1 FROM unnest(expanded_terms) term WHERE term ~ '\d')
               AND EXISTS (SELECT 1 FROM public.product_tags pt2 JOIN public.tags t2 ON pt2.tag_id = t2.id 
                          WHERE pt2.product_id = p.id AND t2.category_enum = 'product_type' AND LOWER(t2.name) = 'console')
          THEN 3.0
          
          -- Jogo + plataforma
          WHEN EXISTS (SELECT 1 FROM unnest(expanded_terms) term WHERE LOWER(term) ~ '(ps|play|xbox|nintendo|pc)')
               AND EXISTS (SELECT 1 FROM public.product_tags pt2 JOIN public.tags t2 ON pt2.tag_id = t2.id 
                          WHERE pt2.product_id = p.id AND t2.category_enum = 'product_type' AND LOWER(t2.name) = 'jogo')
          THEN 2.5
          
          -- Controle + plataforma
          WHEN EXISTS (SELECT 1 FROM unnest(expanded_terms) term WHERE LOWER(term) ~ '(controle|controller)')
               AND EXISTS (SELECT 1 FROM unnest(expanded_terms) term WHERE LOWER(term) ~ '(ps|play|xbox)')
          THEN 2.0
          
          ELSE 1.0 
        END
      ) as context_boost,
      
      -- Tags que fizeram match
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'name', t.name,
          'category', tc.name,
          'weight', tc.default_weight,
          'category_enum', tc.category_enum
        )
      ) FILTER (WHERE t.id IS NOT NULL) as matched_tags_info
      
    FROM public.products p
    LEFT JOIN public.product_tags pt ON p.id = pt.product_id
    LEFT JOIN public.tags t ON pt.tag_id = t.id
    LEFT JOIN public.tag_categories tc ON t.category_enum = tc.category_enum
    WHERE p.is_active = true
      AND (
        -- Match no nome do produto (com sinônimos)
        EXISTS (
          SELECT 1 FROM unnest(expanded_terms) term 
          WHERE LOWER(p.name) LIKE '%' || LOWER(term) || '%'
        )
        OR
        -- Match nas tags (com sinônimos)
        EXISTS (
          SELECT 1 FROM unnest(expanded_terms) term 
          WHERE LOWER(t.name) LIKE '%' || LOWER(term) || '%'
        )
      )
    GROUP BY p.id, p.name, p.price, p.image, p.slug
  )
  SELECT 
    sm.id,
    sm.name,
    sm.price,
    sm.img,
    sm.slug_text,
    -- Score final = (base + weighted) * boost
    ROUND((sm.base_score + sm.weighted_score) * sm.context_boost, 2) as relevance_score,
    COALESCE(sm.matched_tags_info, '[]'::jsonb) as matched_tags,
    jsonb_build_object(
      'base_score', sm.base_score,
      'weighted_score', sm.weighted_score,
      'context_boost', sm.context_boost,
      'final_score', ROUND((sm.base_score + sm.weighted_score) * sm.context_boost, 2),
      'expanded_terms', array_to_json(expanded_terms)
    ) as debug_info
  FROM search_matches sm
  WHERE (sm.base_score + sm.weighted_score) > 0
  ORDER BY relevance_score DESC, sm.name ASC
  LIMIT limit_count;
END;
$$;

-- Atualizar função de busca weightted para usar a nova enhanced
CREATE OR REPLACE FUNCTION search_products_weighted(
  search_terms TEXT[],
  limit_count INTEGER DEFAULT 20
) RETURNS TABLE(
  product_id UUID,
  product_name TEXT,
  product_price NUMERIC,
  product_image TEXT,
  product_slug TEXT,
  relevance_score NUMERIC,
  matched_tags JSONB,
  debug_info JSONB
) LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  RETURN QUERY SELECT * FROM search_products_enhanced(search_terms, limit_count);
END;
$$;

-- RLS Policies para tag_categories
ALTER TABLE tag_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tag categories" ON tag_categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Everyone can view active tag categories" ON tag_categories
  FOR SELECT USING (is_active = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tag_categories_updated_at
  BEFORE UPDATE ON tag_categories
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();