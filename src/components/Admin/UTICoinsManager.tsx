import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Plus, Minus, Search, User, TrendingUp, TrendingDown } from 'lucide-react';

interface UserCoins {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  login_streak: number;
  streak_multiplier: number;
  last_daily_login: string | null;
  profile?: {
    name: string;
    email: string;
  };
}

export const UTICoinsManager = () => {
  const [users, setUsers] = useState<UserCoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [coinAmount, setCoinAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar dados de moedas dos usuários
      const { data: coinsData, error: coinsError } = await supabase
        .from('user_coins')
        .select('*');

      if (coinsError) {
        console.error('Erro ao carregar dados de moedas:', coinsError);
        return;
      }

      // Buscar perfis dos usuários
      const userIds = coinsData?.map(coin => coin.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const formattedUsers = coinsData?.map(coin => ({
        ...coin,
        balance: coin.balance || 0,
        total_earned: coin.total_earned || 0,
        total_spent: coin.total_spent || 0,
        login_streak: coin.login_streak || 0,
        streak_multiplier: coin.streak_multiplier || 1,
        last_daily_login: coin.last_daily_login,
        profile: profilesData?.find(profile => profile.id === coin.user_id) || {
          name: 'Usuário sem nome',
          email: 'Email não encontrado'
        }
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao carregar dados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const adjustCoins = async (userId: string, amount: number, operation: 'add' | 'subtract') => {
    if (!userId || !amount || amount <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um usuário e insira um valor válido.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);

      // Atualizar saldo diretamente na tabela user_coins
      const finalAmount = operation === 'subtract' ? -amount : amount;
      
      const { error } = await supabase.rpc('earn_coins', {
        p_user_id: userId,
        p_action: operation === 'add' ? 'admin_bonus' : 'admin_deduction',
        p_amount: Math.abs(finalAmount),
        p_description: `Ajuste manual pelo admin: ${operation === 'add' ? '+' : '-'}${amount} moedas`
      });

      if (error) {
        console.error('Erro ao ajustar moedas:', error);
        toast({
          title: 'Erro',
          description: `Erro ao ${operation === 'add' ? 'adicionar' : 'subtrair'} moedas.`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: `${operation === 'add' ? 'Adicionadas' : 'Subtraídas'} ${amount} moedas com sucesso!`,
      });

      await loadUsers();
      setCoinAmount('');
      setSelectedUser(null);

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao processar a operação.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCoins = users.reduce((sum, user) => sum + user.balance, 0);
  const totalEarned = users.reduce((sum, user) => sum + user.total_earned, 0);
  const totalSpent = users.reduce((sum, user) => sum + user.total_spent, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Gerenciador de UTI Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moedas em Circulação</p>
                <p className="text-2xl font-bold">{totalCoins.toLocaleString()}</p>
              </div>
              <Coins className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ganho</p>
                <p className="text-2xl font-bold text-green-600">{totalEarned.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold text-red-600">{totalSpent.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ajuste de Moedas */}
      <Card>
        <CardHeader>
          <CardTitle>Ajustar Moedas do Usuário</CardTitle>
          <CardDescription>
            Adicione ou remova moedas de usuários específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Quantidade de moedas"
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(e.target.value)}
              className="flex-1"
              min="1"
            />
            <Button
              onClick={() => adjustCoins(selectedUser!, parseInt(coinAmount), 'add')}
              disabled={!selectedUser || !coinAmount || processing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
            <Button
              onClick={() => adjustCoins(selectedUser!, parseInt(coinAmount), 'subtract')}
              disabled={!selectedUser || !coinAmount || processing}
              variant="destructive"
            >
              <Minus className="h-4 w-4 mr-2" />
              Subtrair
            </Button>
          </div>
          {selectedUser && (
            <div className="text-sm text-muted-foreground">
              Usuário selecionado: {users.find(u => u.user_id === selectedUser)?.profile?.name}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Usuários e Moedas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Nenhum usuário encontrado.' : 'Nenhum usuário encontrado.'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.user_id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedUser === user.user_id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                   onClick={() => setSelectedUser(user.user_id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{user.profile?.name}</h4>
                      {user.login_streak > 0 && (
                        <Badge variant="outline">
                          🔥 {user.login_streak} dias
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.profile?.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-lg">{user.balance.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ganho: {user.total_earned.toLocaleString()} • Gasto: {user.total_spent.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};