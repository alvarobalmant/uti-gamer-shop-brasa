/**
 * MODAL DE DETALHES DO CLIENTE - Perfil individual completo
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Clock, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  MapPin, 
  Smartphone,
  Calendar,
  DollarSign,
  Target,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useEnterpriseAnalytics } from '@/hooks/useEnterpriseAnalytics';

interface CustomerDetailsModalProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  sessionId,
  isOpen,
  onClose
}) => {
  const { getCustomerProfile, loading } = useEnterpriseAnalytics();
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && sessionId) {
      loadCustomerData();
    }
  }, [isOpen, sessionId]);

  const loadCustomerData = async () => {
    const data = await getCustomerProfile(sessionId);
    setCustomerData(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!customerData && !loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil Detalhado do Cliente
              </DialogTitle>
              <DialogDescription>
                Análise comportamental completa e histórico de interações
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando perfil do cliente...</p>
            </div>
          </div>
        ) : customerData ? (
          <div className="space-y-6">
            {/* Resumo do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Primeira Visita</span>
                  </div>
                  <p className="text-lg font-bold">
                    {formatDate(customerData.first_seen)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tempo Total</span>
                  </div>
                  <p className="text-lg font-bold">
                    {formatDuration(customerData.total_time_spent)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor Vitalício</span>
                  </div>
                  <p className="text-lg font-bold">
                    {formatCurrency(customerData.lifetime_value)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Segmento</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {customerData.behavior_segment}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Abas de Detalhes */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="journey">Jornada</TabsTrigger>
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="funnel">Funil</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estatísticas Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total de Sessões:</span>
                        <span className="font-bold">{customerData.total_sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última Visita:</span>
                        <span className="font-bold">{formatDate(customerData.last_seen)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo Médio por Sessão:</span>
                        <span className="font-bold">
                          {formatDuration(customerData.total_time_spent / customerData.total_sessions)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Padrões de Comportamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Engajamento</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Probabilidade de Compra</span>
                          <span>72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Risco de Churn</span>
                          <span>23%</span>
                        </div>
                        <Progress value={23} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="journey" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline da Jornada</CardTitle>
                    <CardDescription>
                      Histórico cronológico de todas as interações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {customerData.journey_timeline.map((event: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Eye className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{event.action}</span>
                              <Badge variant="outline" className="text-xs">
                                {formatDate(event.timestamp)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {event.details.page || event.details.url}
                            </p>
                            {event.details.time_spent && (
                              <p className="text-xs text-muted-foreground">
                                Tempo: {formatDuration(event.details.time_spent)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos Favoritos</CardTitle>
                    <CardDescription>
                      Produtos mais visualizados e interações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customerData.favorite_products.map((product: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{product.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {product.product_id}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="font-bold">{product.views}</div>
                                <div className="text-xs text-muted-foreground">visualizações</div>
                              </div>
                              <div className="text-center">
                                <div className="font-bold text-success">{product.purchases}</div>
                                <div className="text-xs text-muted-foreground">compras</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funnel" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Funil de Conversão Pessoal</CardTitle>
                    <CardDescription>
                      Progresso do cliente através das etapas de conversão
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(customerData.conversion_funnel).map(([stage, count]) => (
                        <div key={stage} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize font-medium">{stage}</span>
                            <span className="font-bold">{count as number} interações</span>
                          </div>
                          <Progress 
                            value={Math.min(100, ((count as number) / 10) * 100)} 
                            className="h-3" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Não foi possível carregar os dados do cliente
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};