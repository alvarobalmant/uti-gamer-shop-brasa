-- Add page scoping to product and special sections for Prime Pages inline creation

-- 1) Add page_id to product_sections (nullable), index, and FK to prime_pages
ALTER TABLE IF EXISTS public.product_sections
  ADD COLUMN IF NOT EXISTS page_id uuid NULL;

CREATE INDEX IF NOT EXISTS idx_product_sections_page_id
  ON public.product_sections(page_id);

DO $$
BEGIN
  -- Add FK only if prime_pages table exists and constraint doesn't already exist
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'prime_pages'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'public' AND table_name = 'product_sections' AND constraint_name = 'product_sections_page_id_fk'
    ) THEN
      ALTER TABLE public.product_sections
        ADD CONSTRAINT product_sections_page_id_fk
        FOREIGN KEY (page_id)
        REFERENCES public.prime_pages(id)
        ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

-- 2) Add page_id to special_sections (nullable), index, and FK to prime_pages
ALTER TABLE IF EXISTS public.special_sections
  ADD COLUMN IF NOT EXISTS page_id uuid NULL;

CREATE INDEX IF NOT EXISTS idx_special_sections_page_id
  ON public.special_sections(page_id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'prime_pages'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE table_schema = 'public' AND table_name = 'special_sections' AND constraint_name = 'special_sections_page_id_fk'
    ) THEN
      ALTER TABLE public.special_sections
        ADD CONSTRAINT special_sections_page_id_fk
        FOREIGN KEY (page_id)
        REFERENCES public.prime_pages(id)
        ON DELETE CASCADE;
    END IF;
  END IF;
END$$;
