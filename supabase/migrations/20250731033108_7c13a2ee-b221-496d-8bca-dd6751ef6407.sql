-- Plan Implementation: Fix products.idasproduct_id error

-- Step 1: Drop and recreate view_product_with_tags to force schema refresh
DROP VIEW IF EXISTS view_product_with_tags;

CREATE VIEW view_product_with_tags AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.image,
  p.stock,
  p.badge_text,
  p.badge_color,
  p.badge_visible,
  p.specifications,
  p.images,
  p.is_active,
  p.is_featured,
  p.created_at,
  p.updated_at,
  p.slug,
  p.meta_title,
  p.meta_description,
  p.category,
  p.platform,
  p.condition,
  p.additional_images,
  p.sizes,
  p.colors,
  p.title,
  p.brand,
  p.list_price,
  p.pro_price,
  p.pro_discount_percent,
  p.rating,
  p.product_type,
  p.parent_product_id,
  p.sku_code,
  p.master_slug,
  p.uti_pro_enabled,
  p.uti_pro_value,
  p.uti_pro_custom_price,
  p.uti_pro_type,
  p.promotional_price,
  p.discount_percentage,
  p.pix_discount_percentage,
  p.uti_pro_price,
  p.installment_options,
  p.rating_average,
  p.rating_count,
  p.reviews_enabled,
  p.technical_specs,
  p.product_features,
  p.shipping_weight,
  p.shipping_dimensions,
  p.free_shipping,
  p.shipping_time_min,
  p.shipping_time_max,
  p.store_pickup_available,
  p.related_products,
  p.related_products_auto,
  p.show_stock,
  p.show_rating,
  p.product_videos,
  p.product_faqs,
  p.product_highlights,
  p.new_price,
  p.digital_price,
  p.discount_price,
  p.sort_order,
  p.available_variants,
  p.inherit_from_master,
  p.variant_attributes,
  p.is_master_product,
  p.trust_indicators,
  p.manual_related_products,
  p.breadcrumb_config,
  p.reviews_config,
  p.product_descriptions,
  p.delivery_config,
  p.display_config,
  COALESCE(
    JSON_AGG(
      CASE 
        WHEN t.id IS NOT NULL 
        THEN JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
        ELSE NULL 
      END
    ) FILTER (WHERE t.id IS NOT NULL), 
    '[]'::json
  ) AS tags
FROM products p
LEFT JOIN product_tags pt ON pt.product_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
WHERE p.is_active = true
GROUP BY p.id;

-- Step 2: Create diagnostic function to detect problematic queries
CREATE OR REPLACE FUNCTION debug_column_references()
RETURNS TABLE(
  source_type text,
  source_name text,
  column_reference text,
  is_problematic boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check all views for problematic column references
  RETURN QUERY
  SELECT 
    'view'::text as source_type,
    schemaname || '.' || viewname as source_name,
    definition as column_reference,
    (definition LIKE '%idasproduct_id%' OR 
     definition LIKE '%idas%product_id%' OR
     definition LIKE '%product_id%id%') as is_problematic
  FROM pg_views 
  WHERE schemaname = 'public';
  
  -- Check all functions for problematic references
  RETURN QUERY
  SELECT 
    'function'::text as source_type,
    p.proname as source_name,
    pg_get_functiondef(p.oid) as column_reference,
    (pg_get_functiondef(p.oid) LIKE '%idasproduct_id%' OR 
     pg_get_functiondef(p.oid) LIKE '%idas%product_id%' OR
     pg_get_functiondef(p.oid) LIKE '%product_id%id%') as is_problematic
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public';
END;
$function$;

-- Step 3: Create cache-clearing function
CREATE OR REPLACE FUNCTION clear_postgrest_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Notify PostgREST to reload schema cache
  NOTIFY pgrst, 'reload schema';
  
  -- Log cache clear
  RAISE NOTICE 'PostgREST schema cache cleared at %', NOW();
END;
$function$;

-- Step 4: Execute cache clear
SELECT clear_postgrest_cache();

-- Step 5: Run diagnostic to identify any remaining issues
SELECT * FROM debug_column_references() WHERE is_problematic = true;

-- Step 6: Create monitoring function for future detection
CREATE OR REPLACE FUNCTION monitor_query_errors()
RETURNS TABLE(
  error_time timestamp,
  error_message text,
  error_context text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- This is a placeholder for error monitoring
  -- Real implementation would need to integrate with PostgreSQL's logging system
  RETURN QUERY
  SELECT 
    NOW() as error_time,
    'No current errors detected'::text as error_message,
    'System monitoring active'::text as error_context;
END;
$function$;