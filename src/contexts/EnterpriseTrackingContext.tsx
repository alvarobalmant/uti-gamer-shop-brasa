import React, { createContext, useContext } from 'react';
import { useEnterpriseTrackingTimeFixed } from '@/hooks/useEnterpriseTrackingTimeFixed';

interface EnterpriseTrackingContextType {
  sessionId: string;
  isTracking: boolean;
  trackEvent: (eventType: string, data?: any) => Promise<void> | void;
  trackPageView: () => Promise<void> | void;
  trackProductView: (productId: string, productData?: any) => Promise<void> | void;
  trackAddToCart: (productId: string, quantity: number, price: number) => Promise<void> | void;
  updateRealtimeActivity: () => Promise<void> | void;
  uniqueUserId?: string;
}

const EnterpriseTrackingContext = createContext<EnterpriseTrackingContextType | undefined>(undefined);

export const EnterpriseTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    sessionId,
    isTracking,
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    updateRealtimeActivity,
  } = useEnterpriseTrackingTimeFixed();

  const value: EnterpriseTrackingContextType = {
    sessionId,
    isTracking,
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    updateRealtimeActivity,
    uniqueUserId: sessionId,
  };

  return (
    <EnterpriseTrackingContext.Provider value={value}>
      {children}
    </EnterpriseTrackingContext.Provider>
  );
};

export const useEnterpriseTracking = () => {
  const ctx = useContext(EnterpriseTrackingContext);
  if (!ctx) throw new Error('useEnterpriseTracking must be used within EnterpriseTrackingProvider');
  return ctx;
};
