import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { sessionMonitor } from '@/utils/sessionMonitor';
import { jwtErrorInterceptor } from '@/utils/jwtErrorInterceptor';

// Toast-like component for session recovery notifications
const SessionRecoveryToast: React.FC = () => {
  const [show, setShow] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [sessionHealth, setSessionHealth] = useState(sessionMonitor.getHealth());

  useEffect(() => {
    // Check session health periodically
    const checkHealth = () => {
      const health = sessionMonitor.getHealth();
      setSessionHealth(health);
      
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
      
      // Force a page reload to reset the entire application state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ [SessionRecoveryToast] Manual recovery failed:', error);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionMonitor.resetMetrics();
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
              <p className="font-medium mb-2">Problema de Sessão Detectado</p>
              <p className="text-sm text-amber-700 mb-3">
                {sessionHealth.consecutiveFailures >= 3
                  ? 'Múltiplas falhas de autenticação detectadas.'
                  : 'Sua sessão pode estar expirada ou com problemas.'}
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
                      Recuperando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Recuperar Sessão
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
          {sessionHealth.expiresIn !== undefined && (
            <div>Token expira em: {Math.round(sessionHealth.expiresIn / 60)}min</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionRecoveryToast;