import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UTICoins, CoinTransaction, CoinRule } from '@/types/retention';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUTICoins = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [coins, setCoins] = useState<UTICoins>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    lastUpdated: new Date().toISOString()
  });
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [rules, setRules] = useState<CoinRule[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados do usuário logado
  const loadUserData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Carregar saldo de moedas
      const { data: coinsData } = await supabase
        .from('uti_coins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (coinsData) {
        setCoins({
          balance: coinsData.balance,
          totalEarned: coinsData.total_earned,
          totalSpent: coinsData.total_spent,
          lastUpdated: coinsData.updated_at
        });
      }

      // Carregar transações (últimas 50)
      const { data: transactionsData } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsData) {
        const formattedTransactions: CoinTransaction[] = transactionsData.map(t => ({
          id: t.id,
          userId: t.user_id,
          amount: t.amount,
          type: t.type as 'earned' | 'spent',
          reason: t.reason,
          description: t.description,
          createdAt: t.created_at,
          metadata: (t.metadata || {}) as Record<string, any>
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de moedas:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar regras de moedas
  const loadRules = useCallback(async () => {
    try {
      const { data: rulesData } = await supabase
        .from('coin_rules')
        .select('*')
        .eq('is_active', true)
        .order('action');

      if (rulesData) {
        const formattedRules: CoinRule[] = rulesData.map(r => ({
          id: r.id,
          action: r.action,
          amount: r.amount,
          description: r.description,
          maxPerDay: r.max_per_day,
          maxPerMonth: r.max_per_month,
          isActive: r.is_active
        }));
        setRules(formattedRules);
      }
    } catch (error) {
      console.error('Erro ao carregar regras de moedas:', error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadRules();
  }, [loadUserData, loadRules]);

  // Processar login diário
  const processDailyLogin = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('process_daily_login', {
        p_user_id: user.id
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após login
        await loadUserData();
        
        toast({
          title: "Login diário recompensado!",
          description: `Você ganhou ${result.coins_earned} moedas! Streak: ${result.streak} dias (${result.multiplier}x)`,
        });

        return result;
      }

      return result;
    } catch (error) {
      console.error('Erro ao processar login diário:', error);
      return null;
    }
  }, [user, loadUserData, toast]);

  // Ganhar moedas por ação
  const earnCoins = useCallback(async (
    action: string, 
    amount?: number, 
    description?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return { success: false, message: 'Usuário não logado' };

    try {
      const { data, error } = await supabase.rpc('earn_coins', {
        p_user_id: user.id,
        p_action: action,
        p_amount: amount,
        p_description: description,
        p_metadata: metadata || {}
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após ganho
        await loadUserData();
        
        if (result.amount > 0) {
          toast({
            title: "Moedas ganhas!",
            description: `+${result.amount} UTI Coins ${result.multiplier > 1 ? `(${result.multiplier}x multiplicador!)` : ''}`,
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao ganhar moedas:', error);
      return { success: false, message: 'Erro interno' };
    }
  }, [user, loadUserData, toast]);

  // Gastar moedas (resgate de produto)
  const spendCoins = useCallback(async (
    productId: string
  ) => {
    if (!user) return { success: false, message: 'Usuário não logado' };

    try {
      const { data, error } = await supabase.rpc('redeem_coin_product', {
        p_user_id: user.id,
        p_product_id: productId
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após gasto
        await loadUserData();
        
        toast({
          title: "Produto resgatado!",
          description: result.message,
        });
      } else {
        toast({
          title: "Erro no resgate",
          description: result.message,
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      console.error('Erro ao resgatar produto:', error);
      return { success: false, message: 'Erro interno' };
    }
  }, [user, loadUserData, toast]);

  // Verificar se pode ganhar moedas para uma ação
  const canEarnCoins = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;

    const rule = rules.find(r => r.action === action && r.isActive);
    if (!rule) return false;

    // Verificar limites diários se existirem
    if (rule.maxPerDay) {
      const { data: dailyCount } = await supabase
        .from('daily_actions')
        .select('count')
        .eq('user_id', user.id)
        .eq('action', action)
        .eq('action_date', new Date().toISOString().split('T')[0])
        .single();

      if (dailyCount && dailyCount.count >= rule.maxPerDay) {
        return false;
      }
    }

    return true;
  }, [user, rules]);

  const getCoinsForAction = useCallback((action: string): number => {
    const rule = rules.find(r => r.action === action && r.isActive);
    return rule?.amount || 0;
  }, [rules]);

  // Ganhar moedas por scroll
  const earnScrollCoins = useCallback(async () => {
    return await earnCoins('scroll_page');
  }, [earnCoins]);

  return {
    coins,
    transactions,
    rules,
    loading,
    earnCoins,
    spendCoins,
    getCoinsForAction,
    canEarnCoins,
    processDailyLogin,
    earnScrollCoins,
    refreshData: loadUserData
  };
};