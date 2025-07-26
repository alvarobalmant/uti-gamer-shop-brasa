-- Implementar RLS adequada na tabela admin_login_links
ALTER TABLE public.admin_login_links ENABLE ROW LEVEL SECURITY;

-- Política para permitir que apenas admins vejam links que criaram
CREATE POLICY "Admins can view their own links" 
ON public.admin_login_links 
FOR SELECT 
USING (auth.uid() = created_by AND public.is_admin());

-- Política para permitir que apenas admins criem links
CREATE POLICY "Admins can create links" 
ON public.admin_login_links 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND public.is_admin());

-- Política para permitir que apenas admins atualizem seus próprios links
CREATE POLICY "Admins can update their own links" 
ON public.admin_login_links 
FOR UPDATE 
USING (auth.uid() = created_by AND public.is_admin());

-- Criar função para criar links via edge function (mais segura)
CREATE OR REPLACE FUNCTION public.create_admin_link_secure(duration_minutes integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
  expires_at TIMESTAMP WITH TIME ZONE;
  link_id UUID;
BEGIN
  -- Verificar se é admin
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Acesso negado');
  END IF;
  
  -- Validar duração
  IF duration_minutes < 5 OR duration_minutes > 1440 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Duração deve ser entre 5 e 1440 minutos');
  END IF;
  
  -- Gerar token e calcular expiração
  token := public.generate_admin_token();
  expires_at := NOW() + (duration_minutes || ' minutes')::INTERVAL;
  
  -- Inserir o link
  INSERT INTO public.admin_login_links (token, created_by, expires_at)
  VALUES (token, auth.uid(), expires_at)
  RETURNING id INTO link_id;
  
  -- Retornar apenas informações necessárias (SEM o token completo)
  RETURN jsonb_build_object(
    'success', true,
    'link_id', link_id,
    'expires_at', expires_at,
    'message', 'Link criado com sucesso'
  );
END;
$$;