import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, TrendingUp, Users, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { AnalyticsFilters } from './AnalyticsFilters';
import { DashboardCharts } from './DashboardCharts';
import { ProductAnalyticsTable } from './ProductAnalyticsTable';
import { CustomerSegmentChart } from './CustomerSegmentChart';
import { TrafficSourceChart } from './TrafficSourceChart';
import { WhatsAppAnalytics } from './WhatsAppAnalytics';
import { AnalyticsConfigPanel } from './AnalyticsConfigPanel';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

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

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    endDate: new Date()
  });

  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, [dateRange]);

  const refreshData = async () => {
    setRefreshing(true);
    setError(null);

    const filters = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      compareWith: compareRange || undefined
    };

    try {
      await Promise.all([
        fetchDashboardAnalytics(filters),
        fetchTopProducts(filters),
        fetchCustomerSegments(filters),
        fetchTrafficAnalytics(filters)
      ]);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    const filters = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      compareWith: compareRange || undefined
    };
    await exportData(filters, format);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const formatPercentage = (value: number) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive text-center">
              <p className="font-semibold">Erro ao carregar analytics</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
              <Button onClick={refreshData} className="mt-4" variant="outline">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Painel de Configuração */}
      <AnalyticsConfigPanel />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Análise completa de comportamento e vendas
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={refreshData}
            disabled={loading || refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            onClick={() => handleExport('csv')}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          
          <Button
            onClick={() => handleExport('json')}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <AnalyticsFilters
        dateRange={dateRange}
        compareRange={compareRange}
        onDateRangeChange={setDateRange}
        onCompareRangeChange={setCompareRange}
        loading={loading}
      />

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? formatCurrency(dashboardData.total_revenue) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ticket médio: {dashboardData ? formatCurrency(dashboardData.avg_order_value) : formatCurrency(0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? formatNumber(dashboardData.total_sessions) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Conversão: {dashboardData ? formatPercentage(dashboardData.avg_conversion_rate) : '0.00%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? formatNumber(dashboardData.total_purchases) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Abandono carrinho: {dashboardData ? formatPercentage(dashboardData.cart_abandonment_rate) : '0.00%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? formatNumber(dashboardData.whatsapp_clicks) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Cliques no período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas principais */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="traffic">Tráfego</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardCharts
            data={dashboardData}
            loading={loading}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductAnalyticsTable
            products={topProducts}
            loading={loading}
            onRefresh={refreshData}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerSegmentChart
              segments={customerSegments}
              loading={loading}
            />
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Clientes</CardTitle>
                <CardDescription>
                  Estatísticas por segmento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium capitalize">{segment.segment}</p>
                        <p className="text-sm text-muted-foreground">
                          {segment.count} clientes ({formatPercentage(segment.percentage)})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(segment.total_revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          AOV: {formatCurrency(segment.avg_order_value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficSourceChart
              trafficData={trafficData}
              loading={loading}
            />
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>
                  Performance por canal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trafficData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium capitalize">{source.source}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(source.sessions)} sessões
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={source.conversion_rate > 5 ? "default" : "secondary"}>
                          {formatPercentage(source.conversion_rate)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(source.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <WhatsAppAnalytics
            data={dashboardData}
            loading={loading}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};