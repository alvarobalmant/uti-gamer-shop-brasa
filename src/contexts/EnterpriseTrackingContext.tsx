/**
 * CONTEXTO ENTERPRISE TRACKING - Wrapper global para todo o sistema
 * Integra com todos os componentes automaticamente
 */

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useEnterpriseTracking } from '@/hooks/useEnterpriseTracking';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface EnterpriseTrackingContextType {
  sessionId: string;
  trackEvent: (eventType: string, data?: any, element?: HTMLElement, coordinates?: { x: number; y: number }) => void;
  flushEvents: () => Promise<void>;
  isTracking: boolean;
  trackPageView: (url?: string, title?: string) => void;
  trackProductView: (productId: string, productData?: any) => void;
  trackAddToCart: (productId: string, quantity: number, price: number) => void;
  trackSearch: (query: string, filters?: any, results?: any) => void;
  trackCheckoutStep: (step: string, data?: any) => void;
  trackPurchase: (orderId: string, items: any[], total: number) => void;
  trackError: (error: Error, context?: string) => void;
}

const EnterpriseTrackingContext = createContext<EnterpriseTrackingContextType | undefined>(undefined);

export const EnterpriseTrackingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const tracking = useEnterpriseTracking();

  // Track automático de mudanças de rota
  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;
    
    console.log('🔥 [ENTERPRISE TRACKING] Page view:', {
      path: pagePath,
      title: pageTitle,
      sessionId: tracking.sessionId,
      userId: user?.id
    });
    
    tracking.trackEvent('page_view', {
      url: window.location.href,
      path: pagePath,
      title: pageTitle,
      referrer: document.referrer,
      timestamp: Date.now(),
      user_id: user?.id
    });
  }, [location, tracking, user?.id]);

  // Funções especializadas de tracking
  const trackPageView = (url?: string, title?: string) => {
    tracking.trackEvent('page_view', {
      url: url || window.location.href,
      title: title || document.title,
      timestamp: Date.now()
    });
  };

  const trackProductView = (productId: string, productData?: any) => {
    tracking.trackEvent('product_view', {
      product_id: productId,
      product_data: productData,
      timestamp: Date.now(),
      funnel_stage: 'consideration'
    });
  };

  const trackAddToCart = (productId: string, quantity: number, price: number) => {
    tracking.trackEvent('add_to_cart', {
      product_id: productId,
      quantity,
      price,
      total_value: price * quantity,
      timestamp: Date.now(),
      funnel_stage: 'decision'
    });
  };

  const trackSearch = (query: string, filters?: any, results?: any) => {
    tracking.trackEvent('search', {
      query,
      filters,
      results_count: results?.length || 0,
      timestamp: Date.now()
    });
  };

  const trackCheckoutStep = (step: string, data?: any) => {
    tracking.trackEvent('checkout_step', {
      step,
      checkout_data: data,
      timestamp: Date.now(),
      funnel_stage: 'purchase'
    });
  };

  const trackPurchase = (orderId: string, items: any[], total: number) => {
    tracking.trackEvent('purchase', {
      order_id: orderId,
      items,
      total_value: total,
      items_count: items.length,
      timestamp: Date.now(),
      funnel_stage: 'purchase'
    });
  };

  const trackError = (error: Error, context?: string) => {
    tracking.trackEvent('application_error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      context,
      timestamp: Date.now(),
      url: window.location.href
    });
  };

  const contextValue: EnterpriseTrackingContextType = {
    sessionId: tracking.sessionId,
    trackEvent: tracking.trackEvent,
    flushEvents: tracking.flushEvents,
    isTracking: tracking.isTracking,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackCheckoutStep,
    trackPurchase,
    trackError
  };

  return (
    <EnterpriseTrackingContext.Provider value={contextValue}>
      {children}
    </EnterpriseTrackingContext.Provider>
  );
};

export const useEnterpriseTrackingContext = () => {
  const context = useContext(EnterpriseTrackingContext);
  if (!context) {
    throw new Error('useEnterpriseTrackingContext must be used within an EnterpriseTrackingProvider');
  }
  return context;
};

// Hook simplificado para componentes
export const useTracking = () => {
  const context = useEnterpriseTrackingContext();
  
  return {
    // Métodos essenciais para componentes
    track: context.trackEvent,
    trackProduct: context.trackProductView,
    trackAddToCart: context.trackAddToCart,
    trackSearch: context.trackSearch,
    trackError: context.trackError,
    sessionId: context.sessionId
  };
};