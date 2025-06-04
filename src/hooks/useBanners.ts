
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  button_image_url?: string;
  gradient: string;
  background_type: 'gradient' | 'image-only';
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type BannerInput = Omit<Banner, 'id' | 'created_at' | 'updated_at'>;

const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'PlayStation 5 em Estoque!',
    subtitle: 'Garanta já o seu console da nova geração com frete grátis',
    image_url: '/lovable-uploads/banner-ps5.png',
    button_text: 'Comprar Agora',
    button_link: '/produto/ps5',
    gradient: 'from-blue-600 via-purple-600 to-red-600',
    background_type: 'gradient',
    display_order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'Promoção de Jogos Xbox',
    subtitle: 'Até 40% de desconto em jogos selecionados - Oferta por tempo limitado!',
    image_url: '/lovable-uploads/banner-xbox-games.png',
    button_text: 'Ver Ofertas',
    button_link: '/categoria/jogos/xbox?promocao=true',
    gradient: 'from-green-600 via-lime-500 to-yellow-400',
    background_type: 'gradient',
    display_order: 2,
    is_active: true,
  },
];

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBanners = useCallback(async (onlyActive = false) => {
    console.log(`[useBanners] Iniciando busca de banners. OnlyActive: ${onlyActive}`);
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (onlyActive) {
        console.log('[useBanners] Filtrando por is_active = true');
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;
      console.log('[useBanners] Resposta da busca:', { data, fetchError });

      if (fetchError) throw fetchError;

      const processedData = (data || []).map(b => ({
        ...b,
        display_order: typeof b.display_order === 'number' ? b.display_order : parseInt(b.display_order || '1', 10) || 1,
        background_type: (b.background_type === 'gradient' || b.background_type === 'image-only') ? b.background_type : 'gradient',
        gradient: b.gradient || 'from-red-600 via-red-600 to-red-700',
      })) as Banner[];

      setBanners(processedData);
      console.log('[useBanners] Banners definidos no estado:', processedData.length);

    } catch (err: any) {
      console.error('Error fetching banners:', err);
      setError('Falha ao carregar banners.');
      setBanners(MOCK_BANNERS);
      toast({ 
        title: 'Aviso',
        description: 'Usando banners locais devido a um problema de conexão.',
        variant: 'default'
      });
    } finally {
      setLoading(false);
      console.log('[useBanners] Busca finalizada. Loading: false.');
    }
  }, [toast]);

  const addBanner = useCallback(async (bannerData: BannerInput) => {
    console.log('[useBanners] Adicionando novo banner:', bannerData);
    setLoading(true);
    setError(null);
    try {
      const payload: Partial<BannerInput> = { ...bannerData };
      if (!payload.subtitle) delete payload.subtitle;
      if (!payload.image_url) delete payload.image_url;
      if (!payload.button_text) delete payload.button_text;
      if (!payload.button_link) delete payload.button_link;
      if (!payload.button_image_url) delete payload.button_image_url;
      if (!payload.gradient) payload.gradient = 'from-red-600 via-red-600 to-red-700';
      if (!payload.background_type) payload.background_type = 'gradient';

      const { data, error: insertError } = await supabase
        .from('banners')
        .insert(payload as any)
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('[useBanners] Banner adicionado com sucesso:', data);
      await fetchBanners();
      toast({ title: 'Sucesso', description: 'Banner adicionado com sucesso.' });
      return data;

    } catch (err: any) {
      console.error('Error adding banner:', err);
      setError('Falha ao adicionar banner.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível adicionar o banner.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBanners]);

  const updateBanner = useCallback(async (id: string, bannerData: Partial<BannerInput>) => {
    console.log(`[useBanners] Atualizando banner ID: ${id}`, bannerData);
    setLoading(true);
    setError(null);
    try {
      const payload: Partial<BannerInput> = { ...bannerData };

      const { data, error: updateError } = await supabase
        .from('banners')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('[useBanners] Banner atualizado com sucesso:', data);
      await fetchBanners();
      toast({ title: 'Sucesso', description: 'Banner atualizado com sucesso.' });
      return data;

    } catch (err: any) {
      console.error('Error updating banner:', err);
      setError('Falha ao atualizar banner.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível atualizar o banner.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBanners]);

  const deleteBanner = useCallback(async (id: string) => {
    console.log(`[useBanners] Deletando banner ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      console.log('[useBanners] Banner deletado com sucesso.');
      await fetchBanners();
      toast({ title: 'Sucesso', description: 'Banner excluído com sucesso.' });
      return true;

    } catch (err: any) {
      console.error('Error deleting banner:', err);
      setError('Falha ao excluir banner.');
      toast({ title: 'Erro', description: err.message || 'Não foi possível excluir o banner.', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBanners]);

  useEffect(() => {
    console.log('[useBanners] useEffect inicial: Chamando fetchBanners(false)');
    fetchBanners(false);
  }, [fetchBanners]);

  return { banners, loading, error, fetchBanners, addBanner, updateBanner, deleteBanner };
};
