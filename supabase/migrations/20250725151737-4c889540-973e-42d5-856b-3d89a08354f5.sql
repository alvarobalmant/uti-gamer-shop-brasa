-- Adicionar função para limpar contas não confirmadas ao criar nova conta com mesmo email
CREATE OR REPLACE FUNCTION public.cleanup_unconfirmed_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o novo usuário tem email confirmado, remover contas não confirmadas com mesmo email
  IF NEW.email_confirmed_at IS NOT NULL THEN
    DELETE FROM auth.users 
    WHERE email = NEW.email 
      AND email_confirmed_at IS NULL 
      AND id != NEW.id 
      AND created_at < NEW.created_at;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para limpar contas não confirmadas
DROP TRIGGER IF EXISTS cleanup_unconfirmed_on_user_update ON auth.users;
CREATE TRIGGER cleanup_unconfirmed_on_user_update
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_unconfirmed_accounts();

-- Adicionar função para verificar se email está confirmado
CREATE OR REPLACE FUNCTION public.is_email_confirmed()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL 
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar função handle_new_user para permitir login imediato
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Remover contas não confirmadas com mesmo email antes de criar nova
  DELETE FROM auth.users 
  WHERE email = NEW.email 
    AND email_confirmed_at IS NULL 
    AND id != NEW.id 
    AND created_at < NEW.created_at;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email,
    'cliente'
  );
  RETURN NEW;
END;
$$;

-- Atualizar políticas de coins para exigir email confirmado
DROP POLICY IF EXISTS "Users can view their own transactions" ON coin_transactions;
CREATE POLICY "Users can view their own transactions" ON coin_transactions
  FOR SELECT USING (
    auth.uid() = user_id AND public.is_email_confirmed()
  );

DROP POLICY IF EXISTS "Users can view their own actions" ON daily_actions;
CREATE POLICY "Users can view their own actions" ON daily_actions
  FOR SELECT USING (
    auth.uid() = user_id AND public.is_email_confirmed()
  );

-- Política para UTI coins exigir confirmação
DROP POLICY IF EXISTS "Users can view their own coins" ON uti_coins;
CREATE POLICY "Users can view their own coins" ON uti_coins
  FOR SELECT USING (
    auth.uid() = user_id AND public.is_email_confirmed()
  );

DROP POLICY IF EXISTS "Users can update their own coins" ON uti_coins;  
CREATE POLICY "Users can update their own coins" ON uti_coins
  FOR UPDATE USING (
    auth.uid() = user_id AND public.is_email_confirmed()
  );

DROP POLICY IF EXISTS "Users can insert their own coins" ON uti_coins;
CREATE POLICY "Users can insert their own coins" ON uti_coins
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.is_email_confirmed()
  );