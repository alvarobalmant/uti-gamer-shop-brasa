
-- 1. Criar a tabela pages primeiro
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  theme JSONB,
  layout TEXT DEFAULT 'standard',
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  header_style TEXT DEFAULT 'default',
  footer_style TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Criar a tabela page_sections
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  config JSONB,
  background_color TEXT,
  padding TEXT,
  margin TEXT,
  full_width BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar a tabela news_articles
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  excerpt TEXT,
  image_url TEXT,
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_time TEXT,
  tags TEXT[],
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Criar índices para otimizar performance
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_is_active ON public.pages(is_active);

CREATE INDEX idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX idx_page_sections_type ON public.page_sections(type);
CREATE INDEX idx_page_sections_display_order ON public.page_sections(display_order);
CREATE INDEX idx_page_sections_is_visible ON public.page_sections(is_visible);

CREATE INDEX idx_news_articles_category ON public.news_articles(category);
CREATE INDEX idx_news_articles_publish_date ON public.news_articles(publish_date);
CREATE INDEX idx_news_articles_tags ON public.news_articles USING GIN(tags);

-- 5. Adicionar triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- 6. Habilitar RLS nas novas tabelas
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas RLS básicas (permitir leitura para todos, escrita apenas para admins)
CREATE POLICY "Allow public read access to pages" ON public.pages
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to pages" ON public.pages
  FOR ALL USING (public.is_admin());

CREATE POLICY "Allow public read access to page_sections" ON public.page_sections
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to page_sections" ON public.page_sections
  FOR ALL USING (public.is_admin());

CREATE POLICY "Allow public read access to news_articles" ON public.news_articles
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to news_articles" ON public.news_articles
  FOR ALL USING (public.is_admin());

-- 8. Inserir dados de exemplo para as páginas de plataforma existentes
INSERT INTO public.pages (title, slug, description, is_active, theme) VALUES
('Xbox', 'xbox', 'Página dedicada aos produtos Xbox', true, '{"primaryColor": "#107C10", "secondaryColor": "#3A3A3A"}'),
('PlayStation', 'playstation', 'Página dedicada aos produtos PlayStation', true, '{"primaryColor": "#003791", "secondaryColor": "#FFFFFF"}'),
('Nintendo', 'nintendo', 'Página dedicada aos produtos Nintendo', true, '{"primaryColor": "#E60012", "secondaryColor": "#0066CC"}');
