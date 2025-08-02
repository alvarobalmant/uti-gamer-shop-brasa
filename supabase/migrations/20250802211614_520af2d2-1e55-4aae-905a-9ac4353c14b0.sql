-- FASE 1: Correção dos problemas críticos de segurança

-- Corrigir funções sem search_path adequado
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Corrigir políticas RLS problemáticas
-- Remover políticas duplicadas e conflitantes na tabela profiles
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Manter apenas as políticas essenciais e corretas
-- As outras políticas já existentes estão corretas

-- Adicionar políticas RLS onde estão faltando
-- Verificar se há tabelas com RLS habilitado mas sem políticas