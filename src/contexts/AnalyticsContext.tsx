/**
 * ANALYTICS CONTEXT - STUB VERSION
 * Sistema básico de analytics com stubs para evitar erros de build
 */

import React, { createContext, useContext, ReactNode } from 'react';

interface AnalyticsContextType {
  trackEvent: (event: string, data?: any) => void;
  trackPageView: (title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity?: number, price?: number, productData?: any) => void;
  trackRemoveFromCart: (productId: string) => void;
  trackPurchase: (transactionData: any) => void;
  trackCheckoutStart: (cartData: any) => void;
  trackWhatsAppClick: (context: string, productId?: string) => void;
  trackCheckoutAbandon: (step: string, cartData: any) => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
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
  const sessionId = 'stub-session-' + Date.now();

  const trackEvent = (event: string, data?: any) => {
    console.log('[Analytics] Event:', event, data);
  };

  const trackPageView = (title?: string) => {
    console.log('[Analytics] Page view:', window.location.pathname, title);
  };

  const trackProductView = (productId: string, productData?: any) => {
    console.log('[Analytics] Product view:', productId, productData);
  };

  const trackAddToCart = (productId: string, quantity?: number, price?: number, productData?: any) => {
    console.log('[Analytics] Add to cart:', productId, quantity, price, productData);
  };

  const trackRemoveFromCart = (productId: string) => {
    console.log('[Analytics] Remove from cart:', productId);
  };

  const trackPurchase = (transactionData: any) => {
    console.log('[Analytics] Purchase:', transactionData);
  };

  const trackCheckoutStart = (cartData: any) => {
    console.log('[Analytics] Checkout start:', cartData);
  };

  const trackWhatsAppClick = (context: string, productId?: string) => {
    console.log('[Analytics] WhatsApp click:', context, productId);
  };

  const trackCheckoutAbandon = (step: string, cartData: any) => {
    console.log('[Analytics] Checkout abandon:', step, cartData);
  };

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackPurchase,
    trackCheckoutStart,
    trackWhatsAppClick,
    trackCheckoutAbandon,
    sessionId
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};