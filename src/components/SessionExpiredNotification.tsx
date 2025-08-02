import React, { useEffect, useState } from 'react';
import { AlertCircle, LogIn, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SessionExpiredNotificationProps {
  show: boolean;
  message?: string;
  onDismiss?: () => void;
  onLoginRedirect?: () => void;
}

/**
 * Componente de notificação amigável para sessão expirada
 * - Linguagem simples e clara para o usuário
 * - Sem termos técnicos como "JWT" ou "token"
 * - Ações claras: fazer login ou dispensar
 */
const SessionExpiredNotification: React.FC<SessionExpiredNotificationProps> = ({
  show,
  message = 'Sua sessão expirou. Faça login novamente para continuar.',
  onDismiss,
  onLoginRedirect
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleLoginClick = () => {
    if (onLoginRedirect) {
      onLoginRedirect();
    } else {
      // Redirecionar para página de login
      navigate('/auth');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Sessão Expirada
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Continuar sem login
            </Button>
            <Button
              onClick={handleLoginClick}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredNotification;

