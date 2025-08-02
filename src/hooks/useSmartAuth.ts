import { useState, useEffect, useCallback } from 'react';
import { smartTokenManager } from '@/utils/smartTokenManager';
import { useAuth } from '@/hooks/useAuth';

interface SmartAuthState {
  isCheckingToken: boolean;
  sessionExpired: boolean;
  expiredMessage: string;
  needsRefresh: boolean;
}

/**
 * Hook para gerenciamento inteligente de autenticação
 * - Verifica token na entrada do site
 * - Gerencia refresh automático
 * - Controla notificações de sessão expirada
 */
export const useSmartAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<SmartAuthState>({
    isCheckingToken: false,
    sessionExpired: false,
    expiredMessage: '',
    needsRefresh: false
  });

  // Função para verificar e gerenciar token na entrada
  const checkTokenOnEntry = useCallback(async () => {
    // Só verificar se há usuário logado
    if (!user || authLoading) {
      return;
    }

    setState(prev => ({ ...prev, isCheckingToken: true }));

    try {
      console.log('🔍 [SmartAuth] Verificando token na entrada...');
      
      const result = await smartTokenManager.checkAndRefreshOnEntry();

      if (result.needsLogout) {
        // Token expirado ou inválido - mostrar notificação e fazer logout
        console.warn('🚪 [SmartAuth] Logout necessário:', result.message);
        
        setState(prev => ({
          ...prev,
          sessionExpired: true,
          expiredMessage: result.message || 'Sua sessão expirou. Faça login novamente.',
          isCheckingToken: false
        }));

        // Executar logout limpo após um pequeno delay para mostrar a notificação
        setTimeout(async () => {
          await smartTokenManager.performCleanLogout('token-expired-on-entry');
        }, 1000);

      } else if (result.isValid) {
        // Token válido (pode ter sido renovado automaticamente)
        console.log('✅ [SmartAuth] Token válido');
        
        setState(prev => ({
          ...prev,
          sessionExpired: false,
          expiredMessage: '',
          isCheckingToken: false
        }));
      }

    } catch (error) {
      console.error('❌ [SmartAuth] Erro durante verificação:', error);
      
      setState(prev => ({
        ...prev,
        sessionExpired: true,
        expiredMessage: 'Erro inesperado. Faça login novamente.',
        isCheckingToken: false
      }));
    }
  }, [user, authLoading]);

  // Verificar token quando usuário faz login ou quando componente monta
  useEffect(() => {
    if (user && !authLoading) {
      // Pequeno delay para garantir que a autenticação está estabilizada
      const timer = setTimeout(() => {
        checkTokenOnEntry();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, authLoading, checkTokenOnEntry]);

  // Função para dispensar notificação de sessão expirada
  const dismissExpiredNotification = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionExpired: false,
      expiredMessage: ''
    }));
  }, []);

  // Função para forçar refresh manual
  const forceRefresh = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    setState(prev => ({ ...prev, needsRefresh: true }));

    try {
      const success = await smartTokenManager.forceRefresh();
      
      setState(prev => ({ ...prev, needsRefresh: false }));
      
      if (!success) {
        setState(prev => ({
          ...prev,
          sessionExpired: true,
          expiredMessage: 'Não foi possível renovar sua sessão. Faça login novamente.'
        }));
      }

      return success;
    } catch (error) {
      console.error('❌ [SmartAuth] Erro no refresh manual:', error);
      setState(prev => ({ ...prev, needsRefresh: false }));
      return false;
    }
  }, [user]);

  // Função para logout limpo manual
  const performCleanLogout = useCallback(async (reason?: string) => {
    await smartTokenManager.performCleanLogout(reason);
    setState({
      isCheckingToken: false,
      sessionExpired: false,
      expiredMessage: '',
      needsRefresh: false
    });
  }, []);

  return {
    // Estado
    isCheckingToken: state.isCheckingToken,
    sessionExpired: state.sessionExpired,
    expiredMessage: state.expiredMessage,
    needsRefresh: state.needsRefresh,
    isRefreshing: smartTokenManager.isCurrentlyRefreshing(),

    // Ações
    checkTokenOnEntry,
    dismissExpiredNotification,
    forceRefresh,
    performCleanLogout,

    // Estado derivado
    isLoading: authLoading || state.isCheckingToken || state.needsRefresh,
    shouldShowExpiredNotification: state.sessionExpired && !!state.expiredMessage
  };
};

