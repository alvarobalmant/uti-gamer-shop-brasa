import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CoinTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent';
  reason: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_login_date: string | null;
  streak_multiplier: number;
}

const CoinsHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Carregar transações
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) {
        console.error('Erro ao carregar transações:', transactionsError);
      } else {
        const formattedTransactions = transactionsData.map(t => ({
          id: t.id,
          amount: t.amount || 0,
          type: (t.type as 'earned' | 'spent') || 'earned',
          reason: t.reason || '',
          description: t.description || 'Transação',
          created_at: t.created_at || new Date().toISOString(),
          metadata: t.metadata || {}
        }));
        
        setTransactions(formattedTransactions);
      }

      // Load streak data from user_coins table (stub implementation)
      console.log('Loading streak data (stub implementation)');
      const stubStreak: UserStreak = {
        current_streak: 1,
        longest_streak: 1,
        last_login_date: new Date().toISOString(),
        streak_multiplier: 1.0
      };
      setStreak(stubStreak);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
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

  const getTransactionIcon = (type: string, reason: string) => {
    if (type === 'earned') {
      if (reason === 'daily_login') return <Zap className="h-4 w-4 text-yellow-500" />;
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTransactionBadge = (type: string) => {
    return type === 'earned' 
      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">+</Badge>
      : <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">-</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Histórico de UTI Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Histórico de UTI Coins</h1>
            <p className="text-muted-foreground">
              Acompanhe todas as suas transações de moedas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {streak && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Streak Atual</p>
                    <p className="text-2xl font-bold">{streak.current_streak} dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Maior Streak</p>
                    <p className="text-2xl font-bold">{streak.longest_streak} dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Multiplicador</p>
                    <p className="text-2xl font-bold">{streak.streak_multiplier.toFixed(1)}x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Suas últimas 50 transações de moedas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma transação encontrada
                </p>
                <p className="text-sm text-muted-foreground">
                  Suas transações de moedas aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Razão</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type, transaction.reason)}
                            {getTransactionBadge(transaction.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.reason.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} moedas
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoinsHistory;