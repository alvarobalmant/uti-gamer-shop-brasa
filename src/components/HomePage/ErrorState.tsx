
import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
  error?: string;
  title?: string;
  showRetry?: boolean;
  autoRetry?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry, 
  message, 
  error, 
  title,
  showRetry = true,
  autoRetry = false
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [timeToRetry, setTimeToRetry] = useState(0);

  const displayMessage = message || error || "Erro ao carregar dados";
  const displayTitle = title || "Erro ao carregar a página";
  
  // Check if it's a connectivity/JWT error
  const isConnectivityError = displayMessage.includes('jwt') || 
                              displayMessage.includes('token') || 
                              displayMessage.includes('unauthorized') ||
                              displayMessage.includes('layout') ||
                              displayMessage.includes('navegação');

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto retry for connectivity issues
  useEffect(() => {
    if (autoRetry && isConnectivityError && retryCount < 3 && onRetry) {
      const retryDelay = Math.min(5000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
      setTimeToRetry(retryDelay / 1000);
      
      const countdown = setInterval(() => {
        setTimeToRetry(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleRetry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [autoRetry, isConnectivityError, retryCount, onRetry]);

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Alert variant={isConnectivityError ? "default" : "destructive"}>
          {isConnectivityError ? <Wifi className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertTitle className="flex items-center gap-2">
            {isConnectivityError ? "Problema de Conectividade" : displayTitle}
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>
              {isConnectivityError 
                ? "Estamos com dificuldades para carregar alguns recursos. Tentando reconectar..."
                : displayMessage
              }
            </p>
            
            {retryCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Tentativas: {retryCount}/3
              </p>
            )}
            
            {timeToRetry > 0 && (
              <p className="text-sm text-muted-foreground">
                Próxima tentativa em {timeToRetry}s...
              </p>
            )}
            
            <div className="flex gap-2 flex-wrap">
              {showRetry && onRetry && (
                <Button 
                  onClick={handleRetry}
                  disabled={isRetrying || timeToRetry > 0}
                  size="sm"
                  variant={isConnectivityError ? "default" : "destructive"}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Tentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={refreshPage}
                size="sm"
                variant="outline"
              >
                <Home className="h-4 w-4 mr-2" />
                Recarregar Página
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ErrorState;
