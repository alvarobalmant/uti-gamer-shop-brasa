
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
import { Crown, Calendar, X, Plus, User, Search, Settings, Trash2 } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
}

interface ActiveSubscription {
  subscription_id: string;
  plan_name: string;
  discount_percentage: number;
  end_date: string;
}

interface UserWithSubscription extends UserProfile {
  subscription?: ActiveSubscription;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  discount_percentage: number;
}

const UserSubscriptionManager = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newEndDate, setNewEndDate] = useState('');
  const [newPlanId, setNewPlanId] = useState('');
  const [monthsToAdd, setMonthsToAdd] = useState(1);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar assinaturas ativas para cada usuário
      const usersWithSubscriptions: UserWithSubscription[] = [];
      
      for (const profile of profiles || []) {
        const { data: subscriptionData } = await supabase
          .rpc('get_active_subscription', { user_id: profile.id });

        const userWithSub: UserWithSubscription = {
          ...profile,
          subscription: subscriptionData?.[0] || undefined
        };
        
        usersWithSubscriptions.push(userWithSub);
      }

      setUsers(usersWithSubscriptions);
      setFilteredUsers(usersWithSubscriptions);
    } catch (error: any) {
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
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const cancelSubscription = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      toast({
        title: "Assinatura cancelada",
        description: "A assinatura foi cancelada com sucesso.",
      });

      fetchUsers();
      if (selectedUser?.id === userId) {
        const updatedUser = { ...selectedUser, subscription: undefined };
        setSelectedUser(updatedUser);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const extendSubscription = async (userId: string, additionalMonths: number) => {
    try {
      const user = users.find(u => u.id === userId);
      const currentEndDate = user?.subscription?.end_date 
        ? new Date(user.subscription.end_date)
        : new Date();

      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          end_date: newEndDate.toISOString(),
          status: 'active'
        })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      toast({
        title: "Assinatura estendida",
        description: `Assinatura estendida por ${additionalMonths} meses.`,
      });

      fetchUsers();
      // Atualizar o usuário selecionado se for o mesmo
      if (selectedUser?.id === userId) {
        const updatedUsers = await fetchUpdatedUser(userId);
        setSelectedUser(updatedUsers);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao estender assinatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUpdatedUser = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: subscriptionData } = await supabase
      .rpc('get_active_subscription', { user_id: userId });

    return {
      ...profile,
      subscription: subscriptionData?.[0] || undefined
    };
  };

  const createSubscription = async (userId: string, planId: string, endDate: string) => {
    try {
      // Primeiro cancelar assinatura ativa se existir
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Criar nova assinatura
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          end_date: endDate,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Assinatura criada",
        description: "Nova assinatura criada com sucesso.",
      });

      setNewEndDate('');
      setNewPlanId('');
      fetchUsers();
      
      // Atualizar usuário selecionado
      if (selectedUser?.id === userId) {
        const updatedUser = await fetchUpdatedUser(userId);
        setSelectedUser(updatedUser);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openUserModal = (user: UserWithSubscription) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setNewEndDate('');
    setNewPlanId('');
    setMonthsToAdd(1);
  };

  useEffect(() => {
    fetchUsers();
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

  const getStatusBadge = (subscription?: ActiveSubscription) => {
    if (!subscription) {
      return <Badge variant="secondary">Sem assinatura</Badge>;
    }

    const isActive = new Date(subscription.end_date) > new Date();
    
    if (isActive) {
      return <Badge className="bg-green-600"><Crown className="w-3 h-3 mr-1" />UTI PRO</Badge>;
    } else {
      return <Badge variant="destructive">Expirada</Badge>;
    }
  };

  const isSubscriptionActive = (subscription?: ActiveSubscription) => {
    return subscription && new Date(subscription.end_date) > new Date();
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
                    <p className="text-xl font-bold">{users.length}</p>
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
                      {users.filter(user => isSubscriptionActive(user.subscription)).length}
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
                      {users.filter(user => !user.subscription).length}
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
                  <TableHead>Expira em</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openUserModal(user)}>
                    <TableCell className="font-medium">{user.name || 'Nome não informado'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user.subscription)}</TableCell>
                    <TableCell>
                      {user.subscription ? user.subscription.plan_name : '-'}
                    </TableCell>
                    <TableCell>
                      {user.subscription ? formatDate(user.subscription.end_date) : '-'}
                    </TableCell>
                    <TableCell>
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserModal(user);
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

          {filteredUsers.length === 0 && (
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
                    <strong>Nome:</strong> {selectedUser.name || 'Não informado'}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Papel:</strong> <Badge variant="outline">{selectedUser.role}</Badge>
                  </div>
                  <div>
                    <strong>Cadastrado em:</strong> {formatDate(selectedUser.created_at)}
                  </div>
                </CardContent>
              </Card>

              {/* Status da Assinatura */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status da Assinatura UTI PRO</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUser.subscription ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <strong>Status:</strong> {getStatusBadge(selectedUser.subscription)}
                      </div>
                      <div>
                        <strong>Plano:</strong> {selectedUser.subscription.plan_name}
                      </div>
                      <div>
                        <strong>Desconto:</strong> {selectedUser.subscription.discount_percentage}%
                      </div>
                      <div>
                        <strong>Expira em:</strong> {formatDate(selectedUser.subscription.end_date)}
                      </div>
                      
                      {/* Ações para assinatura ativa */}
                      {isSubscriptionActive(selectedUser.subscription) && (
                        <div className="flex gap-2 pt-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="12"
                              value={monthsToAdd}
                              onChange={(e) => setMonthsToAdd(parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                            <Button
                              size="sm"
                              onClick={() => extendSubscription(selectedUser.id, monthsToAdd)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar Meses
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelSubscription(selectedUser.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancelar Assinatura
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">Este usuário não possui assinatura UTI PRO ativa.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Criar Nova Assinatura */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedUser.subscription ? 'Alterar Assinatura' : 'Criar Assinatura UTI PRO'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Plano</label>
                    <Select value={newPlanId} onValueChange={setNewPlanId}>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Expiração</label>
                    <Input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={() => createSubscription(selectedUser.id, newPlanId, newEndDate)}
                    disabled={!newPlanId || !newEndDate}
                    className="w-full"
                  >
                    {selectedUser.subscription ? 'Alterar Assinatura' : 'Criar Assinatura'}
                  </Button>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeUserModal} className="flex-1">
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

export default UserSubscriptionManager;
