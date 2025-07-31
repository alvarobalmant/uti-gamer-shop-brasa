-- STEP 1: Drop current view
DROP VIEW IF EXISTS view_product_with_tags;

-- STEP 2: Create compatible view with correct aliases
CREATE VIEW view_product_with_tags AS
SELECT 
  -- 🔧 ALIASES CORRETOS PARA FRONTEND:
  p.id AS product_id,
  p.name AS product_name,
  p.description AS product_description,
  p.price AS product_price,
  p.image AS product_image,
  p.stock AS product_stock,
  
  -- 🎯 TODOS OS OUTROS CAMPOS (mantém como estão):
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
  
  -- 🏷️ TAGS (mantém como está):
  COALESCE(
    JSON_AGG(
      CASE 
        WHEN t.id IS NOT NULL 
        THEN JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
        ELSE NULL 
      END
    ) FILTER (WHERE t.id IS NOT NULL), 
    '[]'::json
  ) AS tags,
  
  -- 🔧 ALIASES EXTRAS:
  t.id AS tag_id,
  t.name AS tag_name

FROM products p
LEFT JOIN product_tags pt ON pt.product_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
WHERE p.is_active = true
GROUP BY p.id, t.id, t.name;

-- STEP 3: Force schema reload
SELECT pg_notify('pgrst', 'reload schema');

-- STEP 4: Grant permissions
GRANT SELECT ON view_product_with_tags TO anon;
GRANT SELECT ON view_product_with_tags TO authenticated;