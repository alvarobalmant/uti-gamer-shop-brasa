
-- Buscar uma seção especial existente para verificar o content_config atual
-- e adicionar o novo campo carousel_rows
UPDATE special_sections 
SET content_config = COALESCE(content_config, '{}'::jsonb) || 
    '{"carousel_rows": [
        {
            "row_id": "test_carousel_1",
            "title": "PlayStation 5 Accessories. Best Sellers.",
            "showTitle": true,
            "titleAlignment": "left",
            "selection_mode": "products",
            "product_ids": ["1", "2", "3", "4", "5", "6"]
        }
    ]}'::jsonb,
    updated_at = now()
WHERE id = (
    SELECT id 
    FROM special_sections 
    WHERE is_active = true 
    ORDER BY created_at DESC 
    LIMIT 1
);
