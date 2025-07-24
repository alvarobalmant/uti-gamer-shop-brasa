import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UTICoinsSettings {
  enabled: boolean;
}

// Cache global para evitar múltiplas requisições
let globalCache: { isEnabled: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 segundos

export const useUTICoinsSettings = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const loadSettings = async () => {
    // Verificar cache primeiro
    if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      setIsEnabled(globalCache.isEnabled);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'uti_coins_settings')
        .single();

      if (error) {
        console.warn('Erro ao carregar configurações UTI Coins:', error);
        setIsEnabled(false);
        return;
      }

      const newIsEnabled = (data?.setting_value as any)?.enabled || false;
      setIsEnabled(newIsEnabled);
      
      // Atualizar cache global
      globalCache = {
        isEnabled: newIsEnabled,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Erro ao carregar configurações UTI Coins:', error);
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Criar nome único para evitar conflitos de canal
    const channelName = `uti_coins_settings_${Math.random().toString(36).substring(7)}`;
    
    // Listener para mudanças em tempo real
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_key=eq.uti_coins_settings'
        },
        (payload) => {
          if (payload.new?.setting_value) {
            const newIsEnabled = (payload.new.setting_value as any)?.enabled || false;
            setIsEnabled(newIsEnabled);
            
            // Atualizar cache global
            globalCache = {
              isEnabled: newIsEnabled,
              timestamp: Date.now()
            };
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