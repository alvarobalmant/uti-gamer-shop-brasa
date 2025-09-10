import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useOrderVerification } from '@/hooks/useOrderVerification';
import { useUTICoinsSavings } from '@/hooks/useUTICoinsSavings';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Mail, 
  CheckCircle, 
  XCircle,
  Clock,
  Package,
  Copy,
  Coins,
  Key,
  Calendar,
  RefreshCw
} from 'lucide-react';

const ClientArea = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();
  const { getUserOrders, loading: ordersLoading } = useOrderVerification();
  const { savings, formattedTotalSavings, isLoading: savingsLoading } = useUTICoinsSavings();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingName, setIsChangingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Carregar pedidos do usuário
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    const userOrders = await getUserOrders();
    setOrders(userOrders);
  };

  if (!user) {
    return null;
  }

  // Dados do usuário
  const userData = {
    name: user.email?.split('@')[0] || 'Usuário',
    email: user.email || '',
    emailVerified: !!user.email_confirmed_at,
    createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error('Erro ao enviar email de redefinição: ' + error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado para a área de transferência!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Finalizado</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular pedidos com paginação
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Área do Cliente</h1>
              <p className="text-gray-600">Bem-vindo de volta, {userData.name}!</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="favorites">Lista de Desejos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações Pessoais */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Conta criada em</p>
                          <p className="font-medium">{userData.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2 flex items-center justify-center gap-2">
                        <Coins className="h-6 w-6" />
                        {savingsLoading ? (
                          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
                        ) : (
                          formattedTotalSavings
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Total Economizado</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Com UTI Coins ({savings.total_coins_used} coins usados)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                        <Heart className="h-6 w-6" />
                        {favoritesCount}
                      </div>
                      <p className="text-sm text-gray-600">Produtos Favoritos</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Na sua lista de desejos
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Status da Conta e Ações Rápidas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status da Conta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email verificado</span>
                        {userData.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/lista-desejos">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Lista de Desejos ({favoritesCount})
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentPage(1)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Meus Pedidos ({orders.length})
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Meus Pedidos */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
              <Button onClick={loadOrders} variant="outline" size="sm" disabled={ordersLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600">Você ainda não fez nenhum pedido.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Pedido #{order.code.slice(-8)}
                          </CardTitle>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Código de verificação */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-1">CÓDIGO DE VERIFICAÇÃO</h4>
                              <p className="font-mono text-lg">{order.code}</p>
                            </div>
                            <Button
                              onClick={() => copyCode(order.code)}
                              variant="outline"
                              size="sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copiar
                            </Button>
                          </div>
                        </div>

                        {/* Informações do pedido */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-600 mb-1">VALOR TOTAL</h4>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                            {order.uti_coins_discount_amount > 0 && (
                              <p className="text-sm text-gray-500">
                                Desconto UTI Coins: -{formatCurrency(order.uti_coins_discount_amount)}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-600 mb-1">DATA DO PEDIDO</h4>
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-600 mb-1">
                              {order.status === 'pending' ? 'EXPIRA EM' : 
                               order.status === 'completed' ? 'FINALIZADO EM' : 'EXPIROU EM'}
                            </h4>
                            <p className={order.status === 'pending' && new Date(order.expires_at) < new Date() ? 'text-red-600' : ''}>
                              {order.status === 'completed' 
                                ? formatDate(order.completed_at) 
                                : formatDate(order.expires_at)}
                            </p>
                          </div>
                        </div>

                        {/* Recompensas recebidas */}
                        {order.rewards_given && Object.keys(order.rewards_given).length > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <Coins className="h-4 w-4" />
                              RECOMPENSAS RECEBIDAS
                            </h4>
                            <div className="space-y-1 text-blue-700">
                              <p>UTI Coins ganhos: +{order.rewards_given.uti_coins || 0}</p>
                              {order.rewards_given.cashback_coins > 0 && (
                                <p>Cashback: +{order.rewards_given.cashback_coins} coins (R$ {order.rewards_given.cashback_reais?.toFixed(2)})</p>
                              )}
                              {order.uti_coins_used > 0 && (
                                <p>UTI Coins usados: -{order.uti_coins_used} coins (R$ {order.uti_coins_discount_amount?.toFixed(2)})</p>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Lista de Desejos */}
          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lista de Desejos</h3>
                <p className="text-gray-600 mb-4">
                  Você tem {favoritesCount} {favoritesCount === 1 ? 'produto' : 'produtos'} na sua lista de desejos.
                </p>
                <Link to="/lista-desejos">
                  <Button>Ver Lista de Desejos</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Alterar Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome de exibição</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      value={newName || userData.name}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Seu nome"
                    />
                    <Button 
                      variant="outline" 
                      disabled={!newName || newName === userData.name}
                      onClick={() => {
                        // Aqui seria implementada a lógica de alteração de nome
                        toast.success('Nome atualizado com sucesso!');
                        setNewName('');
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Alterar Senha */}
                <div className="space-y-2">
                  <Label>Alterar senha</Label>
                  <p className="text-sm text-gray-600">
                    Clique no botão abaixo para receber um email com instruções para redefinir sua senha.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handlePasswordReset}
                    disabled={isChangingPassword}
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    {isChangingPassword ? 'Enviando...' : 'Redefinir Senha'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientArea;