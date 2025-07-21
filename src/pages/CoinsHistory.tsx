import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUTICoins } from '@/hooks/useUTICoins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Coins, 
  History, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent';
  reason: string;
  description: string;
  created_at: string;
  metadata: any;
}

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  streak_multiplier: number;
  last_login_date: string;
}

const CoinsHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coins } = useUTICoins();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // Carregar transações
      const { data: transactionsData, error: transError } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (transError) throw transError;

      const formattedTransactions: Transaction[] = (transactionsData || []).map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type as 'earned' | 'spent',
        reason: t.reason,
        description: t.description,
        created_at: t.created_at,
        metadata: t.metadata
      }));

      setTransactions(formattedTransactions);

      // Carregar dados de streak
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (!streakError && streakData) {
        setStreak(streakData);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'daily_login': return '🎯';
      case 'scroll_page': return '📜';
      case 'purchase': return '🛒';
      case 'review': return '⭐';
      case 'social_share': return '📱';
      case 'product_redemption': return '🎁';
      default: return '💰';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <History className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <History className="w-8 h-8" />
                  Histórico UTI Coins
                </h1>
                <p className="opacity-90">Acompanhe todas as suas transações</p>
              </div>
            </div>
            
            {/* Saldo atual */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  {coins.balance.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">Saldo atual</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Estatísticas */}
          <div className="lg:col-span-1 space-y-4">
            {/* Resumo de moedas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Saldo Atual:</span>
                  <span className="font-semibold">{coins.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Ganho:</span>
                  <span className="font-semibold text-green-600">{coins.totalEarned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Gasto:</span>
                  <span className="font-semibold text-red-600">{coins.totalSpent.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Streak info */}
            {streak && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🔥 Sequência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Atual:</span>
                    <span className="font-semibold">{streak.current_streak} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recorde:</span>
                    <span className="font-semibold">{streak.longest_streak} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Multiplicador:</span>
                    <span className="font-semibold text-purple-600">{streak.streak_multiplier}x</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="earned">Ganhos</SelectItem>
                    <SelectItem value="spent">Gastos</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Lista de transações */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Transações ({filteredTransactions.length})
                  </CardTitle>
                  {/* Futuramente pode adicionar botão de exportar */}
                </div>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma transação encontrada</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="text-sm">
                            {formatDate(transaction.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.type === 'earned' ? 'default' : 'secondary'}
                              className={transaction.type === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                            >
                              {transaction.type === 'earned' ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {transaction.type === 'earned' ? 'Ganho' : 'Gasto'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{getReasonIcon(transaction.reason)}</span>
                              <span className="text-sm">{transaction.description}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-semibold ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinsHistory;