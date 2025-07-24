import React from 'react';
import { useUTICoinsSettings } from '@/hooks/useUTICoinsSettings';

interface UTICoinsConditionalProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const UTICoinsConditional: React.FC<UTICoinsConditionalProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { isEnabled, loading } = useUTICoinsSettings();

  // Não renderizar nada durante o carregamento
  if (loading) {
    return null;
  }

  // Só renderizar o children se o sistema estiver habilitado
  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};