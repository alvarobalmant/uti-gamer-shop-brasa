import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UTICoins, CoinTransaction, CoinRule } from '@/types/retention';
import { supabase } from '@/integrations/supabase/client';
<<<<<<< HEAD
=======
import { useToast } from '@/hooks/use-toast';
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42

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
  const [balanceChanged, setBalanceChanged] = useState(false);

<<<<<<< HEAD
  // Carregar dados do usuário logado de forma segura
=======
  // Carregar dados do usuário logado
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
  const loadUserData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
<<<<<<< HEAD
      // Carregar saldo de moedas com tratamento de erro
      const { data: coinsData, error: coinsError } = await supabase
=======
      // Carregar saldo de moedas
      const { data: coinsData } = await supabase
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
        .from('uti_coins')
        .select('*')
        .eq('user_id', user.id)
        .single();

<<<<<<< HEAD
      if (coinsError) {
        console.warn('Erro ao carregar moedas:', coinsError);
        // Se não existir registro, criar um padrão
        if (coinsError.code === 'PGRST116') {
          setCoins({
            balance: 0,
            totalEarned: 0,
            totalSpent: 0,
            lastUpdated: new Date().toISOString()
          });
        }
      } else if (coinsData) {
        const newCoins = {
          balance: coinsData.balance || 0,
          totalEarned: coinsData.total_earned || 0,
          totalSpent: coinsData.total_spent || 0,
          lastUpdated: coinsData.updated_at || new Date().toISOString()
        };

        // Detectar mudança no saldo para ativar animação
        setCoins(prevCoins => {
          if (prevCoins.balance !== newCoins.balance && prevCoins.balance > 0) {
            setBalanceChanged(true);
            // Reset da animação após 1 segundo
            setTimeout(() => setBalanceChanged(false), 1000);
          }
          return newCoins;
        });
      }

      // Carregar transações com tratamento de erro
      const { data: transactionsData, error: transactionsError } = await supabase
=======
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
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

<<<<<<< HEAD
      if (transactionsError) {
        console.warn('Erro ao carregar transações:', transactionsError);
        setTransactions([]);
      } else if (transactionsData) {
        const formattedTransactions: CoinTransaction[] = transactionsData.map(t => ({
          id: t.id,
          userId: t.user_id,
          amount: t.amount || 0,
          type: (t.type as 'earned' | 'spent') || 'earned',
          reason: t.reason || '',
          description: t.description || 'Transação',
          createdAt: t.created_at || new Date().toISOString(),
=======
      if (transactionsData) {
        const formattedTransactions: CoinTransaction[] = transactionsData.map(t => ({
          id: t.id,
          userId: t.user_id,
          amount: t.amount,
          type: t.type as 'earned' | 'spent',
          reason: t.reason,
          description: t.description,
          createdAt: t.created_at,
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
          metadata: (t.metadata || {}) as Record<string, any>
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de moedas:', error);
<<<<<<< HEAD
      // Definir valores padrão em caso de erro
      setCoins({
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        lastUpdated: new Date().toISOString()
      });
      setTransactions([]);
=======
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
    } finally {
      setLoading(false);
    }
  }, [user]);

<<<<<<< HEAD
  // Carregar regras de moedas de forma segura
  const loadRules = useCallback(async () => {
    try {
      const { data: rulesData, error: rulesError } = await supabase
=======
  // Carregar regras de moedas
  const loadRules = useCallback(async () => {
    try {
      const { data: rulesData } = await supabase
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
        .from('coin_rules')
        .select('*')
        .eq('is_active', true)
        .order('action');

<<<<<<< HEAD
      if (rulesError) {
        console.warn('Erro ao carregar regras:', rulesError);
        setRules([]);
      } else if (rulesData) {
        const formattedRules: CoinRule[] = rulesData.map(r => ({
          id: r.id,
          action: r.action || '',
          amount: r.amount || 0,
          description: r.description || '',
          maxPerDay: r.max_per_day,
          maxPerMonth: r.max_per_month,
          isActive: r.is_active || false
=======
      if (rulesData) {
        const formattedRules: CoinRule[] = rulesData.map(r => ({
          id: r.id,
          action: r.action,
          amount: r.amount,
          description: r.description,
          maxPerDay: r.max_per_day,
          maxPerMonth: r.max_per_month,
          isActive: r.is_active
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
        }));
        setRules(formattedRules);
      }
    } catch (error) {
      console.error('Erro ao carregar regras de moedas:', error);
<<<<<<< HEAD
      setRules([]);
=======
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (user) {
      loadUserData();
      loadRules();
    }
  }, [loadUserData, loadRules, user]);

  // Processar login diário de forma segura
=======
    loadUserData();
    loadRules();
  }, [loadUserData, loadRules]);

  // Processar login diário
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
  const processDailyLogin = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('process_daily_login', {
        p_user_id: user.id
      });

<<<<<<< HEAD
      if (error) {
        console.warn('Erro ao processar login diário:', error);
        return { success: false, message: 'Função não disponível' };
      }
=======
      if (error) throw error;
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após login
        await loadUserData();
<<<<<<< HEAD
        return result;
      }

      return result || { success: false, message: 'Erro desconhecido' };
    } catch (error) {
      console.error('Erro ao processar login diário:', error);
      return { success: false, message: 'Erro interno' };
    }
  }, [user, loadUserData]);

  // Ganhar moedas por ação de forma segura
=======
        
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
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
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

<<<<<<< HEAD
      if (error) {
        console.warn('Erro ao ganhar moedas:', error);
        return { success: false, message: 'Função não disponível' };
      }
=======
      if (error) throw error;
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após ganho
        await loadUserData();
<<<<<<< HEAD
      }

      return result || { success: false, message: 'Erro desconhecido' };
=======
        
        if (result.amount > 0) {
          toast({
            title: "Moedas ganhas!",
            description: `+${result.amount} UTI Coins ${result.multiplier > 1 ? `(${result.multiplier}x multiplicador!)` : ''}`,
          });
        }
      }

      return result;
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
    } catch (error) {
      console.error('Erro ao ganhar moedas:', error);
      return { success: false, message: 'Erro interno' };
    }
<<<<<<< HEAD
  }, [user, loadUserData]);

  // Gastar moedas (resgate de produto) de forma segura
=======
  }, [user, loadUserData, toast]);

  // Gastar moedas (resgate de produto)
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
  const spendCoins = useCallback(async (
    productId: string
  ) => {
    if (!user) return { success: false, message: 'Usuário não logado' };

    try {
      const { data, error } = await supabase.rpc('redeem_coin_product', {
        p_user_id: user.id,
        p_product_id: productId
      });

<<<<<<< HEAD
      if (error) {
        console.warn('Erro ao resgatar produto:', error);
        return { success: false, message: 'Função não disponível' };
      }
=======
      if (error) throw error;
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após gasto
        await loadUserData();
<<<<<<< HEAD
      }

      return result || { success: false, message: 'Erro desconhecido' };
=======
        
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
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
    } catch (error) {
      console.error('Erro ao resgatar produto:', error);
      return { success: false, message: 'Erro interno' };
    }
<<<<<<< HEAD
  }, [user, loadUserData]);

  // Verificar se pode ganhar moedas para uma ação de forma segura
  const canEarnCoins = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const rule = rules.find(r => r.action === action && r.isActive);
      if (!rule) return false;

      // Verificar limites diários se existirem
      if (rule.maxPerDay) {
        const { data: dailyCount, error } = await supabase
          .from('daily_actions')
          .select('count')
          .eq('user_id', user.id)
          .eq('action', action)
          .eq('action_date', new Date().toISOString().split('T')[0])
          .single();

        if (error) {
          console.warn('Erro ao verificar limite diário:', error);
          return true; // Em caso de erro, permitir ação
        }

        if (dailyCount && dailyCount.count >= rule.maxPerDay) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar se pode ganhar moedas:', error);
      return false;
    }
=======
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
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
  }, [user, rules]);

  const getCoinsForAction = useCallback((action: string): number => {
    const rule = rules.find(r => r.action === action && r.isActive);
    return rule?.amount || 0;
  }, [rules]);

<<<<<<< HEAD
  // Ganhar moedas por scroll de forma segura
=======
  // Ganhar moedas por scroll
>>>>>>> e66b56ebee593af2b5746ff794962a0a73fbfc42
  const earnScrollCoins = useCallback(async () => {
    return await earnCoins('scroll_page');
  }, [earnCoins]);

  return {
    coins,
    transactions,
    rules,
    loading,
    balanceChanged,
    earnCoins,
    spendCoins,
    getCoinsForAction,
    canEarnCoins,
    processDailyLogin,
    earnScrollCoins,
    refreshData: loadUserData
  };
};