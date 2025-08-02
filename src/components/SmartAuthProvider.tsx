import React from 'react';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import SessionExpiredNotification from './SessionExpiredNotification';

interface SmartAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que integra o sistema inteligente de autenticação
 * - Gerencia verificação automática de token
 * - Mostra notificações de sessão expirada
 * - Controla loading durante operações de token
 */
const SmartAuthProvider: React.FC<SmartAuthProviderProps> = ({ children }) => {
  const {
    isCheckingToken,
    sessionExpired,
    expiredMessage,
    shouldShowExpiredNotification,
    dismissExpiredNotification,
    performCleanLogout
  } = useSmartAuth();

  const handleLoginRedirect = async () => {
    // Fazer logout limpo antes de redirecionar
    await performCleanLogout('user-requested-login');
    // O redirecionamento será feito pelo componente SessionExpiredNotification
  };

  return (
    <>
      {children}
      
      {/* Loading overlay durante verificação de token */}
      {isCheckingToken && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-40">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-sm text-gray-600">Verificando sessão...</p>
          </div>
        </div>
      )}

      {/* Notificação de sessão expirada */}
      <SessionExpiredNotification
        show={shouldShowExpiredNotification}
        message={expiredMessage}
        onDismiss={dismissExpiredNotification}
        onLoginRedirect={handleLoginRedirect}
      />
    </>
  );
};

export default SmartAuthProvider;

