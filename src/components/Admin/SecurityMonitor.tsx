
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityEvent, SecurityStats } from '@/types/security';

const SecurityMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    failedLogins: 0,
    successfulLogins: 0,
    blockedAccounts: 0,
    adminLogins: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      setHasError(false);
      
      // Buscar eventos da tabela security_audit_log com tratamento de erro melhorado
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) {
        console.warn('Aviso: Erro ao buscar eventos de segurança:', eventsError);
        setHasError(true);
        
        // Não mostrar toast se for problema de permissão (comum durante inicialização)
        if (!eventsError.message?.includes('permission') && !eventsError.message?.includes('RLS')) {
          toast({
            title: "Aviso: Eventos de segurança indisponíveis",
            description: "O monitor continuará funcionando quando o sistema estiver configurado.",
            variant: "default",
          });
        }
        
        setEvents([]);
        setStats({
          totalEvents: 0,
          failedLogins: 0,
          successfulLogins: 0,
          blockedAccounts: 0,
          adminLogins: 0
        });
        return;
      }

      // Processar dados com verificação de tipo melhorada
      const typedEvents: SecurityEvent[] = Array.isArray(eventsData) 
        ? eventsData.filter((event: any): event is any => 
            event !== null && 
            event !== undefined &&
            typeof event === 'object' && 
            typeof event.id === 'string' &&
            typeof event.event_type === 'string' && 
            typeof event.created_at === 'string'
          ).map((event: any) => ({
            id: event.id as string,
            event_type: event.event_type as string,
            user_id: event.user_id as string | undefined,
            details: (event.details as any) || {},
            created_at: event.created_at as string
          }))
        : [];

      setEvents(typedEvents);

      // Calcular estatísticas dos eventos
      const eventStats = typedEvents.reduce((acc, event) => {
        acc.totalEvents++;
        
        switch (event.event_type) {
          case 'failed_login_attempt':
            acc.failedLogins++;
            break;
          case 'user_login_success':
            acc.successfulLogins++;
            break;
          case 'admin_login_success':
            acc.adminLogins++;
            acc.successfulLogins++;
            break;
          case 'account_temporarily_blocked':
            acc.blockedAccounts++;
            break;
        }
        
        return acc;
      }, {
        totalEvents: 0,
        failedLogins: 0,
        successfulLogins: 0,
        blockedAccounts: 0,
        adminLogins: 0
      });

      setStats(eventStats);
    } catch (error: any) {
      console.warn('Aviso: Erro ao buscar eventos de segurança:', error);
      setHasError(true);
      setEvents([]);
      setStats({
        totalEvents: 0,
        failedLogins: 0,
        successfulLogins: 0,
        blockedAccounts: 0,
        adminLogins: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Aguardar um pouco antes de buscar para evitar problemas de inicialização
    const timer = setTimeout(() => {
      fetchSecurityEvents();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getEventBadgeColor = (eventType: string): string => {
    switch (eventType) {
      case 'failed_login_attempt':
      case 'account_temporarily_blocked':
        return 'destructive';
      case 'admin_login_success':
        return 'default';
      case 'user_login_success':
      case 'signup_success':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'failed_login_attempt':
      case 'account_temporarily_blocked':
        return <AlertTriangle className="h-4 w-4" />;
      case 'admin_login_success':
        return <Shield className="h-4 w-4" />;
      case 'user_login_success':
      case 'signup_success':
        return <Activity className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const formatEventDetails = (event: SecurityEvent): string => {
    const details = event.details || {};
    
    switch (event.event_type) {
      case 'failed_login_attempt':
        return `Email: ${details.email}, Tentativa: ${details.attempt_number}`;
      case 'admin_login_success':
      case 'user_login_success':
        return `Email: ${details.email}`;
      case 'account_temporarily_blocked':
        return `Email: ${details.email}, Total: ${details.total_attempts} tentativas`;
      case 'signup_success':
      case 'signup_failed':
        return `Email: ${details.email}`;
      default:
        return JSON.stringify(details).substring(0, 100);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Monitor de Segurança
              </CardTitle>
              <CardDescription className="text-gray-400">
                Monitoramento em tempo real de eventos de segurança do sistema
              </CardDescription>
            </div>
            <Button 
              onClick={fetchSecurityEvents} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Security Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.totalEvents}</div>
              <div className="text-sm text-gray-400">Total de Eventos</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{stats.successfulLogins}</div>
              <div className="text-sm text-gray-400">Logins Bem-sucedidos</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">{stats.failedLogins}</div>
              <div className="text-sm text-gray-400">Tentativas Falharam</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.blockedAccounts}</div>
              <div className="text-sm text-gray-400">Contas Bloqueadas</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.adminLogins}</div>
              <div className="text-sm text-gray-400">Logins Admin</div>
            </div>
          </div>

          {/* System Status Alert */}
          {hasError && (
            <Alert className="bg-yellow-900/50 border-yellow-700 mb-4">
              <Shield className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <strong>Sistema de Auditoria:</strong> Configurando sistema de segurança. 
                Os eventos aparecerão aqui quando o sistema estiver completamente configurado.
              </AlertDescription>
            </Alert>
          )}

          {/* Critical Security Alert */}
          {!hasError && stats.failedLogins > 10 && (
            <Alert className="bg-red-900/50 border-red-700 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>Alerta de Segurança:</strong> Muitas tentativas de login falharam detectadas ({stats.failedLogins}). 
                Considere revisar os logs e implementar medidas adicionais se necessário.
              </AlertDescription>
            </Alert>
          )}

          {/* Security Events */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Eventos Recentes</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-400">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                Carregando eventos de segurança...
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <p>{hasError ? 'Sistema de auditoria configurando...' : 'Nenhum evento de segurança encontrado'}</p>
                <p className="text-sm mt-1">Os eventos aparecerão aqui conforme ocorrem no sistema</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-700 p-3 rounded-lg flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getEventBadgeColor(event.event_type) as any}>
                            {event.event_type.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(event.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-300">
                          {formatEventDetails(event)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
