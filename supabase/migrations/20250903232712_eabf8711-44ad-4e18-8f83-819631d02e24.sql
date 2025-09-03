-- Adicionar campos de UTI Coins aos produtos
ALTER TABLE products 
ADD COLUMN uti_coins_discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (uti_coins_discount_percentage >= 0 AND uti_coins_discount_percentage <= 100),
ADD COLUMN uti_coins_cashback_percentage DECIMAL(5,2) DEFAULT 0 CHECK (uti_coins_cashback_percentage >= 0 AND uti_coins_cashback_percentage <= 100);