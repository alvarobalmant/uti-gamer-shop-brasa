-- Associar produtos de teste às tags (integra_product_tags)

-- God of War Ragnarök - PS5 (Jogos, PS5, Ação, Aventura)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('80c94305-9ca0-4117-b860-9ea686389088', '3f6a2560-23b5-4239-9957-aee10c7e820e'), -- Jogos
('80c94305-9ca0-4117-b860-9ea686389088', 'e3992f40-80fd-4eb9-bd81-93c45bceb9db'), -- PS5
('80c94305-9ca0-4117-b860-9ea686389088', '28390a9e-80e7-4d48-b7d5-cddabf962ada'), -- Ação
('80c94305-9ca0-4117-b860-9ea686389088', '9e5e26ed-732b-466a-87b3-bf2ef4357e4e'); -- Aventura

-- Spider-Man 2 - PS5 (Jogos, PS5, Ação, Aventura) 
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('3d608e17-923e-4d3e-b8c3-44f2c4b74033', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('3d608e17-923e-4d3e-b8c3-44f2c4b74033', 'e3992f40-80fd-4eb9-bd81-93c45bceb9db'),
('3d608e17-923e-4d3e-b8c3-44f2c4b74033', '28390a9e-80e7-4d48-b7d5-cddabf962ada'),
('3d608e17-923e-4d3e-b8c3-44f2c4b74033', '9e5e26ed-732b-466a-87b3-bf2ef4357e4e');

-- Halo Infinite - Xbox (Jogos, Xbox Series X, FPS)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('ecff10a1-9d26-40de-a32e-db82a6905a92', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('ecff10a1-9d26-40de-a32e-db82a6905a92', '448e97ea-188e-4a07-95f6-a416d1dc9099'),
('ecff10a1-9d26-40de-a32e-db82a6905a92', '8879d935-f85d-4fbe-9654-8eba1a668a23');

-- Forza Horizon 5 - Xbox (Jogos, Xbox Series X, Corrida)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('8291989d-3729-4563-8802-fcc010de255b', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('8291989d-3729-4563-8802-fcc010de255b', '448e97ea-188e-4a07-95f6-a416d1dc9099'),
('8291989d-3729-4563-8802-fcc010de255b', 'cf9597a8-2024-41c7-b5af-4faa115db4c2');

-- Zelda: Tears of the Kingdom (Jogos, Nintendo Switch, Aventura, RPG)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('f7ce2e77-0e42-4754-be81-7be20045cc9c', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('f7ce2e77-0e42-4754-be81-7be20045cc9c', '872a74f3-f7d2-480d-97fd-60835a54e543'),
('f7ce2e77-0e42-4754-be81-7be20045cc9c', '9e5e26ed-732b-466a-87b3-bf2ef4357e4e'),
('f7ce2e77-0e42-4754-be81-7be20045cc9c', '9458fb33-91e5-4d02-b1b1-b541da66f3e8');

-- Mario Kart 8 Deluxe - Switch (Jogos, Nintendo Switch, Corrida)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('889cd80e-c247-48cb-a792-b7616c0ea335', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('889cd80e-c247-48cb-a792-b7616c0ea335', '872a74f3-f7d2-480d-97fd-60835a54e543'),
('889cd80e-c247-48cb-a792-b7616c0ea335', 'cf9597a8-2024-41c7-b5af-4faa115db4c2');

-- DualSense Controller - PS5 (Acessórios, PS5, Controles)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('7a1f24ad-8348-42fb-b2ca-c2d555557fe2', 'e183891a-743e-4ebd-ba76-4568e231a5a0'),
('7a1f24ad-8348-42fb-b2ca-c2d555557fe2', 'e3992f40-80fd-4eb9-bd81-93c45bceb9db'),
('7a1f24ad-8348-42fb-b2ca-c2d555557fe2', 'a41d99c5-7d0a-4175-9b87-2af214ab217c');

-- Xbox Elite Controller Series 2 (Acessórios, Xbox Series X, Controles)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('6b8da26e-ba7f-4ebb-a4e5-9cfd37645e4e', 'e183891a-743e-4ebd-ba76-4568e231a5a0'),
('6b8da26e-ba7f-4ebb-a4e5-9cfd37645e4e', '448e97ea-188e-4a07-95f6-a416d1dc9099'),
('6b8da26e-ba7f-4ebb-a4e5-9cfd37645e4e', 'a41d99c5-7d0a-4175-9b87-2af214ab217c');

-- Cyberpunk 2077 - PC (Jogos, PC, RPG, Ação)
INSERT INTO public.integra_product_tags (product_id, tag_id) VALUES
('5e7679ee-ce6c-4679-8530-3fec2139b70c', '3f6a2560-23b5-4239-9957-aee10c7e820e'),
('5e7679ee-ce6c-4679-8530-3fec2139b70c', 'bf0997c7-680e-497a-b47b-58b5fe805771'),
('5e7679ee-ce6c-4679-8530-3fec2139b70c', '9458fb33-91e5-4d02-b1b1-b541da66f3e8'),
('5e7679ee-ce6c-4679-8530-3fec2139b70c', '28390a9e-80e7-4d48-b7d5-cddabf962ada');

-- Marcar mais produtos como featured para aparecerem na seção "Produtos em Destaque"
UPDATE public.integra_products SET is_featured = true WHERE matricula IN (1003, 1006, 1009);