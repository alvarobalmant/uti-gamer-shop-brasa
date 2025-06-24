
-- Adicionar colunas para títulos bicolores na tabela product_sections
ALTER TABLE product_sections ADD COLUMN title_part1 TEXT;
ALTER TABLE product_sections ADD COLUMN title_part2 TEXT;
ALTER TABLE product_sections ADD COLUMN title_color1 TEXT DEFAULT '#000000';
ALTER TABLE product_sections ADD COLUMN title_color2 TEXT DEFAULT '#9ca3af';

-- Verificar se existe tabela special_sections e adicionar as mesmas colunas
-- (A tabela special_sections existe no schema, então vamos adicionar as colunas também)
ALTER TABLE special_sections ADD COLUMN title_part1 TEXT;
ALTER TABLE special_sections ADD COLUMN title_part2 TEXT;
ALTER TABLE special_sections ADD COLUMN title_color1 TEXT DEFAULT '#000000';
ALTER TABLE special_sections ADD COLUMN title_color2 TEXT DEFAULT '#9ca3af';
