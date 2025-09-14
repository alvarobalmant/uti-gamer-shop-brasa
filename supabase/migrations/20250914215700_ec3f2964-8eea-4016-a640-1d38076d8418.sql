-- Add review status column to products table
ALTER TABLE public.products 
ADD COLUMN is_reviewed boolean DEFAULT false,
ADD COLUMN reviewed_at timestamp with time zone,
ADD COLUMN reviewed_by uuid REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_products_is_reviewed ON public.products(is_reviewed);

-- Add comment for documentation
COMMENT ON COLUMN public.products.is_reviewed IS 'Indicates if product has been reviewed in desktop manager';
COMMENT ON COLUMN public.products.reviewed_at IS 'Timestamp when product was marked as reviewed';
COMMENT ON COLUMN public.products.reviewed_by IS 'ID of admin user who marked product as reviewed';