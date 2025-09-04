-- Adicionar campos UTI Coins por produto na tabela products
ALTER TABLE public.products 
ADD COLUMN uti_coins_enabled boolean DEFAULT false,
ADD COLUMN uti_coins_rate numeric DEFAULT 0,
ADD COLUMN uti_coins_max_discount numeric DEFAULT 0,
ADD COLUMN uti_coins_cashback_rate numeric DEFAULT 0;

-- Adicionar campos para tracking UTI Coins nos pedidos
ALTER TABLE public.order_verification_codes
ADD COLUMN uti_coins_used integer DEFAULT 0,
ADD COLUMN uti_coins_discount_amount numeric DEFAULT 0,
ADD COLUMN uti_coins_details jsonb DEFAULT '{}';

-- Função para aplicar desconto UTI Coins por produto
CREATE OR REPLACE FUNCTION public.apply_product_uti_coins_discount(
  p_user_id uuid,
  p_product_id uuid,
  p_coins_to_spend integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_balance integer;
  v_product_config RECORD;
  v_max_discount numeric;
  v_discount_amount numeric;
  v_rate numeric;
BEGIN
  -- Verificar se usuário está logado
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Usuário não logado'
    );
  END IF;

  -- Verificar saldo do usuário
  SELECT balance INTO v_user_balance
  FROM uti_coins 
  WHERE user_id = p_user_id;
  
  IF v_user_balance IS NULL OR v_user_balance < p_coins_to_spend THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Saldo insuficiente de UTI Coins'
    );
  END IF;

  -- Buscar configurações do produto
  SELECT 
    uti_coins_enabled,
    uti_coins_rate,
    uti_coins_max_discount,
    price
  INTO v_product_config
  FROM products 
  WHERE id = p_product_id;

  -- Verificar se produto existe e tem UTI Coins habilitado
  IF NOT FOUND OR NOT v_product_config.uti_coins_enabled THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Produto não permite desconto com UTI Coins'
    );
  END IF;

  -- Calcular desconto
  v_rate := COALESCE(v_product_config.uti_coins_rate, 0);
  v_discount_amount := p_coins_to_spend * v_rate;
  v_max_discount := COALESCE(v_product_config.uti_coins_max_discount, 0);

  -- Aplicar limite máximo de desconto
  IF v_max_discount > 0 AND v_discount_amount > v_max_discount THEN
    v_discount_amount := v_max_discount;
  END IF;

  -- Não pode dar desconto maior que o preço do produto
  IF v_discount_amount > v_product_config.price THEN
    v_discount_amount := v_product_config.price;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'discount_amount', v_discount_amount,
    'coins_needed', CEIL(v_discount_amount / v_rate),
    'max_discount', v_max_discount,
    'rate', v_rate
  );
END;
$$;

-- Função para calcular cashback por produto
CREATE OR REPLACE FUNCTION public.calculate_product_cashback(
  p_product_id uuid,
  p_purchase_amount numeric
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cashback_rate numeric;
  v_cashback_amount integer;
BEGIN
  -- Buscar taxa de cashback do produto
  SELECT uti_coins_cashback_rate INTO v_cashback_rate
  FROM products 
  WHERE id = p_product_id;

  -- Se não encontrou o produto ou não tem cashback
  IF NOT FOUND OR v_cashback_rate IS NULL OR v_cashback_rate = 0 THEN
    RETURN jsonb_build_object(
      'success', true,
      'cashback_amount', 0,
      'cashback_rate', 0
    );
  END IF;

  -- Calcular cashback (valor da compra * taxa de cashback)
  v_cashback_amount := FLOOR(p_purchase_amount * v_cashback_rate);

  RETURN jsonb_build_object(
    'success', true,
    'cashback_amount', v_cashback_amount,
    'cashback_rate', v_cashback_rate
  );
END;
$$;

-- Expandir função complete_order_verification para processar UTI Coins por item
CREATE OR REPLACE FUNCTION public.process_uti_coins_order(
  p_code text,
  p_admin_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_record public.order_verification_codes%ROWTYPE;
  v_item JSONB;
  v_cashback_total integer := 0;
  v_cashback_result JSONB;
  v_discount_total numeric := 0;
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Acesso negado');
  END IF;
  
  -- Buscar pedido
  SELECT * INTO v_order_record 
  FROM public.order_verification_codes 
  WHERE code = p_code;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Código não encontrado');
  END IF;
  
  -- Se já foi processado, retornar erro
  IF v_order_record.status = 'completed' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Pedido já processado');
  END IF;

  -- Processar cashback para cada item (se usuário logado)
  IF v_order_record.user_id IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_order_record.items)
    LOOP
      -- Calcular cashback do item
      SELECT * INTO v_cashback_result 
      FROM calculate_product_cashback(
        (v_item->>'product_id')::UUID,
        (v_item->>'total')::NUMERIC
      );
      
      IF (v_cashback_result->>'success')::boolean THEN
        v_cashback_total := v_cashback_total + (v_cashback_result->>'cashback_amount')::integer;
      END IF;
    END LOOP;

    -- Debitar UTI Coins usados
    IF v_order_record.uti_coins_used > 0 THEN
      UPDATE uti_coins 
      SET 
        balance = balance - v_order_record.uti_coins_used,
        total_spent = total_spent + v_order_record.uti_coins_used,
        updated_at = now()
      WHERE user_id = v_order_record.user_id;
      
      -- Registrar transação de débito
      INSERT INTO coin_transactions (
        user_id, amount, type, reason, description, metadata
      ) VALUES (
        v_order_record.user_id,
        -v_order_record.uti_coins_used,
        'spent',
        'purchase_discount',
        'Desconto aplicado na compra - Código: ' || p_code,
        jsonb_build_object(
          'order_code', p_code,
          'discount_amount', v_order_record.uti_coins_discount_amount
        )
      );
    END IF;

    -- Creditar cashback
    IF v_cashback_total > 0 THEN
      UPDATE uti_coins 
      SET 
        balance = balance + v_cashback_total,
        total_earned = total_earned + v_cashback_total,
        updated_at = now()
      WHERE user_id = v_order_record.user_id;
      
      -- Registrar transação de cashback
      INSERT INTO coin_transactions (
        user_id, amount, type, reason, description, metadata
      ) VALUES (
        v_order_record.user_id,
        v_cashback_total,
        'earned',
        'purchase_cashback',
        'Cashback da compra - Código: ' || p_code,
        jsonb_build_object(
          'order_code', p_code,
          'cashback_details', v_order_record.uti_coins_details
        )
      );
    END IF;
  END IF;

  -- Marcar pedido como processado
  UPDATE public.order_verification_codes 
  SET 
    status = 'completed',
    completed_at = NOW(),
    completed_by = p_admin_id,
    updated_at = NOW()
  WHERE id = v_order_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Pedido processado com sucesso',
    'coins_debited', v_order_record.uti_coins_used,
    'discount_applied', v_order_record.uti_coins_discount_amount,
    'cashback_credited', v_cashback_total
  );
END;
$$;