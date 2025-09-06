-- Adicionar coluna de desconto UTI Coins na tabela de produtos
ALTER TABLE public.products 
ADD COLUMN uti_coins_discount_percentage NUMERIC(5,2) DEFAULT 0.00;

-- Adicionar colunas para rastrear uso de UTI Coins nos pedidos
ALTER TABLE public.order_verification_codes 
ADD COLUMN uti_coins_used INTEGER DEFAULT 0,
ADD COLUMN uti_coins_discount_amount NUMERIC(10,2) DEFAULT 0.00;

-- Função para debitar UTI Coins por desconto
CREATE OR REPLACE FUNCTION public.spend_coins_for_discount(
  p_user_id UUID,
  p_amount INTEGER,
  p_order_code TEXT,
  p_discount_amount NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  -- Verificar saldo atual
  SELECT COALESCE(balance, 0) INTO v_current_balance
  FROM public.uti_coins
  WHERE user_id = p_user_id;
  
  -- Verificar se tem saldo suficiente
  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Saldo insuficiente de UTI Coins',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;
  
  -- Criar transação de débito
  INSERT INTO public.coin_transactions (
    user_id, 
    amount, 
    type, 
    reason, 
    description,
    metadata
  ) VALUES (
    p_user_id,
    -p_amount, -- Negativo para débito
    'spent',
    'discount_purchase',
    'Desconto aplicado com UTI Coins - Pedido: ' || p_order_code,
    jsonb_build_object(
      'order_code', p_order_code,
      'discount_amount_reais', p_discount_amount,
      'coins_used', p_amount
    )
  );
  
  -- Atualizar saldo
  UPDATE public.uti_coins
  SET 
    balance = balance - p_amount,
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'coins_spent', p_amount,
    'discount_applied', p_discount_amount,
    'new_balance', v_current_balance - p_amount
  );
END;
$$;