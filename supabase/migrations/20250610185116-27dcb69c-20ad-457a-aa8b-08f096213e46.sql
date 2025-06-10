
-- Create the page_layout_items table
CREATE TABLE public.page_layout_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  title TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  section_type TEXT NOT NULL,
  section_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_page_layout_items_page_id ON public.page_layout_items(page_id);
CREATE INDEX idx_page_layout_items_display_order ON public.page_layout_items(display_order);
CREATE INDEX idx_page_layout_items_section_type ON public.page_layout_items(section_type);
CREATE INDEX idx_page_layout_items_is_visible ON public.page_layout_items(is_visible);

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_page_layout_items_updated_at
  BEFORE UPDATE ON public.page_layout_items
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Enable RLS
ALTER TABLE public.page_layout_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access and admin write access
CREATE POLICY "Allow public read access to page_layout_items" ON public.page_layout_items
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to page_layout_items" ON public.page_layout_items
  FOR ALL USING (public.is_admin());

-- Add some example layout items for the existing pages
INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config) 
SELECT 
  p.id,
  'hero_banner',
  'Banner Principal',
  1,
  true,
  'banner',
  jsonb_build_object(
    'title', p.title || ' - Jogos e Acessórios',
    'subtitle', 'Descubra os melhores produtos para ' || p.title,
    'imageUrl', '/banners/' || p.slug || '-banner.jpg',
    'ctaText', 'Ver Produtos',
    'ctaLink', '/' || p.slug || '/produtos'
  )
FROM public.pages p
WHERE p.slug IN ('xbox', 'playstation', 'nintendo');

INSERT INTO public.page_layout_items (page_id, section_key, title, display_order, is_visible, section_type, section_config)
SELECT 
  p.id,
  'featured_products',
  'Produtos em Destaque',
  2,
  true,
  'featured',
  jsonb_build_object(
    'filter', jsonb_build_object(
      'tagIds', ARRAY[lower(p.title)],
      'limit', 8
    )
  )
FROM public.pages p
WHERE p.slug IN ('xbox', 'playstation', 'nintendo');
