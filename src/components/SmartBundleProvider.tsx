/**
 * Smart Bundle Provider - Coordinates intelligent loading across the app
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useProgressiveLoader } from '@/hooks/useSmartBundleLoader';
import { logger } from '@/lib/productionLogger';

interface SmartBundleContextType {
  loadedFeatures: string[];
  preloadFeature: (feature: string) => void;
  isFeatureLoaded: (feature: string) => boolean;
}

const SmartBundleContext = createContext<SmartBundleContextType | null>(null);

export const useSmartBundleContext = () => {
  const context = useContext(SmartBundleContext);
  if (!context) {
    throw new Error('useSmartBundleContext must be used within SmartBundleProvider');
  }
  return context;
};

interface SmartBundleProviderProps {
  children: React.ReactNode;
}

export const SmartBundleProvider: React.FC<SmartBundleProviderProps> = ({ children }) => {
  const { loadedFeatures, preloadFeature, isFeatureLoaded } = useProgressiveLoader();

  useEffect(() => {
    logger.debug('SmartBundleProvider initialized', { loadedFeatures });
  }, [loadedFeatures]);

  const value: SmartBundleContextType = {
    loadedFeatures,
    preloadFeature,
    isFeatureLoaded,
  };

  return (
    <SmartBundleContext.Provider value={value}>
      {children}
    </SmartBundleContext.Provider>
  );
};