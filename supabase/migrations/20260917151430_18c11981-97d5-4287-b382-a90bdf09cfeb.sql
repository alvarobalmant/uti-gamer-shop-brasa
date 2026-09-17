CREATE TABLE IF NOT EXISTS public.product_section_items (
  id bigint generated always as identity primary key,
  section_id text not null references public.product_sections(id) on delete cascade,
  item_type text not null default 'product',
  item_id text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

GRANT SELECT ON public.product_section_items TO anon;
GRANT SELECT ON public.product_section_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_section_items TO authenticated;
GRANT ALL ON public.product_section_items TO service_role;

ALTER TABLE public.product_section_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read section items"
  ON public.product_section_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert section items"
  ON public.product_section_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update section items"
  ON public.product_section_items FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete section items"
  ON public.product_section_items FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_product_section_items_section ON public.product_section_items(section_id, display_order);