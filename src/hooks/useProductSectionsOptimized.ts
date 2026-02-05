// Optimized version using React Query pattern
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductSectionOptimized {
  id: string;
  title: string;
  title_part1?: string;
  title_part2?: string;
  title_color1?: string;
  title_color2?: string;
  view_all_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProductSectionsOptimized = () => {
  const [sections, setSections] = useState<ProductSectionOptimized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('product_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSections(data || []);
      setError(null);
    } catch (err) {
      console.error('[useProductSectionsOptimized] Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Return format compatible with React Query pattern
  return { 
    sections, 
    data: sections, // React Query compatibility
    loading, 
    isLoading: loading, // React Query compatibility
    error, 
    fetchSections 
  };
};