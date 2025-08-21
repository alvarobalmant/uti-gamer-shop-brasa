import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EventData {
  [key: string]: any;
}

interface AnalyticsEvent {
  event_type: string;
  event_data?: EventData;
  product_id?: string;
  page_url?: string;
  referrer?: string;
}

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollData {
  scrollY: number;
  scrollPercentage: number;
  maxScrollReached: number;
  timestamp: number;
}

// Função para gerar session ID único
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Função para detectar tipo de dispositivo
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

// Função para obter dados de navegador
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detectar browser
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  // Detectar OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return { browser, os };
};

// Função para obter fonte de tráfego
const getTrafficSource = () => {
  const referrer = document.referrer;
  const params = new URLSearchParams(window.location.search);
  
  // UTM parameters
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  if (utmSource) {
    return {
      traffic_source: utmSource,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign
    };
  }

  if (referrer) {
    if (referrer.includes('google')) return { traffic_source: 'google' };
    if (referrer.includes('facebook') || referrer.includes('instagram')) return { traffic_source: 'social' };
    if (referrer.includes('whatsapp') || referrer.includes('wa.me')) return { traffic_source: 'whatsapp' };
    return { traffic_source: 'referral' };
  }

  return { traffic_source: 'direct' };
};

// Função para calcular Web Vitals
const measureWebVitals = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    largest_contentful_paint: 0, // Será medido via observer
    first_input_delay: 0, // Será medido via observer
    cumulative_layout_shift: 0, // Será medido via observer
    first_contentful_paint: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
    time_to_interactive: navigation?.domInteractive - navigation?.navigationStart || 0,
    total_blocking_time: 0,
    performance_score: 100 // Será calculado baseado nas métricas
  };
};

export const useAnalyticsTracking = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(generateSessionId());
  const sessionStartRef = useRef<Date>(new Date());
  const pageStartTimeRef = useRef<Date>(new Date());
  const eventsQueueRef = useRef<AnalyticsEvent[]>([]);
  const isInitializedRef = useRef(false);
  
  // Refs para tracking granular
  const mousePositionsRef = useRef<MousePosition[]>([]);
  const scrollDataRef = useRef<ScrollData[]>([]);
  const maxScrollReachedRef = useRef<number>(0);
  const lastMouseMoveRef = useRef<number>(0);
  const lastScrollRef = useRef<number>(0);
  const interactionCountRef = useRef<number>(0);
  const engagementScoreRef = useRef<number>(0);

  // Função para enviar eventos em lote
  const flushEvents = useCallback(async () => {
    if (eventsQueueRef.current.length === 0) return;

    const events = [...eventsQueueRef.current];
    eventsQueueRef.current = [];

    const { browser, os } = getBrowserInfo();
    const deviceType = getDeviceType();

    const eventsToInsert = events.map(event => ({
      user_id: user?.id || null,
      session_id: sessionIdRef.current,
      event_type: event.event_type,
      event_data: event.event_data || {},
      product_id: event.product_id || null,
      page_url: event.page_url || window.location.href,
      referrer: event.referrer || document.referrer,
      user_agent: navigator.userAgent,
      device_type: deviceType,
      location_data: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    }));

    try {
      await supabase.from('customer_events').insert(eventsToInsert);
    } catch (error) {
      console.error('Erro ao enviar eventos:', error);
      // Recolocar eventos na fila em caso de erro
      eventsQueueRef.current.unshift(...events);
    }
  }, [user?.id]);

  // Função para enviar dados granulares
  const flushGranularData = useCallback(async () => {
    const currentTime = Date.now();
    
    try {
      // Enviar dados de mouse tracking
      if (mousePositionsRef.current.length > 0) {
        const mouseData = mousePositionsRef.current.map(pos => ({
          session_id: sessionIdRef.current,
          user_id: user?.id || null,
          page_url: window.location.href,
          coordinates: { x: pos.x, y: pos.y },
          timestamp_precise: new Date(pos.timestamp).toISOString(),
          movement_speed: 0, // Será calculado no backend
          interaction_type: 'mouse_move'
        }));

        await supabase.from('mouse_tracking').insert(mouseData);
        mousePositionsRef.current = [];
      }

      // Enviar dados de scroll
      if (scrollDataRef.current.length > 0) {
        const scrollData = scrollDataRef.current.map(scroll => ({
          session_id: sessionIdRef.current,
          user_id: user?.id || null,
          page_url: window.location.href,
          scroll_position: scroll.scrollY,
          scroll_percentage: scroll.scrollPercentage,
          max_scroll_reached: scroll.maxScrollReached,
          timestamp_precise: new Date(scroll.timestamp).toISOString(),
          scroll_direction: 'down', // Será calculado baseado na sequência
          scroll_speed: 0 // Será calculado no backend
        }));

        await supabase.from('scroll_behavior').insert(scrollData);
        scrollDataRef.current = [];
      }

      // Atualizar atividade em tempo real
      await supabase.from('realtime_activity').upsert({
        session_id: sessionIdRef.current,
        user_id: user?.id || null,
        current_page_url: window.location.href,
        current_page_title: document.title,
        activity_status: 'active',
        last_heartbeat: new Date().toISOString(),
        session_start_time: sessionStartRef.current.toISOString(),
        current_page_start_time: pageStartTimeRef.current.toISOString(),
        engagement_score: engagementScoreRef.current,
        interactions_count: interactionCountRef.current,
        scroll_depth_percentage: maxScrollReachedRef.current,
        time_on_page_seconds: Math.floor((currentTime - pageStartTimeRef.current.getTime()) / 1000),
        conversion_probability: Math.min(1, engagementScoreRef.current / 100),
        intervention_opportunity: engagementScoreRef.current > 70 && interactionCountRef.current > 10
      });

    } catch (error) {
      console.error('Erro ao enviar dados granulares:', error);
    }
  }, [user?.id]);

  // Função para rastrear evento
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    eventsQueueRef.current.push({
      ...event,
      page_url: event.page_url || window.location.href,
      referrer: event.referrer || document.referrer
    });

    // Enviar eventos a cada 5 eventos ou a cada 10 segundos
    if (eventsQueueRef.current.length >= 5) {
      flushEvents();
    }
  }, [flushEvents]);

  // Função para rastrear interação granular
  const trackPageInteraction = useCallback(async (
    interactionType: string,
    element: HTMLElement | null,
    coordinates?: { x: number; y: number },
    additionalData?: any
  ) => {
    const timestamp = new Date().toISOString();
    const elementSelector = element ? 
      `${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ').join('.') : ''}` 
      : 'unknown';

    try {
      await supabase.from('page_interactions').insert({
        session_id: sessionIdRef.current,
        user_id: user?.id || null,
        page_url: window.location.href,
        page_title: document.title,
        interaction_type: interactionType,
        element_selector: elementSelector,
        coordinates: coordinates || null,
        timestamp_precise: timestamp,
        sequence_number: interactionCountRef.current++,
        duration_ms: additionalData?.duration || 0,
        interaction_data: additionalData || {}
      });

      // Atualizar engagement score
      engagementScoreRef.current = Math.min(100, engagementScoreRef.current + 2);

    } catch (error) {
      console.error('Erro ao rastrear interação:', error);
    }
  }, [user?.id]);

  // Função para calcular e enviar Web Vitals
  const trackWebVitals = useCallback(async () => {
    const vitals = measureWebVitals();
    
    try {
      await supabase.from('performance_vitals').insert({
        session_id: sessionIdRef.current,
        user_id: user?.id || null,
        page_url: window.location.href,
        measurement_timestamp: new Date().toISOString(),
        ...vitals,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        connection_type: (navigator as any).connection?.effectiveType || 'unknown',
        javascript_errors: [], // Será populado por error handler
        bounce_correlation: false, // Será calculado no backend
        engagement_impact_score: 0 // Será calculado no backend
      });
    } catch (error) {
      console.error('Erro ao enviar Web Vitals:', error);
    }
  }, [user?.id]);

  // Inicializar sessão
  const initializeSession = useCallback(async () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const { browser, os } = getBrowserInfo();
    const trafficData = getTrafficSource();
    
    try {
      await supabase.from('user_sessions').insert({
        session_id: sessionIdRef.current,
        user_id: user?.id || null,
        device_type: getDeviceType(),
        browser,
        os,
        location_data: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        },
        ...trafficData
      });

      // Rastrear page view inicial
      trackEvent({
        event_type: 'page_view',
        event_data: {
          title: document.title,
          is_initial_page: true
        }
      });

      // Medir Web Vitals iniciais
      setTimeout(() => trackWebVitals(), 1000);

    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
    }
  }, [user?.id, trackEvent, trackWebVitals]);

  // Finalizar sessão
  const endSession = useCallback(async () => {
    const duration = Math.floor((new Date().getTime() - sessionStartRef.current.getTime()) / 1000);
    
    try {
      await supabase
        .from('user_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          events_count: eventsQueueRef.current.length,
          page_views: Math.floor(duration / 60), // Estimativa
          engagement_score: engagementScoreRef.current
        })
        .eq('session_id', sessionIdRef.current);

      // Enviar dados restantes
      await flushEvents();
      await flushGranularData();
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  }, [flushEvents, flushGranularData]);

  // Rastrear mudanças de página
  const trackPageView = useCallback((title?: string) => {
    trackEvent({
      event_type: 'page_view',
      event_data: {
        title: title || document.title,
        previous_page_time: Math.floor((new Date().getTime() - pageStartTimeRef.current.getTime()) / 1000)
      }
    });
    pageStartTimeRef.current = new Date();
    maxScrollReachedRef.current = 0;
    interactionCountRef.current = 0;
    engagementScoreRef.current = 0;
  }, [trackEvent]);

  // Rastrear visualização de produto
  const trackProductView = useCallback((productId: string, productData?: any) => {
    trackEvent({
      event_type: 'product_view',
      product_id: productId,
      event_data: {
        ...productData,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Rastrear adição ao carrinho
  const trackAddToCart = useCallback((productId: string, quantity: number, price: number, productData?: any) => {
    const eventType = productData?.isNewItem === false ? 'cart_quantity_increase' : 'add_to_cart';
    
    trackEvent({
      event_type: eventType,
      product_id: productId,
      event_data: {
        quantity,
        price,
        value: price * quantity,
        is_new_item: productData?.isNewItem !== false,
        final_quantity: productData?.finalQuantity || quantity,
        ...productData
      }
    });
  }, [trackEvent]);

  // Rastrear remoção do carrinho
  const trackRemoveFromCart = useCallback((productId: string, quantity: number, price: number) => {
    trackEvent({
      event_type: 'remove_from_cart',
      product_id: productId,
      event_data: {
        quantity,
        price,
        value: price * quantity
      }
    });
  }, [trackEvent]);

  // Rastrear início do checkout
  const trackCheckoutStart = useCallback((cartItems: any[], totalValue: number) => {
    trackEvent({
      event_type: 'checkout_start',
      event_data: {
        cart_items: cartItems,
        total_value: totalValue,
        items_count: cartItems.length
      }
    });
  }, [trackEvent]);

  // Rastrear abandono do checkout
  const trackCheckoutAbandon = useCallback((step: string, timeInCheckout: number, cartItems: any[], totalValue: number) => {
    trackEvent({
      event_type: 'checkout_abandon',
      event_data: {
        checkout_step: step,
        time_in_checkout_seconds: timeInCheckout,
        cart_items: cartItems,
        total_value: totalValue
      }
    });

    // Inserir também na tabela de carrinho abandonado
    supabase.from('cart_abandonment').insert({
      session_id: sessionIdRef.current,
      user_id: user?.id || null,
      cart_items: cartItems,
      cart_value: totalValue,
      checkout_step: step,
      time_in_checkout_seconds: timeInCheckout
    });
  }, [trackEvent, user?.id]);

  // Rastrear compra
  const trackPurchase = useCallback((orderId: string, items: any[], totalValue: number, paymentMethod?: string) => {
    trackEvent({
      event_type: 'purchase',
      event_data: {
        order_id: orderId,
        items,
        value: totalValue,
        payment_method: paymentMethod,
        items_count: items.length
      }
    });

    // Marcar sessão como convertida
    supabase
      .from('user_sessions')
      .update({
        converted: true,
        purchase_value: totalValue
      })
      .eq('session_id', sessionIdRef.current);
  }, [trackEvent]);

  // Rastrear clique no WhatsApp
  const trackWhatsAppClick = useCallback((productId?: string, context?: string) => {
    trackEvent({
      event_type: 'whatsapp_click',
      product_id: productId,
      event_data: {
        context: context || 'product_page',
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Inicializar tracking granular
  useEffect(() => {
    if (!isInitializedRef.current) return;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveRef.current > 100) { // Throttle para 10fps
        mousePositionsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        });
        lastMouseMoveRef.current = now;

        // Limitar buffer
        if (mousePositionsRef.current.length > 100) {
          mousePositionsRef.current = mousePositionsRef.current.slice(-50);
        }
      }
    };

    // Scroll tracking
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollRef.current > 100) { // Throttle
        const scrollY = window.scrollY;
        const scrollPercentage = Math.round((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercentage > maxScrollReachedRef.current) {
          maxScrollReachedRef.current = scrollPercentage;
        }

        scrollDataRef.current.push({
          scrollY,
          scrollPercentage,
          maxScrollReached: maxScrollReachedRef.current,
          timestamp: now
        });
        lastScrollRef.current = now;

        // Limitar buffer
        if (scrollDataRef.current.length > 50) {
          scrollDataRef.current = scrollDataRef.current.slice(-25);
        }

        // Atualizar engagement baseado em scroll
        engagementScoreRef.current = Math.min(100, engagementScoreRef.current + 0.5);
      }
    };

    // Click tracking
    const handleClick = (e: MouseEvent) => {
      trackPageInteraction('click', e.target as HTMLElement, {
        x: e.clientX,
        y: e.clientY
      });
    };

    // Hover tracking (throttled)
    let hoverTimeout: NodeJS.Timeout;
    const handleMouseOver = (e: MouseEvent) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        trackPageInteraction('hover', e.target as HTMLElement, {
          x: e.clientX,
          y: e.clientY
        }, { duration: 1000 });
      }, 1000); // Só rastrear hovers de 1s+
    };

    // Focus tracking
    const handleFocus = (e: FocusEvent) => {
      trackPageInteraction('focus', e.target as HTMLElement);
    };

    // Adicionar listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('focus', handleFocus, true);

    // Heartbeat para manter atividade em tempo real
    const heartbeatInterval = setInterval(() => {
      flushGranularData();
    }, 5000); // A cada 5 segundos

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('focus', handleFocus, true);
      clearInterval(heartbeatInterval);
      clearTimeout(hoverTimeout);
    };
  }, [trackPageInteraction, flushGranularData]);

  // Inicializar tracking
  useEffect(() => {
    initializeSession();

    // Enviar eventos periodicamente
    const flushInterval = setInterval(flushEvents, 10000);

    // Listener para beforeunload (sair da página)
    const handleBeforeUnload = () => {
      endSession();
    };

    // Listener para mudanças de visibilidade
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushEvents();
        flushGranularData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(flushInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      endSession();
    };
  }, [initializeSession, endSession, flushEvents, flushGranularData]);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStart,
    trackCheckoutAbandon,
    trackPurchase,
    trackWhatsAppClick,
    trackPageInteraction,
    sessionId: sessionIdRef.current,
    engagementScore: engagementScoreRef.current,
    interactionCount: interactionCountRef.current
  };
};

