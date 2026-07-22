
-- Helper: is_admin (security definer, avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = _user_id AND role = 'admin'
  );
$$;

-- 1. products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  short_description text,
  sku text,
  barcode text,
  price numeric NOT NULL DEFAULT 0,
  promotional_price numeric,
  cost_price numeric,
  stock integer NOT NULL DEFAULT 0,
  image text,
  additional_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text,
  platform text,
  brand text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  badge_text text,
  badge_color text,
  badge_visible boolean NOT NULL DEFAULT false,
  uti_pro_enabled boolean NOT NULL DEFAULT false,
  uti_pro_price numeric,
  uti_coins_cashback_percentage integer NOT NULL DEFAULT 0,
  uti_coins_discount_percentage integer NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Migrate data
INSERT INTO public.products (
  id, name, slug, description, sku, barcode,
  price, promotional_price, cost_price, stock, image,
  category, platform, is_active, is_featured,
  badge_text, badge_color, badge_visible,
  uti_pro_price, uti_coins_cashback_percentage, uti_coins_discount_percentage,
  created_at, updated_at
)
SELECT
  id, descricao,
  COALESCE(slug, 'produto-' || id::text),
  descricao, referencia, codigo_barra,
  COALESCE(preco_venda, 0), preco_promocao, preco_custo,
  COALESCE(saldo_atual, 0)::integer, foto,
  COALESCE(category, grupo), platform,
  COALESCE(is_active, true) AND COALESCE(suspensa, 'N') <> 'S',
  COALESCE(is_featured, false),
  badge_text, badge_color, COALESCE(badge_visible, false),
  uti_pro_price,
  COALESCE(uti_coins_cashback_percentage, 0),
  COALESCE(uti_coins_discount_percentage, 0),
  COALESCE(created_at, now()), COALESCE(updated_at, now())
FROM public.integra_products;

-- 3. product_tags
CREATE TABLE public.product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.integra_tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, tag_id)
);

GRANT SELECT ON public.product_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_tags TO authenticated;
GRANT ALL ON public.product_tags TO service_role;

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product tags"
  ON public.product_tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage product tags"
  ON public.product_tags FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.product_tags (product_id, tag_id, created_at)
SELECT product_id, tag_id, COALESCE(created_at, now())
FROM public.integra_product_tags
WHERE product_id IS NOT NULL AND tag_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = integra_product_tags.product_id)
ON CONFLICT DO NOTHING;

-- 4. cart_items
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own cart"
  ON public.cart_items FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER cart_items_set_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.cart_items (id, user_id, product_id, quantity, created_at, updated_at)
SELECT id, user_id, product_id, COALESCE(quantity, 1),
       COALESCE(created_at, now()), COALESCE(updated_at, now())
FROM public.integra_cart_items
WHERE EXISTS (SELECT 1 FROM public.products p WHERE p.id = integra_cart_items.product_id);

-- 5. Drop legacy ERP tables
DROP TABLE IF EXISTS public.integra_cart_items CASCADE;
DROP TABLE IF EXISTS public.integra_product_tags CASCADE;
DROP TABLE IF EXISTS public.integra_sync_log CASCADE;
DROP TABLE IF EXISTS public.integra_sync_config CASCADE;
DROP TABLE IF EXISTS public.integra_products CASCADE;
