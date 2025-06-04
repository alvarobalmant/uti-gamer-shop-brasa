
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  button_link?: string;
  button_text?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useBanners] Fetching banners from Supabase...');
      
      const { data, error: fetchError } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      console.log('[useBanners] Supabase response:', { data, error: fetchError });

      if (fetchError) {
        console.error('[useBanners] Supabase error:', fetchError);
        throw fetchError;
      }

      setBanners(data || []);
      console.log('[useBanners] Banners loaded successfully:', data?.length || 0);
    } catch (err: any) {
      console.error('[useBanners] Error fetching banners:', err);
      setError('Falha ao carregar banners.');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, fetchBanners };
};
