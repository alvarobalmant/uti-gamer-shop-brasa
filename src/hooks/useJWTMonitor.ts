import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface JWTMonitorConfig {
  checkInterval: number; // em milissegundos
  renewThreshold: number; // em milissegundos (renovar quando restam X ms)
  enabled: boolean;
}

const DEFAULT_CONFIG: JWTMonitorConfig = {
  checkInterval: 60 * 1000, // verificar a cada 1 minuto
  renewThreshold: 5 * 60 * 1000, // renovar quando restam 5 minutos
  enabled: true
};

export const useJWTMonitor = (config: Partial<JWTMonitorConfig> = {}) => {
  const { user } = useAuth();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const checkAndRenewJWT = useCallback(async () => {
    if (!user || !finalConfig.enabled) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔐 [JWT-MONITOR] Erro ao verificar sessão:', error);
        return;
      }

      if (!session) {
        console.log('🔐 [JWT-MONITOR] Nenhuma sessão ativa');
        return;
      }

      const expiresAt = new Date(session.expires_at!).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      console.log(`🔐 [JWT-MONITOR] JWT expira em ${Math.round(timeUntilExpiry / 1000 / 60)} minutos`);

      // Se restam menos que o threshold, tentar renovar
      if (timeUntilExpiry < finalConfig.renewThreshold) {
        console.log('🔄 [JWT-MONITOR] JWT próximo de expirar - tentando renovar...');
        
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ [JWT-MONITOR] Falha na renovação:', refreshError);
          
          // Se a renovação falhar e restam menos de 1 minuto, é crítico
          if (timeUntilExpiry < 60 * 1000) {
            console.error('🚨 [JWT-MONITOR] JWT expirará em menos de 1 minuto e renovação falhou!');
            
            // Aqui poderíamos disparar um evento ou callback para logout automático
            // Mas vamos deixar o sistema de retry lidar com isso quando as operações falharem
          }
        } else {
          console.log('✅ [JWT-MONITOR] JWT renovado com sucesso');
          
          if (refreshData.session) {
            const newExpiresAt = new Date(refreshData.session.expires_at!).getTime();
            const newTimeUntilExpiry = newExpiresAt - Date.now();
            console.log(`🔐 [JWT-MONITOR] Novo JWT expira em ${Math.round(newTimeUntilExpiry / 1000 / 60)} minutos`);
          }
        }
      }
    } catch (error) {
      console.error('🔐 [JWT-MONITOR] Erro no monitoramento:', error);
    }
  }, [user, finalConfig]);

  useEffect(() => {
    if (!user || !finalConfig.enabled) {
      console.log('🔐 [JWT-MONITOR] Monitoramento desabilitado');
      return;
    }

    console.log('🔐 [JWT-MONITOR] Iniciando monitoramento de JWT');
    console.log(`🔐 [JWT-MONITOR] Configuração:`, {
      checkInterval: `${finalConfig.checkInterval / 1000}s`,
      renewThreshold: `${finalConfig.renewThreshold / 1000 / 60}min`,
      enabled: finalConfig.enabled
    });

    // Verificar imediatamente
    checkAndRenewJWT();

    // Configurar intervalo
    const interval = setInterval(checkAndRenewJWT, finalConfig.checkInterval);

    return () => {
      console.log('🔐 [JWT-MONITOR] Parando monitoramento de JWT');
      clearInterval(interval);
    };
  }, [user, checkAndRenewJWT, finalConfig]);

  // Função para verificação manual
  const manualCheck = useCallback(async () => {
    console.log('🔐 [JWT-MONITOR] Verificação manual solicitada');
    await checkAndRenewJWT();
  }, [checkAndRenewJWT]);

  // Função para obter status atual do JWT
  const getJWTStatus = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return {
          isValid: false,
          expiresAt: null,
          timeUntilExpiry: 0,
          needsRenewal: false
        };
      }

      const expiresAt = new Date(session.expires_at!);
      const timeUntilExpiry = expiresAt.getTime() - Date.now();
      const needsRenewal = timeUntilExpiry < finalConfig.renewThreshold;

      return {
        isValid: true,
        expiresAt,
        timeUntilExpiry,
        needsRenewal,
        expiresInMinutes: Math.round(timeUntilExpiry / 1000 / 60)
      };
    } catch (error) {
      console.error('🔐 [JWT-MONITOR] Erro ao obter status:', error);
      return {
        isValid: false,
        expiresAt: null,
        timeUntilExpiry: 0,
        needsRenewal: false,
        error: error as Error
      };
    }
  }, [finalConfig.renewThreshold]);

  return {
    manualCheck,
    getJWTStatus,
    config: finalConfig
  };
};

// Hook simplificado para uso básico
export const useBasicJWTMonitor = () => {
  return useJWTMonitor({
    checkInterval: 2 * 60 * 1000, // verificar a cada 2 minutos
    renewThreshold: 10 * 60 * 1000, // renovar quando restam 10 minutos
    enabled: true
  });
};

// Hook para desenvolvimento (mais frequente)
export const useDevJWTMonitor = () => {
  return useJWTMonitor({
    checkInterval: 30 * 1000, // verificar a cada 30 segundos
    renewThreshold: 15 * 60 * 1000, // renovar quando restam 15 minutos
    enabled: process.env.NODE_ENV === 'development'
  });
};

