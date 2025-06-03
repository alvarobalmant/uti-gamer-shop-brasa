
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data for offline mode
const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'PlayStation 5 em Estoque!',
    subtitle: 'Garanta já o seu console da nova geração com frete grátis',
    image_url: '/lovable-uploads/banner-ps5.png',
    link_url: '/categoria/consoles/playstation',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Promoção de Jogos Xbox',
    subtitle: 'Até 40% de desconto em jogos selecionados - Oferta por tempo limitado!',
    image_url: '/lovable-uploads/banner-xbox-games.png',
    link_url: '/categoria/jogos/xbox',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Nintendo Switch OLED',
    subtitle: 'A melhor experiência portátil com tela vibrante e cores impressionantes',
    image_url: '/lovable-uploads/banner-switch-oled.png',
    link_url: '/categoria/consoles/nintendo',
    display_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: 'Colecionáveis em Destaque',
    subtitle: 'Figuras exclusivas dos seus personagens favoritos com 15% de desconto',
    image_url: '/lovable-uploads/banner-colecionaveis.png',
    link_url: '/categoria/colecionaveis',
    display_order: 4,
    is_active: true
  },
  {
    id: '5',
    title: 'Seja UTI PRO',
    subtitle: 'Assine agora e ganhe descontos exclusivos em todo o site',
    image_url: '/lovable-uploads/banner-uti-pro.png',
    link_url: '/uti-pro',
    display_order: 5,
    is_active: true
  },
  {
    id: '6',
    title: 'Serviços Especializados',
    subtitle: 'Manutenção de consoles com diagnóstico gratuito e garantia',
    image_url: '/lovable-uploads/banner-servicos.png',
    link_url: '/servicos',
    display_order: 6,
    is_active: true
  }
];

export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBanners = useCallback(async () => {
    console.log('[useBanners] 🚀 Iniciando busca de banners...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('[useBanners] 📡 Fazendo query para banners ativos...');
      const { data, error: fetchError } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      console.log('[useBanners] 📦 Resposta da query:', { data, error: fetchError, count: data?.length });

      if (fetchError) {
        console.error('[useBanners] ❌ Erro ao buscar banners:', fetchError);
        throw fetchError;
      }

      if (data && data.length > 0) {
        console.log('[useBanners] ✅ Banners carregados com sucesso:', data.length);
        setBanners(data);
      } else {
        console.log('[useBanners] ⚠️ Nenhum banner encontrado, usando mock data');
        setBanners(MOCK_BANNERS);
        
        toast({ 
          title: 'Aviso', 
          description: 'Usando banners padrão. Nenhum banner personalizado encontrado.', 
          variant: 'default' 
        });
      }
    } catch (err: any) {
      console.error('[useBanners] 💥 Erro ao carregar banners:', err);
      setError('Falha ao carregar banners.');
      
      // Use mock banners on error
      setBanners(MOCK_BANNERS);
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando banners locais devido a um problema de conexão.', 
        variant: 'default' 
      });
    } finally {
      console.log('[useBanners] 🏁 Finalizando busca de banners');
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    console.log('[useBanners] 🎬 Iniciando efeito de carregamento de banners');
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, fetchBanners };
};
