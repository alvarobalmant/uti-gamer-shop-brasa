-- PLANO DE OTIMIZAÇÃO BACKEND UTI DOS GAMES
-- Implementação das otimizações de performance identificadas

-- 1. CRIAR ÍNDICES FALTANTES PARA PERFORMANCE

-- Índice para homepage_layout ordenação por visibilidade e ordem
CREATE INDEX IF NOT EXISTS idx_homepage_layout_visible_order 
ON homepage_layout (is_visible, display_order) 
WHERE is_visible = true;

-- Índice para busca de special_sections por título
CREATE INDEX IF NOT EXISTS idx_special_sections_title 
ON special_sections (title);

-- Índice para busca de product_sections por título
CREATE INDEX IF NOT EXISTS idx_product_sections_title 
ON product_sections (title);

-- 2. CRIAR VIEW OTIMIZADA PARA HOMEPAGE LAYOUT
-- Corrigida para usar apenas colunas existentes

CREATE OR REPLACE VIEW view_homepage_layout_complete AS
SELECT 
    hl.id,
    hl.section_key,
    hl.display_order,
    hl.is_visible,
    hl.created_at,
    hl.updated_at,
    -- Para product sections
    ps.title as product_section_title,
    ps.title_part1 as product_section_title_part1,
    ps.title_part2 as product_section_title_part2,
    ps.title_color1 as product_section_title_color1,
    ps.title_color2 as product_section_title_color2,
    ps.view_all_link as product_section_view_all_link,
    -- Para special sections (usando apenas colunas existentes)
    ss.title as special_section_title,
    ss.title_color1 as special_section_title_color1,
    ss.title_color2 as special_section_title_color2,
    ss.background_color as special_section_background_color,
    ss.is_active as special_section_is_active,
    ss.display_order as special_section_display_order,
    ss.content_config as special_section_content_config
FROM homepage_layout hl
LEFT JOIN product_sections ps ON hl.section_key = ps.id
LEFT JOIN special_sections ss ON hl.section_key = ss.id::text;

-- 3. OTIMIZAR POLÍTICAS RLS - REMOVER DUPLICATAS E CRIAR MAIS EFICIENTES

-- Limpar políticas duplicadas do banners
DROP POLICY IF EXISTS "Active banners are viewable by everyone" ON banners;
DROP POLICY IF EXISTS "Allow public read access to active banners" ON banners;
DROP POLICY IF EXISTS "Banners são visíveis para todos" ON banners;
DROP POLICY IF EXISTS "Permitir leitura pública de banners" ON banners;
DROP POLICY IF EXISTS "Public can view active banners" ON banners;
DROP POLICY IF EXISTS "banners_public_read" ON banners;

-- Criar política otimizada para banners
CREATE POLICY "banners_optimized_read" ON banners
FOR SELECT USING (is_active = true);

-- Limpar políticas duplicadas do homepage_layout
DROP POLICY IF EXISTS "Allow public read access to homepage layout" ON homepage_layout;
DROP POLICY IF EXISTS "Anyone can view homepage layout" ON homepage_layout;
DROP POLICY IF EXISTS "Homepage layout is viewable by everyone" ON homepage_layout;
DROP POLICY IF EXISTS "Permitir leitura pública do layout da homepage" ON homepage_layout;
DROP POLICY IF EXISTS "Public read access for homepage layout" ON homepage_layout;
DROP POLICY IF EXISTS "homepage_layout_read" ON homepage_layout;

-- Criar política otimizada para homepage_layout
CREATE POLICY "homepage_layout_optimized_read" ON homepage_layout
FOR SELECT USING (true);

-- Limpar políticas duplicadas do products
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Todos podem visualizar produtos" ON products;

-- Criar política otimizada para products
CREATE POLICY "products_optimized_read" ON products
FOR SELECT USING (true);

-- Limpar políticas duplicadas do product_sections
DROP POLICY IF EXISTS "Allow public read access to product sections" ON product_sections;
DROP POLICY IF EXISTS "Anyone can view product sections" ON product_sections;
DROP POLICY IF EXISTS "Permitir leitura pública de seções de produtos" ON product_sections;
DROP POLICY IF EXISTS "Product sections are viewable by everyone" ON product_sections;
DROP POLICY IF EXISTS "Public read access for product sections" ON product_sections;
DROP POLICY IF EXISTS "product_sections_read" ON product_sections;

-- Criar política otimizada para product_sections
CREATE POLICY "product_sections_optimized_read" ON product_sections
FOR SELECT USING (true);

-- 4. FUNÇÕES DE MONITORAMENTO DE PERFORMANCE

-- Função para monitorar performance de queries
CREATE OR REPLACE FUNCTION public.monitor_query_performance()
RETURNS TABLE(
    query_type text,
    avg_duration_ms numeric,
    total_calls bigint,
    table_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'homepage_layout'::text as query_type,
        0.0::numeric as avg_duration_ms,
        0::bigint as total_calls,
        'homepage_layout'::text as table_name;
    -- Esta é uma função base que pode ser expandida com métricas reais
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para análise de índices
CREATE OR REPLACE FUNCTION public.analyze_index_usage()
RETURNS TABLE(
    table_name text,
    index_name text,
    index_scans bigint,
    tuples_read bigint,
    tuples_fetched bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        indexname as index_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
    FROM pg_stat_user_indexes 
    WHERE schemaname = 'public'
    ORDER BY idx_scan DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpeza automática de dados antigos
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Limpar logs antigos de segurança (mais de 90 dias)
    DELETE FROM admin_security_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Limpar sessões invalidadas antigas (mais de 7 dias)
    DELETE FROM invalidated_sessions 
    WHERE invalidated_at < NOW() - INTERVAL '7 days';
    
    -- Limpar links de admin expirados há mais de 24 horas
    DELETE FROM admin_login_links 
    WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ATUALIZAR ESTATÍSTICAS DAS TABELAS PRINCIPAIS
ANALYZE homepage_layout;
ANALYZE products;
ANALYZE product_sections;
ANALYZE special_sections;
ANALYZE banners;