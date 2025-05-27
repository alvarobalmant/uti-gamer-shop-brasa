
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Crown, Calendar, X, Plus } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UserSubscription {
  id: string;
  plan_name: string;
  status: string;
  end_date: string;
  discount_percentage: number;
}

interface UserWithSubscription extends UserProfile {
  subscription?: UserSubscription;
}

const UserSubscriptionManager = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newEndDate, setNewEndDate] = useState('');
  const [newPlanId, setNewPlanId] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
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
    } catch (error: any) {
      toast({
        title: "Erro ao estender assinatura",
        description: error.message,
        variant: "destructive",
      });
    }
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

      setSelectedUser(null);
      setNewEndDate('');
      setNewPlanId('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (subscription?: UserSubscription) => {
    if (!subscription) {
      return <Badge variant="secondary">Sem assinatura</Badge>;
    }

    const isActive = subscription.status === 'active' && new Date(subscription.end_date) > new Date();
    
    if (isActive) {
      return <Badge className="bg-green-600"><Crown className="w-3 h-3 mr-1" />UTI PRO</Badge>;
    } else {
      return <Badge variant="destructive">Expirada</Badge>;
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários e Assinaturas</CardTitle>
        <CardDescription>
          Gerencie todos os usuários cadastrados e suas assinaturas UTI PRO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
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
                    <div className="flex gap-2">
                      {user.subscription?.status === 'active' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => extendSubscription(user.id, 1)}
                          >
                            <Plus className="w-3 h-3 mr-1" />+1 mês
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelSubscription(user.id)}
                          >
                            <X className="w-3 h-3 mr-1" />Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <Crown className="w-3 h-3 mr-1" />Ativar PRO
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal para criar nova assinatura */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Criar Assinatura UTI PRO</CardTitle>
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
                          {plan.name} - R$ {plan.price.toFixed(2)}
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

                <div className="flex gap-2">
                  <Button
                    onClick={() => createSubscription(selectedUser, newPlanId, newEndDate)}
                    disabled={!newPlanId || !newEndDate}
                    className="flex-1"
                  >
                    Criar Assinatura
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(null);
                      setNewEndDate('');
                      setNewPlanId('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSubscriptionManager;
