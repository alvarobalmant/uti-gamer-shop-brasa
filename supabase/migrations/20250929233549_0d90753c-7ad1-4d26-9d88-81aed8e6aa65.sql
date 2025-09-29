-- Atualizar função complete_order_verification para usar preferência de UTI Coins

CREATE OR REPLACE FUNCTION public.complete_order_verification(p_code text, p_admin_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_record public.order_verification_codes%ROWTYPE;
  v_item JSONB;
  v_coin_amount INTEGER := 20; -- UTI coins padrão por compra
  v_cashback_amount INTEGER := 0; -- UTI coins de cashback
  v_total_cashback NUMERIC := 0; -- Total em reais de cashback
  v_session_id TEXT;
  v_user_agent TEXT;
  v_total_amount NUMERIC;
  v_product_cashback NUMERIC;
  v_product_discount NUMERIC; -- NOVO: Percentual máximo de desconto
  v_product_id UUID;
  v_item_total NUMERIC;
  v_product_exists BOOLEAN;
  
  -- Variáveis para desconto UTI Coins
  v_total_discount_amount NUMERIC := 0;
  v_total_coins_used INTEGER := 0;
  v_user_balance INTEGER := 0;
  v_item_discount_amount NUMERIC;
  v_item_coins_needed INTEGER;
  v_item_coins_used INTEGER;
  v_discount_result JSONB;
  
  -- NOVO: Variável para preferência do usuário
  v_use_coins BOOLEAN := false;
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Acesso negado');
  END IF;
  
  -- Buscar e bloquear código
  SELECT * INTO v_order_record 
  FROM public.order_verification_codes 
  WHERE code = p_code 
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Código não encontrado');
  END IF;
  
  -- Verificar se já foi processado
  IF v_order_record.status = 'completed' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Pedido já foi finalizado');
  END IF;
  
  -- Verificar se expirou
  IF NOW() > v_order_record.expires_at THEN
    UPDATE public.order_verification_codes 
    SET status = 'expired', updated_at = NOW()
    WHERE id = v_order_record.id;
    
    RETURN jsonb_build_object('success', false, 'message', 'Código expirado');
  END IF;
  
  -- NOVO: Obter preferência de UTI Coins
  v_use_coins := COALESCE(v_order_record.uti_coins_preference, false);
  
  -- Buscar saldo atual de UTI Coins do usuário APENAS se preferência for usar coins
  IF v_order_record.user_id IS NOT NULL AND v_use_coins THEN
    SELECT COALESCE(balance, 0) INTO v_user_balance
    FROM public.uti_coins
    WHERE user_id = v_order_record.user_id;
  END IF;
  
  -- CALCULAR DESCONTOS UTI COINS - SOMENTE se o cliente optou por usar
  IF v_use_coins AND v_user_balance > 0 THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_order_record.items)
    LOOP
      -- Extrair informações do item
      v_item_total := (v_item->>'total')::NUMERIC;
      
      -- Verificar se o item tem product_id
      IF v_item ? 'product_id' AND v_item->>'product_id' IS NOT NULL AND v_item->>'product_id' != '' THEN
        v_product_id := (v_item->>'product_id')::UUID;
        
        -- Buscar porcentagem de desconto do produto
        SELECT uti_coins_discount_percentage, TRUE 
        INTO v_product_discount, v_product_exists
        FROM public.products 
        WHERE id = v_product_id;
        
      ELSE
        -- Tentar buscar por nome do produto se não tiver ID
        v_product_exists := FALSE;
        v_product_discount := NULL;
        
        IF v_item ? 'product_name' AND v_item->>'product_name' IS NOT NULL THEN
          SELECT uti_coins_discount_percentage, TRUE 
          INTO v_product_discount, v_product_exists
          FROM public.products 
          WHERE name = v_item->>'product_name'
          LIMIT 1;
        END IF;
      END IF;
      
      -- Se o produto existe e tem desconto configurado E usuário tem saldo
      IF v_product_exists AND v_product_discount IS NOT NULL AND v_product_discount > 0 AND v_user_balance > 0 THEN
        -- Calcular desconto máximo permitido
        v_item_discount_amount := v_item_total * v_product_discount / 100;
        
        -- Calcular UTI Coins necessários para desconto máximo (100 coins = 1 real)
        v_item_coins_needed := ROUND(v_item_discount_amount * 100);
        
        -- Usar o que tem disponível (máximo disponível ou necessário)
        v_item_coins_used := LEAST(v_user_balance, v_item_coins_needed);
        
        -- Calcular desconto real baseado nas moedas usadas
        v_item_discount_amount := v_item_coins_used / 100.0;
        
        -- Acumular totais
        v_total_discount_amount := v_total_discount_amount + v_item_discount_amount;
        v_total_coins_used := v_total_coins_used + v_item_coins_used;
        
        -- Reduzir saldo disponível para próximos itens
        v_user_balance := v_user_balance - v_item_coins_used;
        
        -- Log para debug
        RAISE NOTICE 'DESCONTO aplicado - Item: %, Desconto: % reais, Coins usados: %', 
          v_item->>'product_name', v_item_discount_amount, v_item_coins_used;
      END IF;
    END LOOP;
  END IF;
  
  -- APLICAR DESCONTO UTI COINS se houver
  IF v_total_coins_used > 0 THEN
    SELECT * INTO v_discount_result
    FROM public.spend_coins_for_discount(
      v_order_record.user_id,
      v_total_coins_used,
      p_code,
      v_total_discount_amount
    );
    
    IF NOT (v_discount_result->>'success')::BOOLEAN THEN
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Erro ao aplicar desconto UTI Coins: ' || (v_discount_result->>'message')
      );
    END IF;
  END IF;
  
  -- CALCULAR CASHBACK EM UTI COINS (SOMENTE se NÃO usou coins para desconto)
  IF NOT v_use_coins THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_order_record.items)
    LOOP
      -- Extrair informações do item
      v_item_total := (v_item->>'total')::NUMERIC;
      
      -- Verificar se o item tem product_id
      IF v_item ? 'product_id' AND v_item->>'product_id' IS NOT NULL AND v_item->>'product_id' != '' THEN
        v_product_id := (v_item->>'product_id')::UUID;
        
        -- Buscar porcentagem de cashback do produto
        SELECT uti_coins_cashback_percentage, TRUE 
        INTO v_product_cashback, v_product_exists
        FROM public.products 
        WHERE id = v_product_id;
        
      ELSE
        -- Tentar buscar por nome do produto se não tiver ID
        v_product_exists := FALSE;
        v_product_cashback := NULL;
        
        IF v_item ? 'product_name' AND v_item->>'product_name' IS NOT NULL THEN
          SELECT uti_coins_cashback_percentage, TRUE 
          INTO v_product_cashback, v_product_exists
          FROM public.products 
          WHERE name = v_item->>'product_name'
          LIMIT 1;
        END IF;
      END IF;
      
      -- Se o produto existe e tem cashback configurado
      IF v_product_exists AND v_product_cashback IS NOT NULL AND v_product_cashback > 0 THEN
        -- Calcular cashback em reais: total do item * porcentagem
        v_total_cashback := v_total_cashback + (v_item_total * v_product_cashback / 100);
      END IF;
    END LOOP;
  END IF;
  
  -- Converter cashback de reais para UTI Coins (1 real = 100 UTI Coins)
  v_cashback_amount := ROUND(v_total_cashback * 100);
  
  -- Total de UTI Coins = padrão + cashback
  v_coin_amount := v_coin_amount + v_cashback_amount;
  
  -- ATUALIZAR REGISTRO COM INFORMAÇÕES DE DESCONTO
  UPDATE public.order_verification_codes 
  SET 
    status = 'completed',
    completed_at = NOW(),
    completed_by = p_admin_id,
    rewards_processed = true,
    uti_coins_used = v_total_coins_used,
    uti_coins_discount_amount = v_total_discount_amount,
    rewards_given = jsonb_build_object(
      'uti_coins', v_coin_amount,
      'default_coins', 20,
      'cashback_coins', v_cashback_amount,
      'cashback_reais', v_total_cashback,
      'discount_coins_used', v_total_coins_used,
      'discount_amount_reais', v_total_discount_amount,
      'used_uti_coins_preference', v_use_coins
    ),
    updated_at = NOW()
  WHERE id = v_order_record.id;
  
  -- Dar UTI coins ao usuário (se estiver logado)
  IF v_order_record.user_id IS NOT NULL THEN
    -- Dar coins padrão de compra
    PERFORM public.earn_coins(
      v_order_record.user_id,
      'purchase_completed',
      20,
      'Compra finalizada - Código: ' || p_code
    );
    
    -- Dar cashback em UTI Coins se houver (somente se não usou coins)
    IF v_cashback_amount > 0 AND NOT v_use_coins THEN
      PERFORM public.earn_coins(
        v_order_record.user_id,
        'cashback_purchase',
        v_cashback_amount,
        'Cashback da compra (' || v_product_cashback::TEXT || '% = R$ ' || v_total_cashback::TEXT || ') - Código: ' || p_code,
        jsonb_build_object(
          'cashback_reais', v_total_cashback,
          'cashback_coins', v_cashback_amount,
          'order_code', p_code
        )
      );
    END IF;
  END IF;
  
  -- Atualizar estoque dos produtos
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_order_record.items)
  LOOP
    IF v_item ? 'product_id' AND v_item->>'product_id' IS NOT NULL AND v_item->>'product_id' != '' THEN
      UPDATE public.products 
      SET stock = GREATEST(0, stock - (v_item->>'quantity')::INTEGER),
          updated_at = NOW()
      WHERE id = (v_item->>'product_id')::UUID;
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Pedido finalizado com sucesso',
    'coins_awarded', v_coin_amount,
    'default_coins', 20,
    'cashback_coins', v_cashback_amount,
    'cashback_reais', v_total_cashback,
    'discount_coins_used', v_total_coins_used,
    'discount_amount_reais', v_total_discount_amount,
    'used_uti_coins_preference', v_use_coins,
    'order_id', v_order_record.id
  );
END;
$$;