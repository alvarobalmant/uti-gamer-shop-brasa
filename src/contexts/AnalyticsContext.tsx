import React, { createContext, useContext } from 'react';

export interface AnalyticsContextType {
  trackEvent: (event: any) => void;
  trackPageView: (title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity: number, price: number, productData?: any) => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackPageView: () => {},
  trackProductView: () => {},
  trackAddToCart: () => {},
  sessionId: ''
});

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    trackEvent: () => {},
    trackPageView: () => {},
    trackProductView: () => {},
    trackAddToCart: () => {},
    sessionId: 'temp-session'
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);