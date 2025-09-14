-- Recriar a view para incluir weight e category das tags
DROP VIEW IF EXISTS view_product_with_tags;

CREATE VIEW view_product_with_tags AS
SELECT 
  p.*,
  t.id AS tag_id,
  t.name AS tag_name,
  t.weight AS tag_weight,
  t.category AS tag_category
FROM products p
LEFT JOIN product_tags pt ON p.id = pt.product_id
LEFT JOIN tags t ON pt.tag_id = t.id;