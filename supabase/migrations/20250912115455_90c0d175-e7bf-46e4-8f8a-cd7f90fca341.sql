-- Adicionar colunas weight e category na tabela tags
ALTER TABLE public.tags 
ADD COLUMN weight INTEGER DEFAULT 1,
ADD COLUMN category VARCHAR(50) DEFAULT 'generic';

-- Criar índice para otimizar buscas por categoria
CREATE INDEX idx_tags_category_weight ON public.tags(category, weight DESC);

-- Função para categorizar tags automaticamente baseado em padrões
CREATE OR REPLACE FUNCTION public.categorize_existing_tags()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  -- Platform tags (peso 5)
  UPDATE public.tags 
  SET category = 'platform', weight = 5
  WHERE LOWER(name) IN ('xbox', 'ps4', 'ps5', 'ps3', 'ps2', 'ps1', 'playstation', 'nintendo', 'switch', 'pc', 'steam', 'epic', 'origin')
     OR LOWER(name) LIKE '%xbox%'
     OR LOWER(name) LIKE '%playstation%'
     OR LOWER(name) LIKE '%nintendo%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Product type tags (peso 4)
  UPDATE public.tags 
  SET category = 'product_type', weight = 4
  WHERE LOWER(name) IN ('jogo', 'game', 'console', 'controle', 'acessorio', 'headset', 'mouse', 'teclado', 'cabo')
    AND category = 'generic';
  
  -- Game title tags (peso 4) - jogos populares
  UPDATE public.tags 
  SET category = 'game_title', weight = 4
  WHERE LOWER(name) IN ('minecraft', 'fifa', 'callofduty', 'cod', 'farcry', 'assassins', 'gta', 'fortnite', 'valorant', 'lol', 'cyberpunk', 'witcher', 'elden', 'ring', 'halo', 'forza', 'mario', 'zelda', 'pokemon')
    AND category = 'generic';
  
  -- Brand tags (peso 3)
  UPDATE public.tags 
  SET category = 'brand', weight = 3
  WHERE LOWER(name) IN ('sony', 'microsoft', 'nintendo', 'ubisoft', 'ea', 'activision', 'blizzard', 'riot', 'valve', 'epic', 'rockstar', 'cdprojekt', 'mojang', 'bethesda', 'bioware')
    AND category = 'generic';
  
  -- Genre tags (peso 2)
  UPDATE public.tags 
  SET category = 'genre', weight = 2
  WHERE LOWER(name) IN ('acao', 'aventura', 'rpg', 'fps', 'mmorpg', 'estrategia', 'corrida', 'esporte', 'simulacao', 'puzzle', 'plataforma', 'luta', 'terror', 'horror', 'indie', 'casual')
    AND category = 'generic';
  
  -- Physical attribute tags (peso 1)
  UPDATE public.tags 
  SET category = 'physical_attribute', weight = 1
  WHERE (LOWER(name) ~ '\d+cm$' 
     OR LOWER(name) IN ('verde', 'azul', 'vermelho', 'preto', 'branco', 'amarelo', 'rosa', 'roxo', 'pequeno', 'medio', 'grande', 'mini', 'xl', 'xxl'))
    AND category = 'generic';
  
  -- Condition/status tags (peso 1)
  UPDATE public.tags 
  SET category = 'condition', weight = 1
  WHERE LOWER(name) IN ('novo', 'usado', 'seminovo', 'lacrado', 'aberto', 'promocao', 'oferta', 'desconto', 'limitado', 'especial', 'oficial', 'original', 'falsificado')
    AND category = 'generic';
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para busca com pesos
CREATE OR REPLACE FUNCTION public.search_products_weighted(
  search_terms TEXT[],
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
  product_id UUID,
  product_name TEXT,
  product_price NUMERIC,
  product_image TEXT,
  product_slug TEXT,
  relevance_score NUMERIC,
  matched_tags JSONB,
  debug_info JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH search_matches AS (
    SELECT 
      p.id,
      p.name,
      p.price,
      p.image,
      p.slug,
      -- Score base: quantidade de tags que fazem match
      COUNT(DISTINCT t.id)::NUMERIC as base_score,
      -- Score ponderado: soma dos pesos das tags que fazem match
      COALESCE(SUM(DISTINCT t.weight), 0)::NUMERIC as weighted_score,
      -- Boost por tipo: jogos recebem boost se busca inclui plataforma
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM unnest(search_terms) term 
          WHERE LOWER(term) = ANY(ARRAY['xbox', 'ps4', 'ps5', 'ps3', 'nintendo', 'pc', 'switch'])
        ) AND EXISTS (
          SELECT 1 FROM public.product_tags pt2 
          JOIN public.tags t2 ON pt2.tag_id = t2.id 
          WHERE pt2.product_id = p.id AND t2.category = 'product_type' AND LOWER(t2.name) = 'jogo'
        ) THEN 2.0
        ELSE 1.0 
      END as type_boost,
      -- Tags que fizeram match para debug
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'name', t.name,
          'category', t.category,
          'weight', t.weight
        )
      ) FILTER (WHERE t.id IS NOT NULL) as matched_tags_info
    FROM public.products p
    LEFT JOIN public.product_tags pt ON p.id = pt.product_id
    LEFT JOIN public.tags t ON pt.tag_id = t.id
    WHERE p.is_active = true
      AND (
        -- Match no nome do produto
        EXISTS (
          SELECT 1 FROM unnest(search_terms) term 
          WHERE LOWER(p.name) LIKE '%' || LOWER(term) || '%'
        )
        OR
        -- Match nas tags
        EXISTS (
          SELECT 1 FROM unnest(search_terms) term 
          WHERE LOWER(t.name) LIKE '%' || LOWER(term) || '%'
        )
      )
    GROUP BY p.id, p.name, p.price, p.image, p.slug
  )
  SELECT 
    sm.id,
    sm.name,
    sm.price,
    sm.image,
    sm.slug,
    -- Score final = (score base + score ponderado) * boost
    (sm.base_score + sm.weighted_score) * sm.type_boost as relevance_score,
    COALESCE(sm.matched_tags_info, '[]'::jsonb) as matched_tags,
    jsonb_build_object(
      'base_score', sm.base_score,
      'weighted_score', sm.weighted_score,
      'type_boost', sm.type_boost,
      'final_score', (sm.base_score + sm.weighted_score) * sm.type_boost
    ) as debug_info
  FROM search_matches sm
  ORDER BY relevance_score DESC, sm.name ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View otimizada para busca
CREATE OR REPLACE VIEW public.view_products_search AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.image,
  p.slug,
  p.is_active,
  p.stock,
  string_agg(DISTINCT t.name, ';') as tag_names,
  jsonb_agg(
    DISTINCT jsonb_build_object(
      'id', t.id,
      'name', t.name,
      'category', t.category,
      'weight', t.weight
    )
  ) FILTER (WHERE t.id IS NOT NULL) as tags_with_weights
FROM public.products p
LEFT JOIN public.product_tags pt ON p.id = pt.product_id
LEFT JOIN public.tags t ON pt.tag_id = t.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.description, p.price, p.image, p.slug, p.is_active, p.stock;