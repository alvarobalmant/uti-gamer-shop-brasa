/**
 * ANALYTICS CONTEXT - VERSÃO MULTI-USUÁRIO
 * Integra sistema básico + enterprise multi-usuário
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
import { useEnterpriseTracking } from '@/contexts/EnterpriseTrackingContext';

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
  trackCheckoutStart: (cartItems: any[], totalValue: number) => void;
  trackCheckoutAbandon: (step: string, timeInCheckout: number, cartItems: any[], totalValue: number) => void;
  trackWhatsAppClick: (productId?: string, context?: string) => void;
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
  const {
    trackEvent: basicTrackEvent,
    trackPageView: basicTrackPageView,
    trackProductView: basicTrackProductView,
    trackAddToCart: basicTrackAddToCart,
    trackCheckoutStart: basicTrackCheckoutStart,
    trackCheckoutAbandon: basicTrackCheckoutAbandon,
    trackWhatsAppClick: basicTrackWhatsAppClick,
    trackRemoveFromCart: basicTrackRemoveFromCart
  } = useAnalyticsTracking();

  // Sistema enterprise multi-usuário
  const {
    uniqueUserId,
    sessionId,
    isTracking,
    trackPageView: enterpriseTrackPageView,
    trackProductView: enterpriseTrackProductView,
    trackAddToCart: enterpriseTrackAddToCart,
    updateRealtimeActivity
  } = useEnterpriseTracking();

  console.log('📊 [ANALYTICS CONTEXT] Initialized for user:', uniqueUserId);

  // Função híbrida para rastrear eventos
  const trackEvent = async (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => {
    try {
      console.log(`🎯 [ANALYTICS] User ${uniqueUserId}: Event ${eventType}`, data);
      
      // Executar ambos os sistemas em paralelo
      await Promise.all([
        basicTrackEvent({ event_type: eventType, event_data: data }),
        // Enterprise tracking específico
        eventType === 'page_view' && enterpriseTrackPageView(),
        eventType === 'product_view' && enterpriseTrackProductView(data?.productId, data),
        eventType === 'add_to_cart' && enterpriseTrackAddToCart(data?.productId, data?.quantity || 1, data?.price)
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
        enterpriseTrackPageView()
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
      await trackEvent('search', { query, filters, results });
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Search tracked: ${query}`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking search:`, error);
    }
  };

  // Função para rastrear compra
  const trackPurchase = async (orderData: any) => {
    try {
      console.log(`💳 [ANALYTICS] User ${uniqueUserId}: Purchase:`, orderData);
      await trackEvent('purchase', orderData);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Purchase tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking purchase:`, error);
    }
  };

  // Função para rastrear início do checkout
  const trackCheckoutStart = async (cartItems: any[], totalValue: number) => {
    try {
      console.log(`🛒 [ANALYTICS] User ${uniqueUserId}: Checkout start`);
      await basicTrackCheckoutStart(cartItems, totalValue);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Checkout start tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout start:`, error);
    }
  };

  // Função para rastrear abandono do checkout
  const trackCheckoutAbandon = async (step: string, timeInCheckout: number, cartItems: any[], totalValue: number) => {
    try {
      console.log(`🚫 [ANALYTICS] User ${uniqueUserId}: Checkout abandon at ${step}`);
      await basicTrackCheckoutAbandon(step, timeInCheckout, cartItems, totalValue);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Checkout abandon tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout abandon:`, error);
    }
  };

  // Função para rastrear clique no WhatsApp
  const trackWhatsAppClick = async (productId?: string, context?: string) => {
    try {
      console.log(`📱 [ANALYTICS] User ${uniqueUserId}: WhatsApp click`);
      await basicTrackWhatsAppClick(productId, context);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: WhatsApp click tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking WhatsApp click:`, error);
    }
  };

  // Função para rastrear remoção do carrinho
  const trackRemoveFromCart = async (productId: string, quantity: number, price: number) => {
    try {
      console.log(`🗑️ [ANALYTICS] User ${uniqueUserId}: Remove from cart: ${productId}`);
      await basicTrackRemoveFromCart(productId, quantity, price);
      console.log(`✅ [ANALYTICS] User ${uniqueUserId}: Remove from cart tracked`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking remove from cart:`, error);
    }
  };

  // Função para flush de eventos
  const flushEvents = async () => {
    try {
      await updateRealtimeActivity();
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
    trackCheckoutAbandon,
    trackWhatsAppClick,
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

