import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UTICoins, CoinTransaction, CoinRule } from '@/types/retention';

// Mock data - será substituído por dados reais do Supabase
const mockCoinRules: CoinRule[] = [
  {
    id: '1',
    action: 'signup',
    amount: 100,
    description: 'Cadastro no site',
    isActive: true
  },
  {
    id: '2',
    action: 'first_purchase',
    amount: 200,
    description: 'Primeira compra',
    isActive: true
  },
  {
    id: '3',
    action: 'purchase',
    amount: 1,
    description: 'Por cada R$ 1,00 gasto',
    isActive: true
  },
  {
    id: '4',
    action: 'review',
    amount: 50,
    description: 'Avaliação de produto',
    maxPerMonth: 5,
    isActive: true
  },
  {
    id: '5',
    action: 'social_share',
    amount: 25,
    description: 'Compartilhamento nas redes sociais',
    maxPerDay: 2,
    isActive: true
  },
  {
    id: '6',
    action: 'referral',
    amount: 500,
    description: 'Indicação de amigo (quando faz primeira compra)',
    isActive: true
  }
];

const mockTransactions: CoinTransaction[] = [
  {
    id: '1',
    userId: 'user1',
    amount: 100,
    type: 'earned',
    reason: 'signup',
    description: 'Bônus de cadastro',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    amount: 250,
    type: 'earned',
    reason: 'purchase',
    description: 'Compra de R$ 250,00',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const useUTICoins = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState<UTICoins>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    lastUpdated: new Date().toISOString()
  });
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [rules, setRules] = useState<CoinRule[]>(mockCoinRules);
  const [loading, setLoading] = useState(false);

  // Simular carregamento de dados do usuário
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Simular delay de API
      setTimeout(() => {
        const userTransactions = mockTransactions.filter(t => t.userId === user.id);
        const totalEarned = userTransactions
          .filter(t => t.type === 'earned')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalSpent = userTransactions
          .filter(t => t.type === 'spent')
          .reduce((sum, t) => sum + t.amount, 0);
        
        setCoins({
          balance: totalEarned - totalSpent,
          totalEarned,
          totalSpent,
          lastUpdated: new Date().toISOString()
        });
        setTransactions(userTransactions);
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const earnCoins = useCallback(async (
    action: string, 
    amount: number, 
    description: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return false;

    const newTransaction: CoinTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      amount,
      type: 'earned',
      reason: action,
      description,
      createdAt: new Date().toISOString(),
      metadata
    };

    // Simular salvamento no banco
    setTransactions(prev => [newTransaction, ...prev]);
    setCoins(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      lastUpdated: new Date().toISOString()
    }));

    return true;
  }, [user]);

  const spendCoins = useCallback(async (
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ) => {
    if (!user || coins.balance < amount) return false;

    const newTransaction: CoinTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      amount,
      type: 'spent',
      reason: 'redemption',
      description,
      createdAt: new Date().toISOString(),
      metadata
    };

    // Simular salvamento no banco
    setTransactions(prev => [newTransaction, ...prev]);
    setCoins(prev => ({
      ...prev,
      balance: prev.balance - amount,
      totalSpent: prev.totalSpent + amount,
      lastUpdated: new Date().toISOString()
    }));

    return true;
  }, [user, coins.balance]);

  const getCoinsForAction = useCallback((action: string): number => {
    const rule = rules.find(r => r.action === action && r.isActive);
    return rule?.amount || 0;
  }, [rules]);

  const canEarnCoins = useCallback((action: string): boolean => {
    const rule = rules.find(r => r.action === action && r.isActive);
    if (!rule) return false;

    // Verificar limites diários/mensais se existirem
    if (rule.maxPerDay || rule.maxPerMonth) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayTransactions = transactions.filter(t => 
        t.reason === action && 
        new Date(t.createdAt) >= today
      );

      const monthTransactions = transactions.filter(t => 
        t.reason === action && 
        new Date(t.createdAt) >= thisMonth
      );

      if (rule.maxPerDay && todayTransactions.length >= rule.maxPerDay) {
        return false;
      }

      if (rule.maxPerMonth && monthTransactions.length >= rule.maxPerMonth) {
        return false;
      }
    }

    return true;
  }, [rules, transactions]);

  return {
    coins,
    transactions,
    rules,
    loading,
    earnCoins,
    spendCoins,
    getCoinsForAction,
    canEarnCoins
  };
};

