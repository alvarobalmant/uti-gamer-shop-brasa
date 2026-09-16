CREATE OR REPLACE FUNCTION public.get_order_public_status(p_reference text)
 RETURNS TABLE(order_number text, status text, payment_status text, total_amount numeric, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT o.order_number, o.status, o.payment_status, o.total_amount, o.created_at
  FROM public.orders o
  WHERE p_reference IS NOT NULL
    AND length(p_reference) BETWEEN 20 AND 60
    AND p_reference ~ '^UTI-[A-Z0-9]{6,}-[A-Z0-9]{8}$'
    AND o.external_reference = p_reference
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.get_order_public_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_public_status(text) TO anon, authenticated, service_role;