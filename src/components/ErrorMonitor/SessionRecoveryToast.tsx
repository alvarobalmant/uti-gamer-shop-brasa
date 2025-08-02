import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, X, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  startSessionMonitoring, 
  stopSessionMonitoring, 
  isSessionValid 
} from '@/utils/sessionMonitor';
import { 
  setupJWTErrorInterceptor, 
  removeJWTErrorInterceptor 
} from '@/utils/jwtErrorInterceptor';
import { 
  startOfflineTokenDetection, 
  stopOfflineTokenDetection, 
  isTokenValid 
} from '@/utils/offlineTokenDetector';

// Toast-like component for session recovery notifications (stub implementation)
const SessionRecoveryToast: React.FC = () => {
  const [show, setShow] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    // Initialize stub monitoring
    startSessionMonitoring();
    setupJWTErrorInterceptor();
    startOfflineTokenDetection();

    return () => {
      stopSessionMonitoring();
      removeJWTErrorInterceptor();
      stopOfflineTokenDetection();
    };
  }, []);

  const handleManualRecovery = async () => {
    setRecovering(true);
    
    try {
      console.log('🔄 [SessionRecoveryToast] Manual recovery initiated (stub)');
      
      // Simulate recovery process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecovering(false);
      setShow(false);
      
    } catch (error) {
      console.error('❌ [SessionRecoveryToast] Manual recovery failed:', error);
      setRecovering(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  // Don't show toast in stub implementation
  if (!show) {
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
                Sessão em Manutenção
              </p>
              <p className="text-sm text-amber-700 mb-3">
                Sistema de autenticação sendo reconstruído.
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
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Validar
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
    </div>
  );
};

export default SessionRecoveryToast;