
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServiceCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (error) throw error;
      
      setServiceCards(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar service cards:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar cartões de serviço",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addServiceCard = async (serviceCardData: Omit<ServiceCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .insert([{
          title: serviceCardData.title,
          description: serviceCardData.description,
          image_url: serviceCardData.image_url,
          link_url: serviceCardData.link_url,
          position: serviceCardData.position,
          is_active: serviceCardData.is_active
        }])
        .select()
        .single();

      if (error) throw error;

      setServiceCards(prev => [...prev, data].sort((a, b) => a.position - b.position));
      toast({
        title: "Cartão de serviço adicionado com sucesso!",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao adicionar cartão de serviço",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateServiceCard = async (id: string, serviceCardData: Partial<ServiceCard>) => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .update(serviceCardData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServiceCards(prev => prev.map(card => 
        card.id === id ? { ...card, ...data } : card
      ).sort((a, b) => a.position - b.position));
      
      toast({
        title: "Cartão de serviço atualizado com sucesso!",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar cartão de serviço",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteServiceCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServiceCards(prev => prev.filter(card => card.id !== id));
      toast({
        title: "Cartão de serviço removido com sucesso!",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao remover cartão de serviço",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchServiceCards();
  }, []);

  return {
    serviceCards,
    loading,
    error,
    addServiceCard,
    updateServiceCard,
    deleteServiceCard,
    refetch: fetchServiceCards,
  };
};
