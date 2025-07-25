-- Corrigir função cleanup_unconfirmed_accounts com search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Corrigir função is_email_confirmed com search_path
CREATE OR REPLACE FUNCTION public.is_email_confirmed()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL 
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Habilitar RLS na tabela uti_coins se não existir
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'uti_coins' AND schemaname = 'public'
  ) THEN
    -- Criar tabela uti_coins se não existir
    CREATE TABLE public.uti_coins (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      balance integer NOT NULL DEFAULT 0,
      total_earned integer NOT NULL DEFAULT 0,
      total_spent integer NOT NULL DEFAULT 0,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      UNIQUE(user_id)
    );
    
    -- Habilitar RLS
    ALTER TABLE public.uti_coins ENABLE ROW LEVEL SECURITY;
  ELSE
    -- Se tabela existe, apenas garantir que RLS está habilitado
    ALTER TABLE public.uti_coins ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;