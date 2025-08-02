import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, X, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { sessionMonitor } from '@/utils/sessionMonitor';
import { jwtErrorInterceptor } from '@/utils/jwtErrorInterceptor';
import { offlineTokenDetector } from '@/utils/offlineTokenDetector';

// Toast-like component for session recovery notifications
const SessionRecoveryToast: React.FC = () => {
  const [show, setShow] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [sessionHealth, setSessionHealth] = useState(sessionMonitor.getHealth());
  const [offlineStatus, setOfflineStatus] = useState(offlineTokenDetector.getOfflineStatus());

  useEffect(() => {
    // Check session health periodically
    const checkHealth = () => {
      const health = sessionMonitor.getHealth();
      const offline = offlineTokenDetector.getOfflineStatus();
      
      setSessionHealth(health);
      setOfflineStatus(offline);
      
      // Show toast if session needs attention
      const needsAttention = sessionMonitor.needsAttention();
      if (needsAttention && !show) {
        setShow(true);
      }
    };

    // Initial check
    checkHealth();

    // Check every 10 seconds
    const interval = setInterval(checkHealth, 10000);

    return () => clearInterval(interval);
  }, [show]);

  const handleManualRecovery = async () => {
    setRecovering(true);
    
    try {
      console.log('🔄 [SessionRecoveryToast] Manual recovery initiated');
      
      // Try offline token validation first
      const validationSuccess = await offlineTokenDetector.forceValidation();
      
      if (!validationSuccess) {
        console.log('🔄 [SessionRecoveryToast] Validation failed, reloading page');
        // Force a page reload to reset the entire application state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log('✅ [SessionRecoveryToast] Session validated successfully');
        setRecovering(false);
        setShow(false);
        sessionMonitor.resetMetrics();
      }
      
    } catch (error) {
      console.error('❌ [SessionRecoveryToast] Manual recovery failed:', error);
      // Fallback to page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionMonitor.resetMetrics();
  };

  // Helper functions for dynamic content
  const getToastTitle = (): string => {
    const reason = sessionMonitor.getAttentionReason();
    if (reason === 'ghost-state') {
      return 'Sessão Inválida Detectada';
    }
    if (offlineStatus.wasOffline) {
      return 'Sessão Expirou Offline';
    }
    return 'Problema de Sessão Detectado';
  };

  const getToastMessage = (): string => {
    const reason = sessionMonitor.getAttentionReason();
    if (reason === 'ghost-state') {
      return 'Você aparenta estar logado mas não tem permissões válidas.';
    }
    if (offlineStatus.wasOffline) {
      return `Sua sessão expirou enquanto você estava offline por ${Math.round(offlineStatus.offlineDuration / 60000)} minutos.`;
    }
    if (sessionHealth.consecutiveFailures >= 3) {
      return 'Múltiplas falhas de autenticação detectadas.';
    }
    return 'Sua sessão pode estar expirada ou com problemas.';
  };

  const getActionIcon = () => {
    if (offlineStatus.wasOffline) {
      return <WifiOff className="h-3 w-3 mr-1" />;
    }
    return <RefreshCw className="h-3 w-3 mr-1" />;
  };

  const getActionText = (): string => {
    if (offlineStatus.wasOffline) {
      return 'Validar Sessão';
    }
    return 'Recuperar Sessão';
  };

  if (!show || !sessionMonitor.needsAttention()) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-top-2">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800 shadow-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium mb-2">
                {getToastTitle()}
              </p>
              <p className="text-sm text-amber-700 mb-3">
                {getToastMessage()}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManualRecovery}
                  disabled={recovering}
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  {recovering ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      {getActionIcon()}
                      {getActionText()}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-amber-700 hover:bg-amber-100"
                >
                  Ignorar
                </Button>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-amber-700 hover:bg-amber-100 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {/* Session health details for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Falhas consecutivas: {sessionHealth.consecutiveFailures}</div>
          <div>Última verificação: {new Date(sessionHealth.lastChecked).toLocaleTimeString()}</div>
          <div>Interceptor ativo: {jwtErrorInterceptor.isActive() ? 'Sim' : 'Não'}</div>
          <div>Motivo: {sessionMonitor.getAttentionReason()}</div>
          <div>Online: {offlineStatus.isOnline ? 'Sim' : 'Não'}</div>
          {offlineStatus.wasOffline && (
            <div>Offline por: {Math.round(offlineStatus.offlineDuration / 1000)}s</div>
          )}
          {sessionHealth.expiresIn !== undefined && (
            <div>Token expira em: {Math.round(sessionHealth.expiresIn / 60)}min</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionRecoveryToast;