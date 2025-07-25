-- Primeiro, vamos criar um trigger para limpar contas não confirmadas quando um novo usuário tentar se registrar
-- Criar função para limpar contas não confirmadas
CREATE OR REPLACE FUNCTION cleanup_unconfirmed_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Log da operação
  RAISE LOG 'Cleanup trigger fired for email: %', NEW.email;
  
  -- Se o novo usuário não tem email confirmado, deletar qualquer conta anterior não confirmada com o mesmo email
  IF NEW.email_confirmed_at IS NULL THEN
    -- Deletar usuários antigos não confirmados com o mesmo email (mas não o que está sendo inserido)
    DELETE FROM auth.users 
    WHERE email = NEW.email 
    AND email_confirmed_at IS NULL 
    AND id != NEW.id
    AND created_at < NEW.created_at;
    
    -- Log do resultado
    GET DIAGNOSTICS v_count = ROW_COUNT;
    IF v_count > 0 THEN
      RAISE LOG 'Deleted % unconfirmed accounts for email: %', v_count, NEW.email;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Em caso de erro, apenas loga mas não falha a operação
  RAISE LOG 'Error in cleanup_unconfirmed_accounts: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover o trigger existente se houver
DROP TRIGGER IF EXISTS trigger_cleanup_unconfirmed_accounts ON auth.users;

-- Criar o trigger
CREATE TRIGGER trigger_cleanup_unconfirmed_accounts
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_unconfirmed_accounts();

-- Atualizar a função is_email_confirmed para ser mais robusta
CREATE OR REPLACE FUNCTION is_email_confirmed()
RETURNS boolean AS $$
BEGIN
  -- Se não há usuário logado, retorna false
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verificar se o email está confirmado na tabela auth.users
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email_confirmed_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;