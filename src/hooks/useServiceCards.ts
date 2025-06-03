
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link_url?: string;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
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
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      setServiceCards(data || []);
    } catch (err: any) {
      console.error('Error fetching service cards:', err);
      setError('Falha ao carregar cartões de serviço.');
      setServiceCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addServiceCard = useCallback(async (cardData: Omit<ServiceCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('service_cards')
        .insert([{
          ...cardData,
          image_url: cardData.image_url || '',
          link_url: cardData.link_url || ''
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Card de serviço adicionado com sucesso.' 
      });

      await fetchServiceCards();
      return data;
    } catch (err: any) {
      console.error('Error adding service card:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao adicionar card de serviço.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchServiceCards]);

  const updateServiceCard = useCallback(async (id: string, cardData: Partial<Omit<ServiceCard, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('service_cards')
        .update(cardData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Card de serviço atualizado com sucesso.' 
      });

      await fetchServiceCards();
      return data;
    } catch (err: any) {
      console.error('Error updating service card:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao atualizar card de serviço.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchServiceCards]);

  const deleteServiceCard = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({ 
        title: 'Sucesso', 
        description: 'Card de serviço removido com sucesso.' 
      });

      await fetchServiceCards();
    } catch (err: any) {
      console.error('Error deleting service card:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover card de serviço.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchServiceCards]);

  useEffect(() => {
    fetchServiceCards();
  }, [fetchServiceCards]);

  return { 
    serviceCards, 
    loading, 
    error, 
    fetchServiceCards,
    addServiceCard,
    updateServiceCard,
    deleteServiceCard
  };
};
