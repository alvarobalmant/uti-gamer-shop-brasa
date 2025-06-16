
-- REVERTER: Alterações de Segurança que Causaram Problemas no Admin

-- 1. Remover a tabela de auditoria de segurança que está causando problemas
DROP TABLE IF EXISTS public.security_audit_log CASCADE;

-- 2. Reverter a função de log de segurança para uma versão não-bloqueante
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT auth.uid(),
  details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Função vazia para não bloquear operações
  -- Log apenas no servidor sem afetar o fluxo
  RAISE LOG 'Security Event: % for user: %', event_type, user_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Silencioso para não interromper operações
    NULL;
END;
$$;

-- 3. Limpar produtos duplicados e dados de teste Xbox se necessário
-- (Manter apenas se não causarem problemas)

-- 4. Verificar se as políticas RLS nas tabelas principais estão funcionando
-- Recriar políticas básicas se necessário

-- Para produtos - garantir acesso público para leitura
DROP POLICY IF EXISTS "products_public_read_policy" ON public.products;
DROP POLICY IF EXISTS "products_admin_full_policy" ON public.products;

CREATE POLICY "products_public_read_policy"
  ON public.products
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "products_admin_full_policy"
  ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Para profiles - garantir acesso do usuário ao próprio perfil
DROP POLICY IF EXISTS "profiles_user_read_own_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_user_update_own_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_full_policy" ON public.profiles;

CREATE POLICY "profiles_user_read_own_policy"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_user_update_own_policy"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_admin_full_policy"
  ON public.profiles
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Garantir que a função is_admin() está funcionando corretamente
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 6. Verificar se existe pelo menos um usuário admin
-- Se não existir, vamos criar um perfil admin para o usuário existente
DO $$
BEGIN
  -- Se não há nenhum admin, promover o primeiro usuário encontrado
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = (
      SELECT id FROM public.profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END $$;
