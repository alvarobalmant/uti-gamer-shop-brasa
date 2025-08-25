import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EnterpriseAnalyticsData {
  userJourney?: any[];
  abandonmentAnalysis?: any[];
  conversionRoutes?: any[];
  heatmapData?: any[];
  behavioralSegments?: any[];
  conversionScore?: any[];
  frictionPoints?: any[];
  realTimeAlerts?: any[];
  churnPrediction?: any[];
  performanceCorrelation?: any[];
  productIntelligence?: any[];
  realtimeDashboard?: any[];
}

export const useEnterpriseAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnterpriseAnalyticsData>({});

  // 1. Replay completo de usuário
  const getUserCompleteJourney = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const { data: journeyData, error } = await supabase.rpc('get_user_complete_journey', {
        p_session_id: sessionId
      });

      if (error) throw error;

      setData(prev => ({ ...prev, userJourney: journeyData }));
      return journeyData;
    } catch (err) {
      console.error('Erro ao buscar jornada do usuário:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Análise de abandono por setor
  const getAbandonmentAnalysisBySector = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: abandonmentData, error } = await supabase.rpc('get_abandonment_analysis_by_sector', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, abandonmentAnalysis: abandonmentData }));
      return abandonmentData;
    } catch (err) {
      console.error('Erro ao buscar análise de abandono:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Análise de rotas de conversão
  const getConversionRoutesAnalysis = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: routesData, error } = await supabase.rpc('get_conversion_routes_analysis', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, conversionRoutes: routesData }));
      return routesData;
    } catch (err) {
      console.error('Erro ao buscar rotas de conversão:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Dados de heatmap enterprise
  const getHeatmapEnterpriseData = useCallback(async (pageUrl: string, days: number = 7) => {
    try {
      setLoading(true);
      const { data: heatmapData, error } = await supabase.rpc('get_heatmap_enterprise_data', {
        p_page_url: pageUrl,
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, heatmapData: heatmapData }));
      return heatmapData;
    } catch (err) {
      console.error('Erro ao buscar dados de heatmap:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Segmentação comportamental
  const getBehavioralSegmentation = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: segmentData, error } = await supabase.rpc('get_behavioral_segmentation', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, behavioralSegments: segmentData }));
      return segmentData;
    } catch (err) {
      console.error('Erro ao buscar segmentação comportamental:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. Score preditivo de conversão
  const getPredictiveConversionScore = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const { data: scoreData, error } = await supabase.rpc('get_predictive_conversion_score', {
        p_session_id: sessionId
      });

      if (error) throw error;

      setData(prev => ({ ...prev, conversionScore: scoreData }));
      return scoreData;
    } catch (err) {
      console.error('Erro ao buscar score de conversão:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 7. Análise de pontos de fricção
  const getFrictionPointsAnalysis = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: frictionData, error } = await supabase.rpc('get_friction_points_analysis', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, frictionPoints: frictionData }));
      return frictionData;
    } catch (err) {
      console.error('Erro ao buscar pontos de fricção:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 8. Alertas em tempo real
  const getRealTimeAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: alertsData, error } = await supabase.rpc('get_real_time_alerts');

      if (error) throw error;

      setData(prev => ({ ...prev, realTimeAlerts: alertsData }));
      return alertsData;
    } catch (err) {
      console.error('Erro ao buscar alertas em tempo real:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 9. Predição de churn
  const getChurnPrediction = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: churnData, error } = await supabase.rpc('get_churn_prediction', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, churnPrediction: churnData }));
      return churnData;
    } catch (err) {
      console.error('Erro ao buscar predição de churn:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 10. Correlação de performance
  const getPerformanceCorrelation = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: perfData, error } = await supabase.rpc('get_performance_correlation', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, performanceCorrelation: perfData }));
      return perfData;
    } catch (err) {
      console.error('Erro ao buscar correlação de performance:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 11. Inteligência de produtos
  const getProductIntelligence = useCallback(async (days: number = 30) => {
    try {
      setLoading(true);
      const { data: productData, error } = await supabase.rpc('get_product_intelligence', {
        p_days_back: days
      });

      if (error) throw error;

      setData(prev => ({ ...prev, productIntelligence: productData }));
      return productData;
    } catch (err) {
      console.error('Erro ao buscar inteligência de produtos:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 12. Dashboard em tempo real
  const getRealtimeDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: dashboardData, error } = await supabase.rpc('get_realtime_dashboard_data');

      if (error) throw error;

      setData(prev => ({ ...prev, realtimeDashboard: dashboardData }));
      return dashboardData;
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard em tempo real:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar dados das views materializadas
  const getMaterializedViewData = useCallback(async (viewName: string) => {
    try {
      setLoading(true);
      const { data: viewData, error } = await supabase
        .from(viewName)
        .select('*')
        .order('last_update', { ascending: false });

      if (error) throw error;

      return viewData;
    } catch (err) {
      console.error(`Erro ao buscar dados da view ${viewName}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar views materializadas
  const refreshMaterializedViews = useCallback(async () => {
    try {
      setLoading(true);
      const { data: refreshResult, error } = await supabase.rpc('refresh_materialized_views');

      if (error) throw error;

      return refreshResult;
    } catch (err) {
      console.error('Erro ao atualizar views materializadas:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar dados de categoria gaming
  const getCategoryPerformance = useCallback(async () => {
    try {
      setLoading(true);
      const { data: categoryData, error } = await supabase
        .from('mv_category_performance')
        .select('*')
        .order('conversion_rate', { ascending: false });

      if (error) throw error;

      return categoryData;
    } catch (err) {
      console.error('Erro ao buscar performance por categoria:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar métricas horárias
  const getHourlyMetrics = useCallback(async (hours: number = 24) => {
    try {
      setLoading(true);
      const { data: hourlyData, error } = await supabase
        .from('mv_hourly_metrics')
        .select('*')
        .gte('hour', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('hour', { ascending: true });

      if (error) throw error;

      return hourlyData;
    } catch (err) {
      console.error('Erro ao buscar métricas horárias:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar dashboard em tempo real da view materializada
  const getRealtimeDashboardView = useCallback(async () => {
    try {
      setLoading(true);
      const { data: dashboardData, error } = await supabase
        .from('mv_realtime_dashboard')
        .select('*')
        .order('active_users', { ascending: false });

      if (error) throw error;

      return dashboardData;
    } catch (err) {
      console.error('Erro ao buscar dashboard em tempo real:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para executar limpeza de dados
  const cleanupOldData = useCallback(async (retentionDays: number = 90) => {
    try {
      setLoading(true);
      const { data: cleanupResult, error } = await supabase.rpc('cleanup_old_analytics_data', {
        p_retention_days: retentionDays
      });

      if (error) throw error;

      return cleanupResult;
    } catch (err) {
      console.error('Erro ao executar limpeza de dados:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar alertas ativos
  const getActiveAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: alertsData, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return alertsData;
    } catch (err) {
      console.error('Erro ao buscar alertas ativos:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para marcar alerta como resolvido
  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      setLoading(true);
      const { data: resolveResult, error } = await supabase
        .from('system_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      return resolveResult;
    } catch (err) {
      console.error('Erro ao resolver alerta:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    setError,
    
    // Funções RPC principais
    getUserCompleteJourney,
    getAbandonmentAnalysisBySector,
    getConversionRoutesAnalysis,
    getHeatmapEnterpriseData,
    getBehavioralSegmentation,
    getPredictiveConversionScore,
    getFrictionPointsAnalysis,
    getRealTimeAlerts,
    getChurnPrediction,
    getPerformanceCorrelation,
    getProductIntelligence,
    getRealtimeDashboardData,
    
    // Views materializadas
    getMaterializedViewData,
    refreshMaterializedViews,
    getCategoryPerformance,
    getHourlyMetrics,
    getRealtimeDashboardView,
    
    // Funções de manutenção
    cleanupOldData,
    getActiveAlerts,
    resolveAlert
  };
};

