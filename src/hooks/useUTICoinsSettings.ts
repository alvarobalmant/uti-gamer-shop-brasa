import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UTICoinsSettings {
  enabled: boolean;
}

export const useUTICoinsSettings = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'uti_pro_settings')
        .single();

      if (error) {
        console.warn('Erro ao carregar configurações UTI Coins:', error);
        setIsEnabled(false);
        return;
      }

      if (data?.setting_value) {
        const settings = data.setting_value as unknown as UTICoinsSettings;
        setIsEnabled(settings.enabled || false);
      } else {
        setIsEnabled(false);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações UTI Coins:', error);
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listener para mudanças em tempo real
    const channel = supabase
      .channel('uti_coins_settings')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_key=eq.uti_pro_settings'
        },
        (payload) => {
          if (payload.new?.setting_value) {
            const settings = payload.new.setting_value as unknown as UTICoinsSettings;
            setIsEnabled(settings.enabled || false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isEnabled,
    loading,
    refreshSettings: loadSettings
  };
};