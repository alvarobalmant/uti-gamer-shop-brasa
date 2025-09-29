-- Atualizar função create_order_verification_code para incluir preferência de UTI Coins

CREATE OR REPLACE FUNCTION public.create_order_verification_code(
  p_user_id UUID,
  p_items JSONB,
  p_total_amount NUMERIC,
  p_customer_info JSONB,
  p_browser_info JSONB,
  p_use_uti_coins BOOLEAN DEFAULT false
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
  v_id UUID;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Gerar código único
  v_code := generate_order_code();
  
  -- Definir expiração (24 horas)
  v_expires_at := NOW() + INTERVAL '24 hours';
  
  -- Inserir registro com preferência de UTI Coins
  INSERT INTO public.order_verification_codes (
    code,
    user_id,
    items,
    total_amount,
    customer_info,
    browser_info,
    expires_at,
    uti_coins_preference
  ) VALUES (
    v_code,
    p_user_id,
    p_items,
    p_total_amount,
    p_customer_info,
    p_browser_info,
    v_expires_at,
    p_use_uti_coins
  ) RETURNING id INTO v_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'id', v_id,
    'expires_at', v_expires_at,
    'use_uti_coins', p_use_uti_coins
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Erro ao criar código: ' || SQLERRM
    );
END;
$$;

-- Adicionar coluna para armazenar preferência de UTI Coins
ALTER TABLE public.order_verification_codes 
ADD COLUMN IF NOT EXISTS uti_coins_preference BOOLEAN DEFAULT false;