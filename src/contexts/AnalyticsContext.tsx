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
  trackCheckoutStart?: (cartItems: any[], totalValue: number) => void;
  trackWhatsAppClick?: (productId?: string, context?: string) => void;
  trackCheckoutAbandon?: (step: string, timeInCheckout: number, cartItems: any[], totalValue: number) => void;
  
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
  const {
    trackEvent: basicTrackEvent,
    trackPageView: basicTrackPageView,
    trackProductView: basicTrackProductView,
    trackAddToCart: basicTrackAddToCart,
    trackSearch: basicTrackSearch,
    flushEvents: basicFlushEvents
  } = useAnalyticsTracking();

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
      
      // Executar sistema básico
      await basicTrackEvent({
        event_type: eventType,
        event_data: data,
        product_id: data?.productId,
        page_url: data?.url
      });
      
      // Enterprise tracking específico
      if (eventType === 'page_view' && data?.url) {
        await enterpriseTrackPageView(data.url);
      } else if (eventType === 'product_view' && data?.productId) {
        await enterpriseTrackProductView(data.productId, data);
      } else if (eventType === 'add_to_cart' && data?.productId) {
        await enterpriseTrackAddToCart(data.productId, data?.quantity || 1, data?.price);
      } else if (eventType === 'purchase') {
        await enterpriseTrackPurchase(data);
      }
      
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

  // Função para rastrear início do checkout
  const trackCheckoutStart = async (cartItems: any[], totalValue: number) => {
    try {
      console.log(`🛍️ [ANALYTICS] User ${uniqueUserId}: Checkout start: ${totalValue}`);
      await trackEvent('checkout_start', { cartItems, totalValue });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout start:`, error);
    }
  };

  // Função para rastrear clique no WhatsApp
  const trackWhatsAppClick = async (productId?: string, context?: string) => {
    try {
      console.log(`📱 [ANALYTICS] User ${uniqueUserId}: WhatsApp click: ${productId || 'general'}`);
      await trackEvent('whatsapp_click', { productId, context });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking WhatsApp click:`, error);
    }
  };

  // Função para rastrear abandono do checkout
  const trackCheckoutAbandon = async (step: string, timeInCheckout: number, cartItems: any[], totalValue: number) => {
    try {
      console.log(`⚠️ [ANALYTICS] User ${uniqueUserId}: Checkout abandon: ${step}`);
      await trackEvent('checkout_abandon', { step, timeInCheckout, cartItems, totalValue });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout abandon:`, error);
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

