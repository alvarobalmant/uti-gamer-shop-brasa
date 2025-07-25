-- Corrigir tabela usuarios para permitir nome null
ALTER TABLE public.usuarios ALTER COLUMN nome DROP NOT NULL;

-- Sincronizar dados existentes do profiles para usuarios  
INSERT INTO public.usuarios (id, nome, email, created_at)
SELECT id, name, email, created_at 
FROM public.profiles 
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  updated_at = now();

-- Criar função para sincronização
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

-- Criar trigger para sincronização
DROP TRIGGER IF EXISTS sync_usuarios_on_profiles_change ON public.profiles;
CREATE TRIGGER sync_usuarios_on_profiles_change
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_usuarios_with_profiles();