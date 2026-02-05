-- Inserir 10 novos produtos (matricula 2011-2020)
INSERT INTO integra_products (
  matricula, descricao, preco_venda, preco_promocao, 
  foto, grupo, platform, saldo_atual, 
  is_active, is_featured, badge_text, badge_color, badge_visible
) VALUES
(2011, 'Controle Sony DualSense PS5 Sem Fio - Branco', 369.90, NULL, '/products/dualsense-branco.jpeg', 'Controles', 'PS5', 35, true, true, 'Original', '#003087', true),
(2012, 'QCY ArcBuds Lite T27 Fone Bluetooth 5.3 TWS', 89.90, NULL, '/products/qcy-arcbuds-lite.jpeg', 'Audio', 'Universal', 50, true, true, 'Custo-Beneficio', '#f59e0b', true),
(2013, 'JBL Quantum 360X Headset Gamer Wireless para Xbox', 599.90, 549.90, '/products/jbl-quantum-360x.jpeg', 'Audio', 'Xbox Series', 12, true, true, 'Para Xbox', '#107c10', true),
(2014, 'Logitech G Driving Force Shifter Cambio 6 Marchas', 499.00, NULL, '/products/logitech-shifter.jpeg', 'Acessorios', 'PS5', 8, true, true, 'Pro Racing', '#00a2ed', true),
(2015, 'PlayStation 5 Disc Drive Leitor de Disco para PS5 Slim', 699.90, NULL, '/products/ps5-disc-drive.jpeg', 'Acessorios', 'PS5', 15, true, true, 'Oficial', '#003087', true),
(2016, 'PlayStation VR2 Oculos de Realidade Virtual PS5', 2499.00, NULL, '/products/playstation-vr2.jpeg', 'Consoles', 'PS5', 5, true, true, 'VR Premium', '#8b5cf6', true),
(2017, 'Console PlayStation 5 Slim com Disco 1TB', 3499.00, NULL, '/products/ps5-slim-console.jpeg', 'Consoles', 'PS5', 8, true, true, 'Novo Slim', '#003087', true),
(2018, 'Controle Sony DualSense PS5 Sem Fio - Cobalt Blue', 469.90, NULL, '/products/dualsense-cobalt-blue.jpeg', 'Controles', 'PS5', 20, true, true, 'Cor Exclusiva', '#2563eb', true),
(2019, 'DualSense Base de Carregamento PS5 Charging Station', 199.90, NULL, '/products/dualsense-charging-station.jpeg', 'Acessorios', 'PS5', 30, true, true, 'Essencial', '#10b981', true),
(2020, 'Controle Xbox Wireless Series X/S Velocity Green', 599.00, NULL, '/products/xbox-velocity-green.jpeg', 'Controles', 'Xbox Series', 15, true, true, 'Edicao Especial', '#22c55e', true);

-- Criar novas tags
INSERT INTO integra_tags (name, category) VALUES
('QCY', 'marca'),
('VR', 'subcategoria'),
('Console', 'tipo'),
('Fone TWS', 'subcategoria')
ON CONFLICT DO NOTHING;

-- Associar tags aos novos produtos
WITH product_ids AS (
  SELECT id, matricula FROM integra_products WHERE matricula BETWEEN 2011 AND 2020
),
tag_ids AS (
  SELECT id, name FROM integra_tags
)
INSERT INTO integra_product_tags (product_id, tag_id)
SELECT p.id, t.id FROM product_ids p, tag_ids t
WHERE 
  (p.matricula = 2011 AND t.name IN ('Sony', 'Controles', 'PS5')) OR
  (p.matricula = 2012 AND t.name IN ('QCY', 'Audio', 'Fone TWS')) OR
  (p.matricula = 2013 AND t.name IN ('JBL', 'Audio', 'Headset', 'Xbox')) OR
  (p.matricula = 2014 AND t.name IN ('Logitech', 'Acessorios')) OR
  (p.matricula = 2015 AND t.name IN ('Sony', 'Acessorios', 'PS5')) OR
  (p.matricula = 2016 AND t.name IN ('Sony', 'PS5', 'VR', 'Console')) OR
  (p.matricula = 2017 AND t.name IN ('Sony', 'PS5', 'Console')) OR
  (p.matricula = 2018 AND t.name IN ('Sony', 'Controles', 'PS5')) OR
  (p.matricula = 2019 AND t.name IN ('Sony', 'Acessorios', 'PS5')) OR
  (p.matricula = 2020 AND t.name IN ('Microsoft', 'Controles', 'Xbox'))
ON CONFLICT DO NOTHING;