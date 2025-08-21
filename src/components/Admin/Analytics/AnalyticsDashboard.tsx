import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingCart, 
  MessageCircle, 
  DollarSign,
  Eye,
  ShoppingBag,
  RefreshCw,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsDashboard = () => {
  const {
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
    exportData,
    setError
  } = useAnalyticsData();

  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [previousPeriodData, setPreviousPeriodData] = useState(null);

  // Opções de período
  const periodOptions = [
    { value: '24h', label: 'Últimas 24 horas', days: 1 },
    { value: '7d', label: 'Últimos 7 dias', days: 7 },
    { value: '30d', label: 'Últimos 30 dias', days: 30 },
    { value: '90d', label: 'Últimos 90 dias', days: 90 },
    { value: '1y', label: 'Último ano', days: 365 },
    { value: 'all', label: 'Tempo total', days: null }
  ];

  // Função para calcular datas baseado no período selecionado
  const getDateRange = (period) => {
    const endDate = new Date();
    let startDate;

    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date('2020-01-01'); // Data bem antiga para pegar tudo
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate };
  };

  // Função para calcular período anterior para comparação
  const getPreviousDateRange = (period) => {
    const { startDate, endDate } = getDateRange(period);
    const periodDuration = endDate.getTime() - startDate.getTime();
    
    const previousEndDate = new Date(startDate.getTime());
    const previousStartDate = new Date(startDate.getTime() - periodDuration);

    return { 
      startDate: previousStartDate, 
      endDate: previousEndDate 
    };
  };

  // Função para calcular variação percentual
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Carregar dados quando o período mudar
  useEffect(() => {
    const loadData = async () => {
      setRefreshing(true);
      try {
        const { startDate, endDate } = getDateRange(selectedPeriod);
        const { startDate: prevStartDate, endDate: prevEndDate } = getPreviousDateRange(selectedPeriod);
        
        // Buscar dados do período atual
        await Promise.all([
          fetchDashboardAnalytics({ startDate, endDate }),
          fetchTopProducts({ startDate, endDate }),
          fetchCustomerSegments({ startDate, endDate }),
          fetchTrafficAnalytics({ startDate, endDate })
        ]);

        // Buscar dados do período anterior para comparação (apenas dashboard)
        if (selectedPeriod !== 'all') {
          try {
            const { data: prevData } = await supabase.rpc('get_dashboard_analytics', {
              start_date: prevStartDate.toISOString().split('T')[0],
              end_date: prevEndDate.toISOString().split('T')[0]
            });
            
            if (prevData && Array.isArray(prevData) && prevData[0]) {
              setPreviousPeriodData({
                total_revenue: Number(prevData[0].total_revenue) || 0,
                total_sessions: Number(prevData[0].total_sessions) || 0,
                total_purchases: Number(prevData[0].total_purchases) || 0,
                avg_conversion_rate: Number(prevData[0].avg_conversion_rate) || 0
              });
            } else {
              setPreviousPeriodData(null);
            }
          } catch (err) {
            console.warn('Erro ao buscar dados do período anterior:', err);
            setPreviousPeriodData(null);
          }
        } else {
          setPreviousPeriodData(null);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setRefreshing(false);
      }
    };

    loadData();
  }, [selectedPeriod, fetchDashboardAnalytics, fetchTopProducts, fetchCustomerSegments, fetchTrafficAnalytics]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  // Cores minimalistas enterprise
  const colors = {
    primary: '#3B82F6',    // Blue
    success: '#10B981',    // Green
    warning: '#F59E0B',    // Amber
    danger: '#EF4444',     // Red
    purple: '#8B5CF6',     // Purple
    cyan: '#06B6D4'        // Cyan
  };

  // Processar dados do período
  const periodData = React.useMemo(() => {
    if (!dashboardData?.period_data || !Array.isArray(dashboardData.period_data)) {
      return [];
    }
    
    return dashboardData.period_data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }));
  }, [dashboardData?.period_data]);

  // Processar dados de tráfego
  const processedTrafficData = React.useMemo(() => {
    if (!trafficData || !Array.isArray(trafficData)) return [];
    
    return trafficData.map(item => ({
      source: item?.source || 'unknown',
      sessions: item?.sessions || 0,
      conversions: item?.conversions || 0,
      revenue: item?.revenue || 0,
      rate: item?.conversion_rate || 0
    }));
  }, [trafficData]);

  // Função para atualizar dados
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      
      await Promise.all([
        fetchDashboardAnalytics({ startDate, endDate }),
        fetchTopProducts({ startDate, endDate }),
        fetchCustomerSegments({ startDate, endDate }),
        fetchTrafficAnalytics({ startDate, endDate })
      ]);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando analytics...</span>
      </div>
    );
  }

  const currentPeriodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || 'Últimos 30 dias';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Visão geral de performance da UTI Gamer Shop</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Seletor de Período */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 border-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="border-gray-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 p-1 rounded-lg mb-8">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-gray-600"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-gray-600"
          >
            Produtos
          </TabsTrigger>
          <TabsTrigger 
            value="traffic" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-gray-600"
          >
            Tráfego
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 text-gray-600"
          >
            Clientes
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Receita Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData?.total_revenue || 0)}
                </div>
                {previousPeriodData && (
                  <div className="flex items-center mt-2">
                    {(() => {
                      const change = calculatePercentageChange(
                        dashboardData?.total_revenue || 0,
                        previousPeriodData.total_revenue
                      );
                      const isPositive = change >= 0;
                      return (
                        <>
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sessões Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Sessões</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardData?.total_sessions || 0)}
                </div>
                {previousPeriodData && (
                  <div className="flex items-center mt-2">
                    {(() => {
                      const change = calculatePercentageChange(
                        dashboardData?.total_sessions || 0,
                        previousPeriodData.total_sessions
                      );
                      const isPositive = change >= 0;
                      return (
                        <>
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compras Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Compras</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardData?.total_purchases || 0)}
                </div>
                {previousPeriodData && (
                  <div className="flex items-center mt-2">
                    {(() => {
                      const change = calculatePercentageChange(
                        dashboardData?.total_purchases || 0,
                        previousPeriodData.total_purchases
                      );
                      const isPositive = change >= 0;
                      return (
                        <>
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Taxa de Conversão Card */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
                <MessageCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {(dashboardData?.avg_conversion_rate || 0).toFixed(2)}%
                </div>
                {previousPeriodData && (
                  <div className="flex items-center mt-2">
                    {(() => {
                      const change = calculatePercentageChange(
                        dashboardData?.avg_conversion_rate || 0,
                        previousPeriodData.avg_conversion_rate
                      );
                      const isPositive = change >= 0;
                      return (
                        <>
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
                        </>
                      );
                    })()}
                  </div>
                )}
                {!previousPeriodData && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Ticket médio: {formatCurrency(dashboardData?.avg_order_value || 0)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Combinado - Receita e Sessões */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performance Comparativa</CardTitle>
              <CardDescription className="text-gray-600">Receita vs Sessões - {currentPeriodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => formatCurrency(value)}
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Receita') {
                        return [formatCurrency(Number(value)), name];
                      }
                      return [formatNumber(Number(value)), name];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={colors.primary}
                    fill={colors.primary}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Receita"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="sessions" 
                    stroke={colors.cyan}
                    strokeWidth={3}
                    dot={{ fill: colors.cyan, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: colors.cyan, strokeWidth: 2 }}
                    name="Sessões"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráficos Individuais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Receita */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Receita por Período</CardTitle>
                <CardDescription className="text-gray-600">{currentPeriodLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={periodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={colors.primary}
                      fill={colors.primary}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Sessões */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Sessões por Período</CardTitle>
                <CardDescription className="text-gray-600">{currentPeriodLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={periodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke={colors.cyan}
                      strokeWidth={2}
                      dot={{ fill: colors.cyan, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors.cyan, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Compras */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Volume de Compras</CardTitle>
              <CardDescription className="text-gray-600">Distribuição por período - {currentPeriodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Compras']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="purchases" 
                    fill={colors.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performance de Produtos</CardTitle>
              <CardDescription className="text-gray-600">Métricas detalhadas por produto - {currentPeriodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Produto</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Views</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Add to Cart</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Compras</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Receita</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(topProducts || []).map((product, index) => (
                      <tr key={product.product_id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-yellow-400' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{product.product_name}</p>
                              <p className="text-sm text-gray-500">ID: {product.product_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatNumber(product.total_views)}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatNumber(product.total_add_to_cart)}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{formatNumber(product.total_purchases)}</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="font-semibold text-gray-900">{formatCurrency(product.total_revenue)}</span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <Badge 
                            variant={product.avg_conversion_rate > 0.5 ? "default" : "secondary"}
                            className={product.avg_conversion_rate > 0.5 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {(product.avg_conversion_rate || 0).toFixed(2)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Pizza - Distribuição de Receita */}
          {topProducts && topProducts.length > 0 && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Distribuição de Receita</CardTitle>
                <CardDescription className="text-gray-600">Por produto - {currentPeriodLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={topProducts.filter(p => p.total_revenue > 0)}
                      cx="50%"
                      cy="45%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total_revenue"
                    >
                      {topProducts.filter(p => p.total_revenue > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => `${entry.payload.product_name}: ${formatCurrency(entry.payload.total_revenue)}`}
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Fontes de Tráfego</CardTitle>
              <CardDescription className="text-gray-600">Análise de origem dos visitantes - {currentPeriodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Pizza */}
                {processedTrafficData.length > 0 && (
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">Distribuição de Sessões</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={processedTrafficData}
                          cx="50%"
                          cy="45%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="sessions"
                        >
                          {processedTrafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatNumber(value), 'Sessões']}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry) => `${entry.payload.source}: ${formatNumber(entry.payload.sessions)} sessões`}
                          wrapperStyle={{
                            paddingTop: '10px',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Tabela de Métricas */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Métricas Detalhadas</h3>
                  <div className="space-y-3">
                    {processedTrafficData.map((source, index) => (
                      <div key={source.source} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 capitalize">{source.source}</h4>
                          <Badge 
                            variant={source.rate > 0.5 ? "default" : "secondary"}
                            className={source.rate > 0.5 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {source.rate.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Sessões</p>
                            <p className="font-semibold text-gray-900">{formatNumber(source.sessions)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Conversões</p>
                            <p className="font-semibold text-gray-900">{formatNumber(source.conversions)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Receita</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(source.revenue)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Segmentação de Clientes</CardTitle>
              <CardDescription className="text-gray-600">Análise de comportamento e lifetime value - {currentPeriodLabel}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  A análise de segmentação de clientes será implementada quando os dados de customer lifetime value estiverem disponíveis.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

