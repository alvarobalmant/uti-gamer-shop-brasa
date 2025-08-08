import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardAnalytics {
  total_revenue: number;
  total_sessions: number;
  total_purchases: number;
  avg_conversion_rate: number;
  avg_order_value: number;
  cart_abandonment_rate: number;
  whatsapp_clicks: number;
  period_data: Array<{
    date: string;
    revenue: number;
    sessions: number;
    purchases: number;
    conversion_rate: number;
  }>;
}

export interface ProductAnalytics {
  product_id: string;
  product_name: string;
  total_views: number;
  total_purchases: number;
  total_revenue: number;
  avg_conversion_rate: number;
  whatsapp_clicks: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  avg_order_value: number;
  total_revenue: number;
}

export interface TrafficAnalytics {
  source: string;
  sessions: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
}

interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
  compareWith?: {
    startDate: Date;
    endDate: Date;
  };
}

export const useAnalyticsData = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [topProducts, setTopProducts] = useState<ProductAnalytics[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficAnalytics[]>([]);

  // Função para buscar analytics do dashboard
  const fetchDashboardAnalytics = useCallback(async (filters: AnalyticsFilters) => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('get_dashboard_analytics', {
        start_date: filters.startDate.toISOString().split('T')[0],
        end_date: filters.endDate.toISOString().split('T')[0]
      });

      if (error) throw error;
      setDashboardData(data as unknown as DashboardAnalytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Função para buscar top produtos
  const fetchTopProducts = useCallback(async (filters: AnalyticsFilters, limit = 10) => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase.rpc('get_top_products_analytics', {
        start_date: filters.startDate.toISOString().split('T')[0],
        end_date: filters.endDate.toISOString().split('T')[0],
        limit_count: limit
      });

      if (error) throw error;
      setTopProducts((data as unknown as ProductAnalytics[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados de produtos');
    }
  }, [isAdmin]);

  // Função para buscar segmentação de clientes
  const fetchCustomerSegments = useCallback(async (filters: AnalyticsFilters) => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('customer_ltv')
        .select('segment, total_spent, total_purchases')
        .not('segment', 'is', null);

      if (error) throw error;

      // Processar dados de segmentação
      const segmentMap = new Map();
      let totalCustomers = 0;

      data?.forEach(customer => {
        const segment = customer.segment || 'unknown';
        if (!segmentMap.has(segment)) {
          segmentMap.set(segment, {
            count: 0,
            total_revenue: 0,
            total_orders: 0
          });
        }

        const segmentData = segmentMap.get(segment);
        segmentData.count++;
        segmentData.total_revenue += customer.total_spent || 0;
        segmentData.total_orders += customer.total_purchases || 0;
        totalCustomers++;
      });

      const segments: CustomerSegment[] = Array.from(segmentMap.entries()).map(([segment, data]) => ({
        segment,
        count: data.count,
        percentage: totalCustomers > 0 ? (data.count / totalCustomers) * 100 : 0,
        avg_order_value: data.total_orders > 0 ? data.total_revenue / data.total_orders : 0,
        total_revenue: data.total_revenue
      }));

      setCustomerSegments(segments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar segmentação de clientes');
    }
  }, [isAdmin]);

  // Função para buscar dados de tráfego
  const fetchTrafficAnalytics = useCallback(async (filters: AnalyticsFilters) => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('traffic_source, converted, purchase_value')
        .gte('started_at', filters.startDate.toISOString())
        .lte('started_at', filters.endDate.toISOString());

      if (error) throw error;

      // Processar dados de tráfego
      const trafficMap = new Map();

      data?.forEach(session => {
        const source = session.traffic_source || 'unknown';
        if (!trafficMap.has(source)) {
          trafficMap.set(source, {
            sessions: 0,
            conversions: 0,
            revenue: 0
          });
        }

        const trafficData = trafficMap.get(source);
        trafficData.sessions++;
        if (session.converted) {
          trafficData.conversions++;
          trafficData.revenue += session.purchase_value || 0;
        }
      });

      const traffic: TrafficAnalytics[] = Array.from(trafficMap.entries()).map(([source, data]) => ({
        source,
        sessions: data.sessions,
        conversions: data.conversions,
        conversion_rate: data.sessions > 0 ? (data.conversions / data.sessions) * 100 : 0,
        revenue: data.revenue
      }));

      setTrafficData(traffic.sort((a, b) => b.sessions - a.sessions));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados de tráfego');
    }
  }, [isAdmin]);

  // Função para buscar eventos de um período
  const fetchRawEvents = useCallback(async (filters: AnalyticsFilters, eventType?: string) => {
    if (!isAdmin) return [];

    try {
      let query = supabase
        .from('customer_events')
        .select('*')
        .gte('created_at', filters.startDate.toISOString())
        .lte('created_at', filters.endDate.toISOString())
        .order('created_at', { ascending: false });

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      const { data, error } = await query.limit(1000);

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar eventos');
      return [];
    }
  }, [isAdmin]);

  // Função para buscar heatmap de horários
  const fetchTimeHeatmap = useCallback(async (filters: AnalyticsFilters) => {
    if (!isAdmin) return [];

    try {
      const { data, error } = await supabase
        .from('customer_events')
        .select('created_at, event_type')
        .gte('created_at', filters.startDate.toISOString())
        .lte('created_at', filters.endDate.toISOString());

      if (error) throw error;

      // Processar dados para heatmap (hora vs dia da semana)
      const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));
      
      data?.forEach(event => {
        const date = new Date(event.created_at);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        heatmapData[dayOfWeek][hour]++;
      });

      return heatmapData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar heatmap');
      return [];
    }
  }, [isAdmin]);

  // Função para exportar dados
  const exportData = useCallback(async (filters: AnalyticsFilters, format: 'csv' | 'json') => {
    if (!isAdmin) return;

    try {
      // Buscar todos os dados necessários
      const events = await fetchRawEvents(filters);
      const dashboard = dashboardData;
      const products = topProducts;

      const exportData = {
        summary: dashboard,
        top_products: products,
        customer_segments: customerSegments,
        traffic_sources: trafficData,
        raw_events: events.slice(0, 500) // Limitar para não sobrecarregar
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${filters.startDate.toISOString().split('T')[0]}_${filters.endDate.toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Converter para CSV (implementação básica)
        const csvData = [
          ['Métrica', 'Valor'],
          ['Receita Total', dashboard?.total_revenue || 0],
          ['Total de Sessões', dashboard?.total_sessions || 0],
          ['Total de Compras', dashboard?.total_purchases || 0],
          ['Taxa de Conversão Média', dashboard?.avg_conversion_rate || 0],
          ['Ticket Médio', dashboard?.avg_order_value || 0]
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${filters.startDate.toISOString().split('T')[0]}_${filters.endDate.toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar dados');
    }
  }, [isAdmin, dashboardData, topProducts, customerSegments, trafficData, fetchRawEvents]);

  return {
    loading,
    error,
    dashboardData,
    topProducts,
    customerSegments,
    trafficData,
    fetchDashboardAnalytics,
    fetchTopProducts,
    fetchCustomerSegments,
    fetchTrafficAnalytics,
    fetchRawEvents,
    fetchTimeHeatmap,
    exportData,
    setError
  };
};