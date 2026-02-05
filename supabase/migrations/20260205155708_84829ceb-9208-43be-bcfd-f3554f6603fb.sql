-- Inserir 9 produtos de teste na tabela integra_products
INSERT INTO integra_products (matricula, descricao, grupo, platform, foto, preco_venda, preco_promocao, saldo_atual, badge_text, badge_color, badge_visible, is_active, is_featured, category)
VALUES 
  (1001, 'God of War Ragnarök - PS5', 'Jogos', 'PS5', 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=400', 249.90, NULL, 15, 'LANÇAMENTO', '#ef4444', true, true, true, 'Jogos PS5'),
  (1002, 'Spider-Man 2 - PS5', 'Jogos', 'PS5', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400', 299.90, 229.90, 22, 'PROMOÇÃO', '#22c55e', true, true, true, 'Jogos PS5'),
  (1003, 'Halo Infinite - Xbox', 'Jogos', 'Xbox', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400', 179.90, NULL, 8, NULL, NULL, false, true, false, 'Jogos Xbox'),
  (1004, 'Forza Horizon 5 - Xbox', 'Jogos', 'Xbox', 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400', 199.90, NULL, 12, 'MAIS VENDIDO', '#3b82f6', true, true, true, 'Jogos Xbox'),
  (1005, 'Zelda: Tears of the Kingdom', 'Jogos', 'Switch', 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400', 349.90, NULL, 20, 'EXCLUSIVO', '#eab308', true, true, true, 'Jogos Switch'),
  (1006, 'Mario Kart 8 Deluxe - Switch', 'Jogos', 'Switch', 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400', 279.90, NULL, 25, NULL, NULL, false, true, false, 'Jogos Switch'),
  (1007, 'DualSense Controller - PS5', 'Acessórios', 'PS5', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', 449.90, NULL, 30, 'ORIGINAL', '#8b5cf6', true, true, false, 'Acessórios'),
  (1008, 'Xbox Elite Controller Series 2', 'Acessórios', 'Xbox', 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400', 899.90, 749.90, 5, 'PREMIUM', '#f59e0b', true, true, true, 'Acessórios'),
  (1009, 'Cyberpunk 2077 - PC', 'Jogos', 'PC', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', 149.90, NULL, 0, 'ESGOTADO', '#6b7280', true, true, false, 'Jogos PC')
ON CONFLICT (matricula) DO UPDATE SET
  descricao = EXCLUDED.descricao,
  grupo = EXCLUDED.grupo,
  platform = EXCLUDED.platform,
  foto = EXCLUDED.foto,
  preco_venda = EXCLUDED.preco_venda,
  preco_promocao = EXCLUDED.preco_promocao,
  saldo_atual = EXCLUDED.saldo_atual,
  badge_text = EXCLUDED.badge_text,
  badge_color = EXCLUDED.badge_color,
  badge_visible = EXCLUDED.badge_visible,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  category = EXCLUDED.category,
  updated_at = now();