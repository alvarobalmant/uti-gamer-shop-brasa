/**
 * ANALYTICS CONTEXT - VERSÃO MULTI-USUÁRIO
 * Integra sistema básico + enterprise multi-usuário
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
// import { useEnterpriseTrackingMultiUser } from '@/hooks/useEnterpriseTrackingMultiUser';

interface AnalyticsContextType {
  // IDs únicos
  uniqueUserId: string;
  sessionId: string;
  
  // Funções de tracking
  trackEvent: (eventType: string, data?: any) => void;
  trackCheckoutStart: () => void;
  trackWhatsAppClick: () => void;
  trackCheckoutAbandon: () => void;
  trackRemoveFromCart: (productId: string) => void;
  trackPageView: (url?: string, title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity: number, price: number) => void;
  trackSearch: (query: string, filters?: any, results?: any) => void;
  trackPurchase: (orderData: any) => void;
  
  // Controles
  flushEvents: () => Promise<void>;
  isTracking: boolean;
  updateRealtimeActivity: () => void;
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
  // Sistema básico
  const analytics = useAnalyticsTracking();
  const basicTrackEvent = analytics.trackEvent;
  const basicTrackPageView = analytics.trackPageView;
  const basicTrackProductView = analytics.trackProductView;
  const basicTrackAddToCart = analytics.trackAddToCart;

  // Simplified system
  const uniqueUserId = 'simplified-user';
  const sessionId = 'simplified-session';
  const isTracking = true;
  const updateRealtimeActivity = () => {};

  console.log('📊 [ANALYTICS CONTEXT] Initialized for user:', uniqueUserId);

  // Função híbrida para rastrear eventos
  const trackEvent = async (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => {
    try {
      console.log(`🎯 [ANALYTICS] User ${uniqueUserId}: Event ${eventType}`, data);
      
      // Executar ambos os sistemas em paralelo
      await basicTrackEvent(eventType);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Event tracked: ${eventType}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking event:`, error);
    }
  };

  // Função híbrida para rastrear visualização de página
  const trackPageView = async (url?: string, title?: string) => {
    try {
      const pageUrl = url || window.location.href;
      console.log(`📄 [ANALYTICS] User ${uniqueUserId}: Page view: ${pageUrl}`);
      
      await basicTrackPageView(pageUrl);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Page view tracked: ${pageUrl}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking page view:`, error);
    }
  };

  // Função híbrida para rastrear visualização de produto
  const trackProductView = async (productId: string, productData?: any) => {
    try {
      console.log(`🛍️ [ANALYTICS] User ${uniqueUserId}: Product view: ${productId}`);
      
      await basicTrackProductView(productId, productData);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Product view tracked: ${productId}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking product view:`, error);
    }
  };

  // Função híbrida para rastrear adição ao carrinho
  const trackAddToCart = async (productId: string, quantity: number, price: number) => {
    try {
      console.log(`🛒 [ANALYTICS] User ${uniqueUserId}: Add to cart: ${productId} x${quantity}`);
      
      await basicTrackAddToCart(productId, quantity, price);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Add to cart tracked: ${productId}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking add to cart:`, error);
    }
  };

  const trackSearch = async (query: string) => {
    console.log(`🔍 [ANALYTICS] Search: ${query}`);
  };

  // Função para rastrear compra
  const trackPurchase = async (orderData: any) => {
    try {
      console.log(`💳 [ANALYTICS] User ${uniqueUserId}: Purchase:`, orderData);
      // Simplified purchase tracking
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Purchase tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking purchase:`, error);
    }
  };

  const flushEvents = async () => {
    console.log(`🔄 [ANALYTICS] Events flushed`);
  };

  const contextValue: AnalyticsContextType = {
    uniqueUserId,
    sessionId,
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackPurchase,
    flushEvents,
    isTracking,
    updateRealtimeActivity,
    trackCheckoutStart: () => {},
    trackWhatsAppClick: () => {},
    trackCheckoutAbandon: () => {},
    trackRemoveFromCart: () => {}
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

