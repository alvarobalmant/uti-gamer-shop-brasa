-- Fase 2: Limpar produtos de teste anteriores
DELETE FROM integra_product_tags WHERE product_id IN (
  SELECT id FROM integra_products WHERE matricula BETWEEN 1001 AND 1009
);
DELETE FROM integra_products WHERE matricula BETWEEN 1001 AND 1009;

-- Fase 3: Inserir os 10 produtos reais
INSERT INTO integra_products (matricula, descricao, preco_venda, preco_promocao, foto, grupo, platform, saldo_atual, is_active, is_featured, badge_text, badge_color, badge_visible) VALUES
(2001, 'Controle Sony DualShock 4 PS4 Sem Fio - Preto', 299.90, NULL, '/products/dualshock4-preto.jpeg', 'Controles', 'PS4', 25, true, true, 'Original', '#003087', true),
(2002, 'JBL Flip 7 Caixa de Som Bluetooth Portátil', 759.00, NULL, '/products/jbl-flip7.jpeg', 'Audio', 'Universal', 15, true, true, NULL, NULL, false),
(2003, 'Controle Xbox Wireless Pulse Cipher Special Edition', 590.00, NULL, '/products/xbox-pulse-cipher.jpeg', 'Controles', 'Xbox Series', 12, true, true, 'Edição Especial', '#107c10', true),
(2004, 'Controle Sony DualSense PS5 Sem Fio - Midnight Black', 349.90, NULL, '/products/dualsense-preto.jpeg', 'Controles', 'PS5', 30, true, true, NULL, NULL, false),
(2005, 'Controle Sony DualSense PS5 Sem Fio - Starlight Blue', 399.90, NULL, '/products/dualsense-azul.jpeg', 'Controles', 'PS5', 18, true, true, 'Cor Exclusiva', '#0070d1', true),
(2006, 'PlayStation PULSE Elite Headset Sem Fio', 899.90, 799.90, '/products/pulse-elite.jpeg', 'Audio', 'PS5', 10, true, true, 'Lançamento', '#22c55e', true),
(2007, 'JBL Quantum 100 M2 Headset Gamer Over-Ear', 199.90, NULL, '/products/jbl-quantum-100.jpeg', 'Audio', 'Universal', 40, true, true, 'Mais Vendido', '#f97316', true),
(2008, 'JBL Xtreme 4 Caixa de Som Bluetooth 100W RMS', 2199.00, NULL, '/products/jbl-xtreme4.jpeg', 'Audio', 'Universal', 8, true, true, 'Premium', '#7c3aed', true),
(2009, 'Logitech G29 Driving Force Volante com Pedais', 1799.00, NULL, '/products/logitech-g29.jpeg', 'Acessorios', 'PS5', 6, true, true, 'Pro Gaming', '#00a2ed', true),
(2010, 'Controle Sony DualSense Edge PS5 Pro Wireless', 1199.00, NULL, '/products/dualsense-edge.jpeg', 'Controles', 'PS5', 5, true, true, 'Pro', '#000000', true);

-- Fase 4: Criar tags necessárias (se não existirem)
INSERT INTO integra_tags (name, category) VALUES
('Controles', 'tipo'),
('Audio', 'tipo'),
('Acessorios', 'tipo'),
('PlayStation', 'marca'),
('Xbox', 'marca'),
('PS5', 'plataforma'),
('PS4', 'plataforma'),
('Xbox Series', 'plataforma'),
('JBL', 'marca'),
('Sony', 'marca'),
('Logitech', 'marca'),
('Microsoft', 'marca'),
('Headset', 'subcategoria'),
('Caixa de Som', 'subcategoria'),
('Volante', 'subcategoria')
ON CONFLICT DO NOTHING;

-- Fase 5: Associar tags aos produtos
WITH product_ids AS (
  SELECT id, matricula FROM integra_products WHERE matricula BETWEEN 2001 AND 2010
),
tag_ids AS (
  SELECT id, name FROM integra_tags
)
INSERT INTO integra_product_tags (product_id, tag_id)
SELECT p.id, t.id FROM product_ids p, tag_ids t
WHERE 
  (p.matricula = 2001 AND t.name IN ('Controles', 'PlayStation', 'PS4', 'Sony')) OR
  (p.matricula = 2002 AND t.name IN ('Audio', 'JBL', 'Caixa de Som')) OR
  (p.matricula = 2003 AND t.name IN ('Controles', 'Xbox', 'Xbox Series', 'Microsoft')) OR
  (p.matricula = 2004 AND t.name IN ('Controles', 'PlayStation', 'PS5', 'Sony')) OR
  (p.matricula = 2005 AND t.name IN ('Controles', 'PlayStation', 'PS5', 'Sony')) OR
  (p.matricula = 2006 AND t.name IN ('Audio', 'PlayStation', 'PS5', 'Sony', 'Headset')) OR
  (p.matricula = 2007 AND t.name IN ('Audio', 'JBL', 'Headset')) OR
  (p.matricula = 2008 AND t.name IN ('Audio', 'JBL', 'Caixa de Som')) OR
  (p.matricula = 2009 AND t.name IN ('Acessorios', 'Logitech', 'PS5', 'Volante')) OR
  (p.matricula = 2010 AND t.name IN ('Controles', 'PlayStation', 'PS5', 'Sony'))
ON CONFLICT DO NOTHING;