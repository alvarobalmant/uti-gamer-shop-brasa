import { useEffect } from 'react';
import { 
  startOfflineTokenDetection, 
  stopOfflineTokenDetection 
} from '@/utils/offlineTokenDetector';
import { 
  startSessionMonitoring, 
  stopSessionMonitoring 
} from '@/utils/sessionMonitor';
import { 
  setupJWTErrorInterceptor, 
  removeJWTErrorInterceptor 
} from '@/utils/jwtErrorInterceptor';
import SessionRecoveryToast from './ErrorMonitor/SessionRecoveryToast';

/**
 * SessionManager: Coordena todos os sistemas de monitoramento de sessão (stub implementation)
 */
const SessionManager: React.FC = () => {
  useEffect(() => {
    console.log('🔧 [SessionManager] Initializing stub session management');
    
    // Initialize stub implementations
    startOfflineTokenDetection();
    startSessionMonitoring();
    setupJWTErrorInterceptor();
    
    console.log('📊 [SessionManager] Stub session management initialized');

    return () => {
      console.log('🔧 [SessionManager] Session management cleanup');
      stopOfflineTokenDetection();
      stopSessionMonitoring();
      removeJWTErrorInterceptor();
    };
  }, []);

  return <SessionRecoveryToast />;
};

export default SessionManager;