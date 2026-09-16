ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS client_ip text,
  ADD COLUMN IF NOT EXISTS items_signature text;

CREATE INDEX IF NOT EXISTS orders_pending_lookup_idx
  ON public.orders (customer_email, items_signature, created_at DESC);

-- Atomic reservation at order creation: prevents overselling under concurrency.
CREATE OR REPLACE FUNCTION public.reserve_order_stock(p_order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_applied boolean;
  v_item record;
  v_updated integer;
BEGIN
  SELECT stock_applied INTO v_applied FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_applied IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'order_not_found');
  END IF;
  IF v_applied THEN
    RETURN jsonb_build_object('ok', true, 'already', true);
  END IF;

  -- Deterministic order avoids deadlocks between concurrent reservations.
  FOR v_item IN
    SELECT product_id, product_name, SUM(quantity)::int AS qty
    FROM public.order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
    GROUP BY product_id, product_name
    ORDER BY product_id
  LOOP
    UPDATE public.products
    SET stock = stock - v_item.qty
    WHERE id = v_item.product_id AND stock >= v_item.qty;

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    IF v_updated = 0 THEN
      -- Roll back the whole reservation.
      RAISE EXCEPTION 'insufficient_stock:%', v_item.product_name
        USING ERRCODE = 'check_violation';
    END IF;
  END LOOP;

  UPDATE public.orders SET stock_applied = true WHERE id = p_order_id;
  RETURN jsonb_build_object('ok', true);
EXCEPTION
  WHEN check_violation THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'insufficient_stock',
                              'detail', split_part(SQLERRM, 'insufficient_stock:', 2));
END;
$$;

-- Returns reserved units to stock when a payment never completes.
CREATE OR REPLACE FUNCTION public.release_order_stock(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_applied boolean;
BEGIN
  SELECT stock_applied INTO v_applied FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_applied IS NULL OR NOT v_applied THEN
    RETURN false;
  END IF;

  UPDATE public.products p
  SET stock = p.stock + agg.qty
  FROM (
    SELECT product_id, SUM(quantity)::int AS qty
    FROM public.order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
    GROUP BY product_id
  ) agg
  WHERE p.id = agg.product_id;

  UPDATE public.orders SET stock_applied = false WHERE id = p_order_id;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reserve_order_stock(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_order_stock(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_order_stock(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_order_stock(uuid) TO service_role;