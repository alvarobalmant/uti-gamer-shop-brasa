-- Corrigir função de busca com pesos - ajustar tipos de retorno
DROP FUNCTION IF EXISTS public.search_products_weighted(TEXT[], INTEGER);

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
      p.name::TEXT,
      p.price,
      COALESCE(p.image, '')::TEXT as img,
      COALESCE(p.slug, '')::TEXT as slug_text,
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
    sm.img,
    sm.slug_text,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;