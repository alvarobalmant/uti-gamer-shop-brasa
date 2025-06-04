
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Interface atualizada para incluir campos usados pelo BannerManager
export interface Banner {
  id: string;
<<<<<<< HEAD
  title?: string; // Tornar opcional, pois pode não existir
  subtitle?: string;
  image_url: string; // Imagem principal é obrigatória
  link_url?: string;
=======
  title?: string;
  subtitle?: string;
  image_url?: string;
  button_link?: string;
  button_text?: string;
  button_image_url?: string;
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  display_order: number;
  position: number;
  is_active: boolean;
  gradient: string;
  background_type?: string;
  created_at?: string;
  updated_at?: string;
  // Campos adicionais do BannerManager
  button_text?: string;
  button_link?: string;
  button_image_url?: string;
  gradient?: string; // Assumindo que é uma string de classe Tailwind
  background_type?: 'gradient' | 'image-only'; // Tipo de fundo
}

<<<<<<< HEAD
// Tipo para dados de entrada ao criar/atualizar banner
// Omitimos id, created_at, updated_at. Incluímos todos os outros campos.
export type BannerInput = Omit<Banner, 'id' | 'created_at' | 'updated_at'>;

// Mock data for offline mode (mantido para fallback)
const MOCK_BANNERS: Banner[] = [
  // ... (mock data mantido como estava) ...
  {
    id: '1',
    title: 'PlayStation 5 em Estoque!',
    subtitle: 'Garanta já o seu console da nova geração com frete grátis',
    image_url: '/lovable-uploads/banner-ps5.png',
    link_url: '/categoria/consoles/playstation',
    display_order: 1,
    is_active: true,
    button_text: 'Comprar Agora',
    button_link: '/produto/ps5',
    gradient: 'from-blue-600 via-purple-600 to-red-600',
    background_type: 'gradient',
  },
  {
    id: '2',
    title: 'Promoção de Jogos Xbox',
    subtitle: 'Até 40% de desconto em jogos selecionados - Oferta por tempo limitado!',
    image_url: '/lovable-uploads/banner-xbox-games.png',
    link_url: '/categoria/jogos/xbox',
    display_order: 2,
    is_active: true,
    button_text: 'Ver Ofertas',
    button_link: '/categoria/jogos/xbox?promocao=true',
    gradient: 'from-green-600 via-lime-500 to-yellow-400',
    background_type: 'gradient',
  },
   // ... (restante dos mocks podem ser adicionados se necessário) ...
];

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]); // Iniciar vazio
=======
export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all banners (for admin panel and initial load)
  const fetchBanners = useCallback(async (onlyActive = false) => {
    console.log(`[useBanners] Iniciando busca de banners. OnlyActive: ${onlyActive}`);
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      let query = supabase
=======
      console.log('[useBanners] Fetching banners from Supabase...');
      
      const { data, error: fetchError } = await supabase
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

<<<<<<< HEAD
      if (onlyActive) {
        console.log('[useBanners] Filtrando por is_active = true');
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;
      console.log('[useBanners] Resposta da busca:', { data, fetchError });

      if (fetchError) throw fetchError;

      // Garantir que display_order seja um número
      const processedData = (data || []).map(b => ({
        ...b,
        display_order: typeof b.display_order === 'number' ? b.display_order : parseInt(b.display_order || '1', 10) || 1,
      }));

      setBanners(processedData);
      console.log('[useBanners] Banners definidos no estado:', processedData.length);

=======
      console.log('[useBanners] Supabase response:', { data, error: fetchError });

      if (fetchError) {
        console.error('[useBanners] Supabase error:', fetchError);
        throw fetchError;
      }

      setBanners(data || []);
      console.log('[useBanners] Banners loaded successfully:', data?.length || 0);
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
    } catch (err: any) {
      console.error('[useBanners] Error fetching banners:', err);
      setError('Falha ao carregar banners.');
<<<<<<< HEAD
      setBanners(MOCK_BANNERS); // Usar mocks como fallback
      toast({ 
        title: 'Aviso',
        description: 'Usando banners locais devido a um problema de conexão.',
        variant: 'default'
      });
=======
      setBanners([]);
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
    } finally {
      setLoading(false);
      console.log('[useBanners] Busca finalizada. Loading: false.');
    }
  }, []);

  const addBanner = useCallback(async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('banners')
        .insert([bannerData])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Banner adicionado com sucesso.' 
      });

      await fetchBanners();
      return data;
    } catch (err: any) {
      console.error('Error adding banner:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao adicionar banner.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchBanners]);

  const updateBanner = useCallback(async (id: string, bannerData: Partial<Omit<Banner, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Banner atualizado com sucesso.' 
      });

      await fetchBanners();
      return data;
    } catch (err: any) {
      console.error('Error updating banner:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar banner.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchBanners]);

  const deleteBanner = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Banner removido com sucesso.' 
      });

      await fetchBanners();
    } catch (err: any) {
      console.error('Error deleting banner:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover banner.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchBanners]);

<<<<<<< HEAD
  // Add Banner function
  const addBanner = useCallback(async (bannerData: BannerInput) => {
    console.log('[useBanners] Adicionando novo banner:', bannerData);
    setLoading(true);
    setError(null);
    try {
      // Remover campos potencialmente nulos/undefined que não devem ir vazios
      const payload: Partial<BannerInput> = { ...bannerData };
      if (!payload.subtitle) delete payload.subtitle;
      if (!payload.link_url) delete payload.link_url;
      if (!payload.button_text) delete payload.button_text;
      if (!payload.button_link) delete payload.button_link;
      if (!payload.button_image_url) delete payload.button_image_url;
      if (!payload.gradient) delete payload.gradient;
      if (!payload.background_type) payload.background_type = 'gradient'; // Default

      const { data, error: insertError } = await supabase
        .from('banners')
        .insert(payload as any) // Usar 'as any' pode ser necessário se o tipo Supabase for estrito
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('[useBanners] Banner adicionado com sucesso:', data);
      await fetchBanners(); // Re-fetch all banners
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

  // Update Banner function
  const updateBanner = useCallback(async (id: string, bannerData: Partial<BannerInput>) => {
    console.log(`[useBanners] Atualizando banner ID: ${id}`, bannerData);
    setLoading(true);
    setError(null);
    try {
      // Remover campos que não devem ser enviados se vazios/undefined
      const payload: Partial<BannerInput> = { ...bannerData };
      // Não remover campos que podem ser intencionalmente definidos como vazios (ex: subtitle)
      // Apenas garantir que tipos corretos sejam enviados

      const { data, error: updateError } = await supabase
        .from('banners')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('[useBanners] Banner atualizado com sucesso:', data);
      await fetchBanners(); // Re-fetch all banners
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

  // Delete Banner function
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
      await fetchBanners(); // Re-fetch all banners
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

  // Initial fetch (fetch all for potential admin use)
=======
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  useEffect(() => {
    console.log('[useBanners] useEffect inicial: Chamando fetchBanners(false)');
    fetchBanners(false); // Fetch all initially
  }, [fetchBanners]);

<<<<<<< HEAD
  // Return all functions including CRUD
=======
>>>>>>> d9e7072385b2fd1de8d1c790dab60f58904b15df
  return { banners, loading, error, fetchBanners, addBanner, updateBanner, deleteBanner };
};
