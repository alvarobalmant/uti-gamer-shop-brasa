import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon_url?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data for offline mode
const MOCK_SERVICE_CARDS: ServiceCard[] = [
  {
    id: '1',
    title: 'Manutenção de Consoles',
    description: 'Reparos especializados para PlayStation, Xbox e Nintendo. Diagnóstico gratuito e garantia de 3 meses.',
    icon_url: '/lovable-uploads/icon-repair.png',
    link_url: '/servicos/manutencao',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Instalação de Jogos',
    description: 'Instalação de jogos digitais e atualizações. Configuração de contas e perfis.',
    icon_url: '/lovable-uploads/icon-install.png',
    link_url: '/servicos/instalacao',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Limpeza e Manutenção Preventiva',
    description: 'Limpeza interna e externa, troca de pasta térmica e manutenção preventiva para prolongar a vida útil do seu console.',
    icon_url: '/lovable-uploads/icon-cleaning.png',
    link_url: '/servicos/limpeza',
    display_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: 'Avaliação e Compra de Usados',
    description: 'Avaliamos e compramos seus consoles, jogos e acessórios usados com os melhores preços do mercado.',
    icon_url: '/lovable-uploads/icon-trade.png',
    link_url: '/servicos/compra-usados',
    display_order: 4,
    is_active: true
  }
];

export const useServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(MOCK_SERVICE_CARDS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServiceCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('service_cards')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setServiceCards(data || []);
    } catch (err: any) {
      console.error('Error fetching service cards:', err);
      setError('Falha ao carregar cartões de serviço.');
      
      // Use mock service cards on error
      setServiceCards(MOCK_SERVICE_CARDS);
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando cartões de serviço locais devido a um problema de conexão.', 
        variant: 'default' 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchServiceCards();
  }, [fetchServiceCards]);

  return { serviceCards, loading, error, fetchServiceCards };
};
