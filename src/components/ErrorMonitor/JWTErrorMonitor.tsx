import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface JWTError {
  timestamp: Date;
  component: string;
  error: string;
  retryCount: number;
}

export const JWTErrorMonitor: React.FC = () => {
  const [errors, setErrors] = useState<JWTError[]>([]);
  const [showMonitor, setShowMonitor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Monitor for JWT-related errors in console
    const originalConsoleError = console.error;
    
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      
      // Check for JWT expiration patterns
      if (
        errorMessage.includes('jwt') && errorMessage.includes('expired') ||
        errorMessage.includes('token') && errorMessage.includes('expired') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('pgrst301') ||
        errorMessage.includes('[RetryAuth]')
      ) {
        const newError: JWTError = {
          timestamp: new Date(),
          component: extractComponentName(args),
          error: errorMessage,
          retryCount: extractRetryCount(errorMessage)
        };
        
        setErrors(prev => {
          const updated = [newError, ...prev].slice(0, 10); // Keep last 10 errors
          return updated;
        });
        
        setShowMonitor(true);
        
        // Show toast for persistent JWT issues
        if (newError.retryCount > 2) {
          toast({
            title: 'Problema de Conectividade',
            description: 'Alguns recursos podem estar instáveis. Tentando reconectar...',
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
      
      // Call original console.error
      originalConsoleError.apply(console, args);
    };

    // Restore original console.error on cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, [toast]);

  const extractComponentName = (args: any[]): string => {
    const errorString = args.join(' ');
    
    // Extract component names from common patterns
    if (errorString.includes('[useHomepageLayout]')) return 'Homepage Layout';
    if (errorString.includes('[useNavigationItems]')) return 'Navigation';
    if (errorString.includes('[useUTICoinsSettings]')) return 'UTI Coins';
    if (errorString.includes('[useProductSections]')) return 'Product Sections';
    if (errorString.includes('[useSpecialSections]')) return 'Special Sections';
    if (errorString.includes('[RetryAuth:')) {
      const match = errorString.match(/\[RetryAuth:([^\]]+)\]/);
      return match ? match[1] : 'Auth Retry';
    }
    
    return 'Unknown Component';
  };

  const extractRetryCount = (errorMessage: string): number => {
    const retryMatch = errorMessage.match(/Attempt (\d+)\/(\d+)/);
    return retryMatch ? parseInt(retryMatch[1]) : 0;
  };

  const clearErrors = () => {
    setErrors([]);
    setShowMonitor(false);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  // Only show if there are JWT errors and user is in development or has admin access
  if (!showMonitor || errors.length === 0) {
    return null;
  }

  const persistentErrors = errors.filter(error => error.retryCount > 2);
  const recentErrors = errors.filter(error => 
    Date.now() - error.timestamp.getTime() < 30000 // Last 30 seconds
  );

  // Only show for persistent issues
  if (persistentErrors.length === 0 && recentErrors.length < 3) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="bg-background/95 backdrop-blur">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="flex items-center justify-between">
          Problema de Conectividade
          <Button
            variant="ghost"
            size="sm"
            onClick={clearErrors}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p className="text-xs">
            Detectamos instabilidades na conexão. Alguns recursos podem estar 
            temporariamente indisponíveis.
          </p>
          
          {persistentErrors.length > 0 && (
            <div className="text-xs space-y-1">
              <p className="font-medium">Componentes afetados:</p>
              <ul className="ml-2 space-y-1">
                {[...new Set(persistentErrors.map(e => e.component))].map(component => (
                  <li key={component}>• {component}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshPage}
              className="text-xs h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Recarregar
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearErrors}
              className="text-xs h-7"
            >
              Ignorar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};