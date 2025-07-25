-- Criar tabela usuarios se não existir (para manter compatibilidade com código existente)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text,
  email text,
  status_assinatura text DEFAULT 'Inativo',
  data_expiracao timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Criar políticas para usuarios
CREATE POLICY "Admins can manage all usuarios" ON public.usuarios
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view their own usuario data" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own usuario data" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Sincronizar dados existentes do profiles para usuarios
INSERT INTO public.usuarios (id, nome, email, created_at)
SELECT id, name, email, created_at 
FROM public.profiles 
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  updated_at = now();

-- Criar trigger para manter sincronização
CREATE OR REPLACE FUNCTION public.sync_usuarios_with_profiles()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.usuarios (id, nome, email, created_at)
    VALUES (NEW.id, NEW.name, NEW.email, NEW.created_at)
    ON CONFLICT (id) DO UPDATE SET
      nome = EXCLUDED.nome,
      email = EXCLUDED.email,
      updated_at = now();
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.usuarios 
    SET nome = NEW.name, email = NEW.email, updated_at = now()
    WHERE id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.usuarios WHERE id = OLD.id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Criar triggers para sincronização
DROP TRIGGER IF EXISTS sync_usuarios_on_profiles_change ON public.profiles;
CREATE TRIGGER sync_usuarios_on_profiles_change
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_usuarios_with_profiles();