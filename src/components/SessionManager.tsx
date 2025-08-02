import { useEffect } from 'react';
import { offlineTokenDetector } from '@/utils/offlineTokenDetector';
import { sessionMonitor } from '@/utils/sessionMonitor';
import { jwtErrorInterceptor } from '@/utils/jwtErrorInterceptor';
import SessionRecoveryToast from './ErrorMonitor/SessionRecoveryToast';

/**
 * SessionManager: Coordena todos os sistemas de monitoramento de sessão
 * - Detector de tokens expirados offline
 * - Monitor de saúde da sessão
 * - Interceptador de erros JWT
 * - Toast de recuperação de sessão
 */
const SessionManager: React.FC = () => {
  useEffect(() => {
    console.log('🔧 [SessionManager] Initializing comprehensive session management');
    
    // O offlineTokenDetector já é inicializado automaticamente no construtor
    // O sessionMonitor é inicializado no useAuth
    // O jwtErrorInterceptor é inicializado no useAuth
    
    // Log do status inicial
    const offlineStatus = offlineTokenDetector.getOfflineStatus();
    const sessionHealth = sessionMonitor.getHealth();
    
    console.log('📊 [SessionManager] Initial status:', {
      online: offlineStatus.isOnline,
      sessionHealthy: sessionHealth.isHealthy,
      interceptorActive: jwtErrorInterceptor.isActive()
    });

    return () => {
      console.log('🔧 [SessionManager] Session management cleanup');
      // Cleanup é feito pelos próprios componentes
    };
  }, []);

  return <SessionRecoveryToast />;
};

export default SessionManager;