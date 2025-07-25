-- Habilitar RLS na tabela special_section_grid_layouts
ALTER TABLE public.special_section_grid_layouts ENABLE ROW LEVEL SECURITY;

-- Criar política para special_section_grid_layouts
CREATE POLICY "Public can view special section grid layouts" ON public.special_section_grid_layouts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage special section grid layouts" ON public.special_section_grid_layouts
  FOR ALL USING (is_admin());