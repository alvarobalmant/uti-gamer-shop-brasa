
import { supabase } from '@/integrations/supabase/client';

// Hook separado para auditoria de segurança - não bloqueia autenticação
export const useSecurityAudit = () => {
  // Função para registrar eventos de segurança de forma assíncrona e não-bloqueante
  const logSecurityEvent = async (eventType: string, details: any = {}) => {
    // Executar em background sem bloquear o fluxo principal
    setTimeout(async () => {
      try {
        const { error } = await supabase.rpc('log_security_event', {
          event_type: eventType,
          details: {
            ...details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        });

        if (error) {
          // Log silencioso - não deve interromper a aplicação
          console.warn('Aviso: Erro ao registrar evento de segurança via RPC:', error);
        }
      } catch (error) {
        // Erro completamente silencioso para não afetar UX
        console.warn('Aviso: Sistema de auditoria indisponível:', error);
      }
    }, 0); // Executa no próximo tick do event loop
  };

  // Função para registrar eventos críticos (síncronos)
  const logCriticalSecurityEvent = async (eventType: string, details: any = {}) => {
    try {
      await supabase.rpc('log_security_event', {
        event_type: eventType,
        details: {
          ...details,
          critical: true,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      // Para eventos críticos, ainda logamos mas não bloqueamos
      console.error('Erro ao registrar evento crítico de segurança:', error);
    }
  };

  return {
    logSecurityEvent,
    logCriticalSecurityEvent
  };
};
