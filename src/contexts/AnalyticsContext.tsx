import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

export interface AnalyticsContextType {
  sessionId: string;
  trackEvent: (type: string, data?: any, productId?: string) => void;
  trackPageView: (page: string, title?: string) => void;
  trackProductView: (productId: string, productName?: string, productPrice?: number) => void;
  trackAddToCart: (productId: string, productName?: string, productPrice?: number, quantity?: number, additionalData?: any) => void;
  trackRemoveFromCart: (productId: string, productName?: string, productPrice?: number) => void;
  trackCheckoutStart: (cartValue: number, itemCount: number) => void;
  trackCheckoutAbandon: (cartValue: number, itemCount: number, step?: string) => void;
  trackPurchase: (orderValue: number, items: any[]) => void;
  trackWhatsAppClick: (context?: string, productId?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const analytics = useAnalyticsTracking();

  // Ativar tracking granular automaticamente
  useEffect(() => {
    console.log('🚀 Analytics: Ativando tracking granular enterprise');
    
    // Inicializar tracking granular
    analytics.initializeGranularTracking();
    
    // Ativar heartbeat
    analytics.startHeartbeat();
    
    return () => {
      // Cleanup quando componente desmonta
      analytics.stopHeartbeat();
    };
  }, [analytics]);

  // Track page views automatically
  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;
    
    console.log('📊 Analytics: Tracking page view', {
      path: pagePath,
      title: pageTitle,
      sessionId: analytics.sessionId
    });
    
    analytics.trackPageView(pagePath);
  }, [location, analytics]);

  const contextValue: AnalyticsContextType = {
    sessionId: analytics.sessionId,
    trackEvent: (type: string, data?: any, productId?: string) => {
      analytics.trackEvent({
        event_type: type,
        event_data: data,
        product_id: productId,
        page_url: location.pathname,
        referrer: document.referrer
      });
    },
    trackPageView: analytics.trackPageView,
    trackProductView: (productId: string, productName?: string, productPrice?: number) => {
      analytics.trackProductView(productId, { name: productName, price: productPrice });
    },
    trackAddToCart: (productId: string, productName?: string, productPrice?: number, quantity: number = 1, additionalData?: any) => {
      analytics.trackAddToCart(productId, quantity, productPrice || 0, { 
        name: productName, 
        ...additionalData 
      });
    },
    trackRemoveFromCart: (productId: string, productName?: string, productPrice?: number) => {
      analytics.trackRemoveFromCart(productId, 1, productPrice || 0);
    },
    trackCheckoutStart: (cartValue: number, itemCount: number) => {
      analytics.trackCheckoutStart([], cartValue);
    },
    trackCheckoutAbandon: (cartValue: number, itemCount: number, step?: string) => {
      analytics.trackCheckoutAbandon(step || 'unknown', 0, [], cartValue);
    },
    trackPurchase: (orderValue: number, items: any[]) => {
      analytics.trackPurchase('order-' + Date.now(), items, orderValue);
    },
    trackWhatsAppClick: analytics.trackWhatsAppClick,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};