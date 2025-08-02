
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Crown, Calendar, X, Plus, User, Search, Settings, CalendarMinus, UserPlus } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  data_cadastro: string;
  plano?: string;
  status_assinatura: string;
  desconto?: number;
  data_expiracao?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  discount_percentage: number;
}

const UserSubscriptionManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [monthsToAdd, setMonthsToAdd] = useState(1);
  const [monthsToRemove, setMonthsToRemove] = useState(1);
  const [newPlanId, setNewPlanId] = useState('');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      console.log('Carregando usuários da tabela usuarios...');
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      console.log('Usuários carregados:', data?.length);
      setUsuarios(data || []);
      setFilteredUsuarios(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar planos:', error);
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filterUsers = (search: string) => {
    setSearchTerm(search);
    if (!search.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }

    const filtered = usuarios.filter(user =>
      user.nome?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsuarios(filtered);
  };

  const adicionarMeses = async (userId: string, meses: number) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      console.log(`Adicionando ${meses} meses para usuário ${userId}`);

      const { data, error } = await supabase.rpc('adicionar_meses_assinatura', {
        user_id: userId,
        meses: meses
      });

      if (error) {
        console.error('Erro ao adicionar meses:', error);
        throw error;
      }

      if (data) {
        toast({
          title: "Assinatura estendida",
          description: `${meses} meses adicionados com sucesso.`,
        });
        
        await fetchUsuarios();
        if (selectedUser?.id === userId) {
          const updatedUser = usuarios.find(u => u.id === userId);
          if (updatedUser) setSelectedUser(updatedUser);
        }
      } else {
        throw new Error('Falha ao estender assinatura');
      }
    } catch (error: any) {
      console.error('Erro ao adicionar meses:', error);
      toast({
        title: "Erro ao estender assinatura",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const removerMeses = async (userId: string, meses: number) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      console.log(`Removendo ${meses} meses do usuário ${userId}`);

      const { data, error } = await supabase.rpc('remover_meses_assinatura', {
        user_id: userId,
        meses: meses
      });

      if (error) {
        console.error('Erro ao remover meses:', error);
        throw error;
      }

      if (data) {
        toast({
          title: "Assinatura reduzida",
          description: `${meses} meses removidos com sucesso.`,
        });
        
        await fetchUsuarios();
        if (selectedUser?.id === userId) {
          const updatedUser = usuarios.find(u => u.id === userId);
          if (updatedUser) setSelectedUser(updatedUser);
        }
      } else {
        throw new Error('Falha ao reduzir assinatura');
      }
    } catch (error: any) {
      console.error('Erro ao remover meses:', error);
      toast({
        title: "Erro ao reduzir assinatura",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const cancelarAssinatura = async (userId: string) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      console.log(`Cancelando assinatura do usuário ${userId}`);

      const { data, error } = await supabase.rpc('cancelar_assinatura', {
        user_id: userId
      });

      if (error) {
        console.error('Erro ao cancelar assinatura:', error);
        throw error;
      }

      if (data) {
        // Também cancelar no user_subscriptions
        await supabase
          .from('user_subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('status', 'active');

        toast({
          title: "Assinatura cancelada",
          description: "A assinatura foi cancelada com sucesso.",
        });
        
        await fetchUsuarios();
        if (selectedUser?.id === userId) {
          const updatedUser = usuarios.find(u => u.id === userId);
          if (updatedUser) setSelectedUser(updatedUser);
        }
      } else {
        throw new Error('Falha ao cancelar assinatura');
      }
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const createSubscription = async (userId: string, planId: string) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      console.log(`Criando assinatura para usuário ${userId} com plano ${planId}`);

      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plano não encontrado');

      // Calcular data de expiração automaticamente
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      console.log('Data de expiração calculada:', endDate.toISOString());

      // Primeiro, cancelar todas as assinaturas ativas existentes no user_subscriptions
      const { data: existingSubscriptions, error: checkError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (checkError) {
        console.error('Erro ao verificar assinaturas existentes:', checkError);
        throw checkError;
      }

      // Cancelar assinaturas existentes se houver
      if (existingSubscriptions && existingSubscriptions.length > 0) {
        console.log('Cancelando assinaturas existentes:', existingSubscriptions.length);
        
        for (const sub of existingSubscriptions) {
          await supabase
            .from('user_subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', sub.id);
        }
      }

      // Criar nova assinatura no user_subscriptions
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          end_date: endDate.toISOString(),
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erro ao inserir nova assinatura:', insertError);
        throw insertError;
      }

      // Atualizar tabela usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .upsert({
          id: userId,
          nome: selectedUser?.nome || 'Usuário',
          email: selectedUser?.email || '',
          papel: selectedUser?.papel || 'user',
          status_assinatura: 'Ativo',
          plano: plan.name,
          desconto: plan.discount_percentage,
          data_expiracao: endDate.toISOString()
        });

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        throw updateError;
      }

      console.log('Assinatura criada com sucesso');

      toast({
        title: "Assinatura criada",
        description: `Nova assinatura criada com sucesso. Expira em ${endDate.toLocaleDateString('pt-BR')}.`,
      });

      setNewPlanId('');
      
      await fetchUsuarios();
      if (selectedUser?.id === userId) {
        const updatedUser = usuarios.find(u => u.id === userId);
        if (updatedUser) setSelectedUser(updatedUser);
      }
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      toast({
        title: "Erro ao criar assinatura",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const openUserModal = (user: Usuario) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setNewPlanId('');
    setMonthsToAdd(1);
    setMonthsToRemove(1);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPlans();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (usuario: Usuario) => {
    const isActive = usuario.status_assinatura === 'Ativo' && 
                    usuario.data_expiracao && 
                    new Date(usuario.data_expiracao) > new Date();
    
    if (isActive) {
      return <Badge className="bg-green-600"><Crown className="w-3 h-3 mr-1" />UTI PRO</Badge>;
    } else if (usuario.status_assinatura === 'Cancelado') {
      return <Badge variant="destructive">Cancelada</Badge>;
    } else {
      return <Badge variant="secondary">Sem assinatura</Badge>;
    }
  };

  const isSubscriptionActive = (usuario: Usuario) => {
    return usuario.status_assinatura === 'Ativo' && 
           usuario.data_expiracao && 
           new Date(usuario.data_expiracao) > new Date();
  };

  const getCalculatedExpirationDate = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration_months);
    return endDate;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários e Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários e Assinaturas</CardTitle>
          <CardDescription>
            Gerencie todos os usuários cadastrados e suas assinaturas UTI PRO
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de Pesquisa */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => filterUsers(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total de Usuários</p>
                    <p className="text-xl font-bold">{usuarios.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Assinantes UTI PRO</p>
                    <p className="text-xl font-bold">
                      {usuarios.filter(user => isSubscriptionActive(user)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sem Assinatura</p>
                    <p className="text-xl font-bold">
                      {usuarios.filter(user => !isSubscriptionActive(user)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openUserModal(usuario)}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{getStatusBadge(usuario)}</TableCell>
                    <TableCell>{usuario.plano || '-'}</TableCell>
                    <TableCell>{usuario.desconto ? `${usuario.desconto}%` : '-'}</TableCell>
                    <TableCell>
                      {usuario.data_expiracao ? formatDate(usuario.data_expiracao) : '-'}
                    </TableCell>
                    <TableCell>{formatDate(usuario.data_cadastro)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserModal(usuario);
                          }}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Gerenciar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum usuário encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Usuário</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Informações do Usuário */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Usuário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Nome:</strong> {selectedUser.nome}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Papel:</strong> <Badge variant="outline">{selectedUser.papel}</Badge>
                  </div>
                  <div>
                    <strong>Cadastrado em:</strong> {formatDate(selectedUser.data_cadastro)}
                  </div>
                </CardContent>
              </Card>

              {/* Status da Assinatura */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status da Assinatura UTI PRO</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <strong>Status:</strong> {getStatusBadge(selectedUser)}
                    </div>
                    <div>
                      <strong>Plano:</strong> {selectedUser.plano || 'Nenhum'}
                    </div>
                    <div>
                      <strong>Desconto:</strong> {selectedUser.desconto ? `${selectedUser.desconto}%` : '0%'}
                    </div>
                    <div>
                      <strong>Expira em:</strong> {selectedUser.data_expiracao ? formatDate(selectedUser.data_expiracao) : 'N/A'}
                    </div>
                    
                    {/* Ações para assinatura ativa */}
                    {isSubscriptionActive(selectedUser) && (
                      <div className="space-y-4 pt-4 border-t">
                        {/* Adicionar Meses */}
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            value={monthsToAdd}
                            onChange={(e) => setMonthsToAdd(parseInt(e.target.value) || 1)}
                            className="w-20"
                            disabled={processing}
                          />
                          <Button
                            size="sm"
                            onClick={() => adicionarMeses(selectedUser.id, monthsToAdd)}
                            disabled={processing}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {processing ? 'Processando...' : 'Adicionar Meses'}
                          </Button>
                        </div>

                        {/* Remover Meses */}
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            value={monthsToRemove}
                            onChange={(e) => setMonthsToRemove(parseInt(e.target.value) || 1)}
                            className="w-20"
                            disabled={processing}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removerMeses(selectedUser.id, monthsToRemove)}
                            disabled={processing}
                          >
                            <CalendarMinus className="w-3 h-3 mr-1" />
                            {processing ? 'Processando...' : 'Remover Meses'}
                          </Button>
                        </div>

                        {/* Cancelar Assinatura */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelarAssinatura(selectedUser.id)}
                          disabled={processing}
                          className="w-full"
                        >
                          <X className="w-3 h-3 mr-1" />
                          {processing ? 'Processando...' : 'Cancelar Assinatura'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Criar Nova Assinatura */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isSubscriptionActive(selectedUser) ? 'Alterar Assinatura' : 'Criar Assinatura UTI PRO'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plano</label>
                    <Select value={newPlanId} onValueChange={setNewPlanId} disabled={processing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - R$ {plan.price.toFixed(2)} ({plan.duration_months} meses)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exibir data de expiração calculada */}
                  {newPlanId && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Data de Expiração Calculada:</span>
                      </div>
                      <p className="text-blue-700 mt-1">
                        {getCalculatedExpirationDate(newPlanId)?.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-blue-600 text-sm mt-2">
                        * A data será automaticamente calculada com base na duração do plano selecionado
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => createSubscription(selectedUser.id, newPlanId)}
                    disabled={!newPlanId || processing}
                    className="w-full"
                  >
                    {processing ? 'Processando...' : isSubscriptionActive(selectedUser) ? 'Alterar Assinatura' : 'Criar Assinatura'}
                  </Button>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeUserModal} className="flex-1" disabled={processing}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSubscriptionManagement;
