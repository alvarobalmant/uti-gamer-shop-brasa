
-- Adicionar coluna description (TEXTO LONGO)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar coluna specifications (JSONB)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Adicionar coluna images (TEXT Array)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Exemplo de dados para teste (Xbox Series X) - usando WHERE com subquery para limitar
UPDATE products SET 
  description = E'Experience the best value in gaming with Xbox Series X – 1TB Digital Edition. Enjoy thousands of games across four generations of Xbox, with faster loading, improved frame rates, and richer, more dynamic worlds. \n\n**Principais Características:**\n- **Velocidade:** Carregamento ultrarrápido com SSD NVMe personalizado.\n- **Gráficos:** Ray tracing acelerado por hardware para visuais incríveis.\n- **Compatibilidade:** Jogue milhares de títulos de quatro gerações de Xbox.\n- **Som:** Áudio espacial 3D imersivo.\n- **Design:** Compacto e elegante, ideal para qualquer setup de jogos.',
  specifications = '[
    {"label": "Armazenamento", "value": "1TB SSD"},
    {"label": "Resolução", "value": "4K Ultra HD"},
    {"label": "Processador", "value": "AMD Zen 2 (8 Cores, 3.8 GHz)"},
    {"label": "Memória RAM", "value": "16GB GDDR6"},
    {"label": "Conectividade", "value": "Wi-Fi 6, Bluetooth 5.1, HDMI 2.1"},
    {"label": "Dimensões (AxLxP)", "value": "30.1 cm x 15.1 cm x 15.1 cm"},
    {"label": "Peso", "value": "4.45 kg"},
    {"label": "Garantia", "value": "12 meses pelo fabricante"}
  ]'::jsonb,
  images = ARRAY[
    'https://i.imgur.com/example1.jpg',
    'https://i.imgur.com/example2.jpg',
    'https://i.imgur.com/example3.jpg',
    'https://i.imgur.com/example4.jpg'
  ]
WHERE id IN (
  SELECT id FROM products 
  WHERE (name ILIKE '%Xbox%' OR name ILIKE '%PlayStation%' OR name ILIKE '%Nintendo%')
  LIMIT 3
);
