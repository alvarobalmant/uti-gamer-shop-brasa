import React, { createContext, useContext, ReactNode } from 'react';

export interface AnalyticsContextType {
  trackEvent: (event: any) => void;
  trackPageView: (title?: string) => void;
  trackProductView: (productId: string, productName?: string, price?: number) => void;
  trackAddToCart: (productId: string, quantity: number, price: number, productData?: any) => void;
  trackRemoveFromCart: (productId: string) => void;
  trackPurchase: (orderId: string, value: number) => void;
  trackClick: (elementId: string, elementText?: string, extra?: any) => void;
  trackCheckoutStart: () => void;
  trackWhatsAppClick: () => void;
  trackCheckoutAbandon: () => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const value: AnalyticsContextType = {
    trackEvent: () => {},
    trackPageView: () => {},
    trackProductView: () => {},
    trackAddToCart: () => {},
    trackRemoveFromCart: () => {},
    trackPurchase: () => {},
    trackClick: () => {},
    trackCheckoutStart: () => {},
    trackWhatsAppClick: () => {},
    trackCheckoutAbandon: () => {},
    sessionId: 'test-session'
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};