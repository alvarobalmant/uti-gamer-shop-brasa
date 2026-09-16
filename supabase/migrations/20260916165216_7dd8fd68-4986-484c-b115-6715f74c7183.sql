CREATE OR REPLACE FUNCTION public.get_order_public_status(p_reference text)
RETURNS TABLE (
  order_number text,
  status text,
  payment_status text,
  total_amount numeric,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.order_number, o.status, o.payment_status, o.total_amount, o.created_at
  FROM public.orders o
  WHERE o.external_reference = p_reference
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_public_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_public_status(text) TO anon, authenticated;