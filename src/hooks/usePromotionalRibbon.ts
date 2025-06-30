import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PromotionalRibbonConfig } from '@/types/promotionalRibbon';

export const usePromotionalRibbon = () => {
  const [desktopConfig, setDesktopConfig] = useState<PromotionalRibbonConfig | null>(null);
  const [mobileConfig, setMobileConfig] = useState<PromotionalRibbonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('promotional_ribbon_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const desktop = data.find(config => config.device_type === 'desktop');
        const mobile = data.find(config => config.device_type === 'mobile');
        
        setDesktopConfig(desktop as PromotionalRibbonConfig || null);
        setMobileConfig(mobile as PromotionalRibbonConfig || null);
      }
    } catch (error: any) {
      console.error('Error fetching promotional ribbon configs:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (config: Omit<PromotionalRibbonConfig, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('promotional_ribbon_config')
        .insert([config]);

      if (error) throw error;

      toast({
        title: "Configuração criada com sucesso!",
      });

      await fetchConfigs();
    } catch (error: any) {
      console.error('Error creating promotional ribbon config:', error);
      toast({
        title: "Erro ao criar configuração",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateConfig = async (id: string, updates: Partial<PromotionalRibbonConfig>) => {
    try {
      const { error } = await supabase
        .from('promotional_ribbon_config')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração atualizada com sucesso!",
      });

      await fetchConfigs();
    } catch (error: any) {
      console.error('Error updating promotional ribbon config:', error);
      toast({
        title: "Erro ao atualizar configuração",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotional_ribbon_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração removida com sucesso!",
      });

      await fetchConfigs();
    } catch (error: any) {
      console.error('Error deleting promotional ribbon config:', error);
      toast({
        title: "Erro ao remover configuração",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    desktopConfig,
    mobileConfig,
    loading,
    createConfig,
    updateConfig,
    deleteConfig,
    refetch: fetchConfigs,
  };
};
