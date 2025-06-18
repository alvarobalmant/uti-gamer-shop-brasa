
-- 1. Tornar campos title, subtitle, button_text e button_link opcionais (permitir NULL)
ALTER TABLE public.banners 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN subtitle DROP NOT NULL,
ALTER COLUMN button_text DROP NOT NULL,
ALTER COLUMN button_link DROP NOT NULL;

-- 2. Adicionar colunas para suporte a banners responsivos
ALTER TABLE public.banners 
ADD COLUMN image_url_desktop text,
ADD COLUMN image_url_mobile text,
ADD COLUMN button_link_desktop text,
ADD COLUMN button_link_mobile text;

-- 3. Verificar e remover possíveis CHECK CONSTRAINTS que validem a presença dos campos
-- (Esta query irá falhar silenciosamente se não existir, o que é normal)
ALTER TABLE public.banners DROP CONSTRAINT IF EXISTS check_banner_content;
ALTER TABLE public.banners DROP CONSTRAINT IF EXISTS banners_content_check;
ALTER TABLE public.banners DROP CONSTRAINT IF EXISTS banners_required_fields;

-- 4. Adicionar comentários para documentar as novas colunas
COMMENT ON COLUMN public.banners.image_url_desktop IS 'URL da imagem otimizada para desktop';
COMMENT ON COLUMN public.banners.image_url_mobile IS 'URL da imagem otimizada para dispositivos móveis';
COMMENT ON COLUMN public.banners.button_link_desktop IS 'Link do botão para versão desktop (opcional)';
COMMENT ON COLUMN public.banners.button_link_mobile IS 'Link do botão para versão mobile (opcional)';

-- 5. Atualizar trigger de updated_at se existir
DROP TRIGGER IF EXISTS trigger_banners_updated_at ON public.banners;
CREATE TRIGGER trigger_banners_updated_at
    BEFORE UPDATE ON public.banners
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
