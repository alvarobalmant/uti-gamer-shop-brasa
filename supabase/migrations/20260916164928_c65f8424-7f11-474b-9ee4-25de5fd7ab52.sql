-- ORDERS
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text NOT NULL UNIQUE DEFAULT ('UTI-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  external_reference text NOT NULL UNIQUE,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  discount_total numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider text NOT NULL DEFAULT 'mercadopago',
  mercadopago_order_id text,
  mercadopago_payment_id text,
  checkout_url text,
  stock_applied boolean NOT NULL DEFAULT false,
  shipping_info jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_customer_id_idx ON public.orders (customer_id);
CREATE INDEX orders_mercadopago_order_id_idx ON public.orders (mercadopago_order_id);
CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);

GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.is_admin());

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);

GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (o.customer_id = auth.uid() OR public.is_admin())
  ));

-- PAYMENT EVENTS (idempotência de webhook)
CREATE TABLE public.payment_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL DEFAULT 'mercadopago',
  event_id text NOT NULL,
  event_type text,
  provider_order_id text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_events_unique_event UNIQUE (provider, event_id)
);

GRANT ALL ON public.payment_events TO service_role;

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment events"
  ON public.payment_events FOR SELECT TO authenticated
  USING (public.is_admin());

-- updated_at trigger
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- baixa de estoque atômica (usada apenas pelo webhook via service role)
CREATE OR REPLACE FUNCTION public.apply_order_stock(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_applied boolean;
BEGIN
  SELECT stock_applied INTO v_applied FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_applied IS NULL OR v_applied THEN
    RETURN false;
  END IF;

  UPDATE public.products p
  SET stock = GREATEST(0, p.stock - oi.quantity)
  FROM public.order_items oi
  WHERE oi.order_id = p_order_id AND oi.product_id = p.id;

  UPDATE public.orders SET stock_applied = true WHERE id = p_order_id;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_order_stock(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_order_stock(uuid) TO service_role;