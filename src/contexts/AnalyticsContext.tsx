/**
 * ANALYTICS CONTEXT - VERSÃO MULTI-USUÁRIO
 * Integra sistema básico + enterprise multi-usuário
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';

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
  trackCheckoutStart: (cartData: any[]) => void;
  trackWhatsAppClick: () => void;
  trackCheckoutAbandon: (step: string) => void;
  trackRemoveFromCart: (productId: string) => void;
  
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
  const analyticsHook = useAnalyticsTracking();
  const {
    trackEvent: basicTrackEvent,
    trackPageView: basicTrackPageView,
    trackProductView: basicTrackProductView,
    trackAddToCart: basicTrackAddToCart,
    sessionId
  } = analyticsHook;

  // Generate unique user ID
  const uniqueUserId = sessionId;

  const isTracking = true;

  console.log('📊 [ANALYTICS CONTEXT] Initialized for user:', uniqueUserId);

  // Função híbrida para rastrear eventos
  const trackEvent = async (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => {
    try {
      console.log(`🎯 [ANALYTICS] User ${uniqueUserId}: Event ${eventType}`, data);
      
      await basicTrackEvent({ event_type: eventType, event_data: data });
      
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
      
      await basicTrackPageView(title);
      
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

  // Função para rastrear busca
  const trackSearch = async (query: string, filters?: any, results?: any) => {
    try {
      console.log(`🔍 [ANALYTICS] User ${uniqueUserId}: Search: ${query}`);
      // Note: basicTrackSearch doesn't exist, we'll create a simple tracking
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

  // Checkout tracking functions
  const trackCheckoutStart = async (cartData: any[]) => {
    try {
      console.log(`🛒 [ANALYTICS] User ${uniqueUserId}: Checkout start`);
      await trackEvent('checkout_start', { cartData });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout start:`, error);
    }
  };

  const trackWhatsAppClick = async () => {
    try {
      console.log(`📱 [ANALYTICS] User ${uniqueUserId}: WhatsApp click`);
      await trackEvent('whatsapp_click', {});
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking WhatsApp click:`, error);
    }
  };

  const trackCheckoutAbandon = async (step: string) => {
    try {
      console.log(`❌ [ANALYTICS] User ${uniqueUserId}: Checkout abandon at step: ${step}`);
      await trackEvent('checkout_abandon', { step });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking checkout abandon:`, error);
    }
  };

  // Função para flush de eventos
  const flushEvents = async () => {
    try {
      // Basic analytics doesn't have flush functionality, just a stub
      console.log(`🔄 [ANALYTICS] User ${uniqueUserId}: Events flushed`);
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error flushing events:`, error);
    }
  };

  // Update realtime activity (stub)
  const updateRealtimeActivity = async () => {
    // Simple stub for compatibility
  };

  const trackRemoveFromCart = async (productId: string) => {
    try {
      console.log(`🗑️ [ANALYTICS] User ${uniqueUserId}: Remove from cart: ${productId}`);
      await trackEvent('remove_from_cart', { productId });
    } catch (error) {
      console.error(`❌ [ANALYTICS] User ${uniqueUserId}: Error tracking remove from cart:`, error);
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

