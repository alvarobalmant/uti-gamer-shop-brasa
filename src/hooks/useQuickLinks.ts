import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface QuickLink {
  id: string;
  title: string;
  icon_url?: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data for offline mode
const MOCK_QUICK_LINKS: QuickLink[] = [
  {
    id: '1',
    title: 'Consoles PS',
    icon_url: '/lovable-uploads/icon-playstation.png',
    link_url: '/categoria/consoles/playstation',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Consoles Xbox',
    icon_url: '/lovable-uploads/icon-xbox.png',
    link_url: '/categoria/consoles/xbox',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Consoles Nintendo',
    icon_url: '/lovable-uploads/icon-nintendo.png',
    link_url: '/categoria/consoles/nintendo',
    display_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: 'Jogos em Mídia Física',
    icon_url: '/lovable-uploads/icon-games.png',
    link_url: '/categoria/jogos',
    display_order: 4,
    is_active: true
  },
  {
    id: '5',
    title: 'Acessórios Gamer',
    icon_url: '/lovable-uploads/icon-accessories.png',
    link_url: '/categoria/acessorios',
    display_order: 5,
    is_active: true
  },
  {
    id: '6',
    title: 'Colecionáveis Raros',
    icon_url: '/lovable-uploads/icon-collectibles.png',
    link_url: '/categoria/colecionaveis',
    display_order: 6,
    is_active: true
  },
  {
    id: '7',
    title: 'Ofertas Imperdíveis',
    icon_url: '/lovable-uploads/icon-sales.png',
    link_url: '/ofertas',
    display_order: 7,
    is_active: true
  },
  {
    id: '8',
    title: 'Clube UTI PRO',
    icon_url: '/lovable-uploads/icon-utipro.png',
    link_url: '/uti-pro',
    display_order: 8,
    is_active: true
  },
  {
    id: '9',
    title: 'Serviços Técnicos',
    icon_url: '/lovable-uploads/icon-repair.png',
    link_url: '/servicos',
    display_order: 9,
    is_active: true
  }
];

export const useQuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(MOCK_QUICK_LINKS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuickLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('quick_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setQuickLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching quick links:', err);
      setError('Falha ao carregar links rápidos.');
      
      // Use mock quick links on error
      setQuickLinks(MOCK_QUICK_LINKS);
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando links rápidos locais devido a um problema de conexão.', 
        variant: 'default' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchQuickLinks();
  }, [fetchQuickLinks]);

  return { quickLinks, loading, error, fetchQuickLinks };
};
