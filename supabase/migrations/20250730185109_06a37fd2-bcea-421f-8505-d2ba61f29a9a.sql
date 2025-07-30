-- CORREÇÃO DE WARNINGS DE SEGURANÇA
-- Corrigindo as views com SECURITY DEFINER e outros problemas

-- 1. CORRIGIR VIEW COM SECURITY DEFINER
-- Recriar a view sem SECURITY DEFINER
DROP VIEW IF EXISTS view_homepage_layout_complete;

CREATE VIEW view_homepage_layout_complete AS
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

-- 2. CORRIGIR FUNÇÕES SEM SEARCH_PATH
-- Atualizar funções de monitoramento com search_path

CREATE OR REPLACE FUNCTION public.monitor_query_performance()
RETURNS TABLE(
    query_type text,
    avg_duration_ms numeric,
    total_calls bigint,
    table_name text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'homepage_layout'::text as query_type,
        0.0::numeric as avg_duration_ms,
        0::bigint as total_calls,
        'homepage_layout'::text as table_name;
    -- Esta é uma função base que pode ser expandida com métricas reais
END;
$$;

CREATE OR REPLACE FUNCTION public.analyze_index_usage()
RETURNS TABLE(
    table_name text,
    index_name text,
    index_scans bigint,
    tuples_read bigint,
    tuples_fetched bigint
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;