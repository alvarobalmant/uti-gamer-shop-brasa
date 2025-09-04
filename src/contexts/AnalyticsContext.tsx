/**
 * ANALYTICS CONTEXT - VERSÃO MULTI-USUÁRIO
 * Integra sistema básico + enterprise multi-usuário
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { useEnterpriseTrackingMultiUser } from '@/hooks/useEnterpriseTrackingMultiUser';

interface AnalyticsContextType {
  // IDs únicos
  uniqueUserId: string;
  sessionId: string;
  
  // Funções de tracking
  trackEvent: (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => void;
  trackPageView: (url?: string, title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity: number, price: number) => void;
  trackSearch: (query: string, filters?: any, results?: any) => void;
  trackPurchase: (orderData: any) => void;
  trackCheckoutStart: (cartTotal: number, itemCount: number) => void;
  trackWhatsAppClick: (source: string) => void;
  trackCheckoutAbandon: (cartTotal: number, itemCount: number, reason: string) => void;
  trackRemoveFromCart: (productId: string, quantity: number, price: number) => void;
  
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
  const analyticsData = useAnalyticsTracking();
  const {
    trackEvent: basicTrackEvent,
    trackPageView: basicTrackPageView,
    trackProductView: basicTrackProductView,
    trackAddToCart: basicTrackAddToCart,
    trackSearch: basicTrackSearch,
    flushEvents: basicFlushEvents
  } = analyticsData;

  // Sistema enterprise multi-usuário
  const {
    uniqueUserId,
    sessionId,
    isTracking,
    trackPageView: enterpriseTrackPageView,
    trackProductView: enterpriseTrackProductView,
    trackAddToCart: enterpriseTrackAddToCart,
    trackPurchase: enterpriseTrackPurchase,
    updateRealtimeActivity
  } = useEnterpriseTrackingMultiUser();

  console.log('📊 [ANALYTICS CONTEXT] Initialized for user:', uniqueUserId);

  // Função híbrida para rastrear eventos
  const trackEvent = async (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => {
    try {
      console.log(`🎯 [ANALYTICS] User ${uniqueUserId}: Event ${eventType}`, data);
      
      // Executar ambos os sistemas em paralelo
      await Promise.all([
        basicTrackEvent({ event_type: eventType, event_data: data }),
        // Enterprise tracking específico
        eventType === 'page_view' && enterpriseTrackPageView(data?.url),
        eventType === 'product_view' && enterpriseTrackProductView(data?.productId, data),
        eventType === 'add_to_cart' && enterpriseTrackAddToCart(data?.productId, data?.quantity || 1, data?.price),
        eventType === 'purchase' && enterpriseTrackPurchase(data)
      ]);
      
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
      
      await Promise.all([
        basicTrackPageView(title),
        enterpriseTrackPageView(url)
      ]);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Page view tracked: ${pageUrl}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking page view:`, error);
    }
  };

  // Função híbrida para rastrear visualização de produto
  const trackProductView = async (productId: string, productData?: any) => {
    try {
      console.log(`🛍️ [ANALYTICS] User ${uniqueUserId}: Product view: ${productId}`);
      
      await Promise.all([
        basicTrackProductView(productId, productData),
        enterpriseTrackProductView(productId, productData)
      ]);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Product view tracked: ${productId}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking product view:`, error);
    }
  };

  // Função híbrida para rastrear adição ao carrinho
  const trackAddToCart = async (productId: string, quantity: number, price: number) => {
    try {
      console.log(`🛒 [ANALYTICS] User ${uniqueUserId}: Add to cart: ${productId} x${quantity}`);
      
      await Promise.all([
        basicTrackAddToCart(productId, quantity, price),
        enterpriseTrackAddToCart(productId, quantity, price)
      ]);
      
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Add to cart tracked: ${productId}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking add to cart:`, error);
    }
  };

  // Função para rastrear busca
  const trackSearch = async (query: string, filters?: any, results?: any) => {
    try {
      console.log(`🔍 [ANALYTICS] User ${uniqueUserId}: Search: ${query}`);
      await basicTrackSearch(query, filters, results);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Search tracked: ${query}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking search:`, error);
    }
  };

  // Função para rastrear compra
  const trackPurchase = async (orderData: any) => {
    try {
      console.log(`💳 [ANALYTICS] User ${uniqueUserId}: Purchase:`, orderData);
      await enterpriseTrackPurchase(orderData);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Purchase tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking purchase:`, error);
    }
  };

  // Função para flush de eventos
  const flushEvents = async () => {
    try {
      await Promise.all([
        basicFlushEvents(),
        updateRealtimeActivity()
      ]);
      console.log(`🔄 [ANALYTICS] User ${uniqueUserId}: Events flushed`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error flushing events:`, error);
    }
  };

  const trackCheckoutStart = (cartTotal: number, itemCount: number) => {
    trackEvent('checkout_start', { cartTotal, itemCount });
  };

  const trackWhatsAppClick = (source: string) => {
    trackEvent('whatsapp_click', { source });
  };

  const trackRemoveFromCart = (productId: string, quantity: number, price: number) => {
    trackEvent('remove_from_cart', { productId, quantity, price });
  };

  const trackCheckoutAbandon = (cartTotal: number, itemCount: number, reason: string) => {
    trackEvent('checkout_abandon', { cartTotal, itemCount, reason });
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
    trackCheckoutStart,
    trackWhatsAppClick,
    trackCheckoutAbandon,
    trackRemoveFromCart,
    flushEvents,
    isTracking,
    updateRealtimeActivity
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

