
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductSection {
  id: string;
  title: string;
  view_all_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProductSections = () => {
  const [productSections, setProductSections] = useState<ProductSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProductSections(data || []);
    } catch (err: any) {
      console.error('Error fetching product sections:', err);
      setError('Falha ao carregar seções de produtos.');
      setProductSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductSectionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err: any) {
      console.error(`Error fetching product section with ID ${id}:`, err);
      setError(`Falha ao carregar seção de produtos com ID ${id}.`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductSections();
  }, [fetchProductSections]);

  return { productSections, loading, error, fetchProductSections, fetchProductSectionById };
};
