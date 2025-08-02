import React from 'react';
import { useBasicJWTMonitor } from '@/hooks/useJWTMonitor';

// Componente para monitoramento de JWT
export const JWTMonitorWrapper: React.FC = () => {
  useBasicJWTMonitor();
  return null;
};

export default JWTMonitorWrapper;

