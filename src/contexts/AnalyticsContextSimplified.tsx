import React, { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackEvent: (event: any, data?: any) => void;
  trackPageView: (title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity: number, price: number, productData?: any) => void;
  trackPurchase: (data: any) => void;
  trackCheckoutStart: () => void;
  trackWhatsAppClick: () => void;
  trackCheckoutAbandon: () => void;
  trackRemoveFromCart: () => void;
  trackSearch: () => void;
  flushEvents: () => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const contextValue: AnalyticsContextType = {
    trackEvent: () => {},
    trackPageView: () => {},
    trackProductView: () => {},
    trackAddToCart: () => {},
    trackPurchase: () => {},
    trackCheckoutStart: () => {},
    trackWhatsAppClick: () => {},
    trackCheckoutAbandon: () => {},
    trackRemoveFromCart: () => {},
    trackSearch: () => {},
    flushEvents: () => {},
    sessionId: 'simplified-session'
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};