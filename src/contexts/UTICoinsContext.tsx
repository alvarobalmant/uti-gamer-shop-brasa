import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UTICoins, CoinTransaction, CoinRule } from '@/types/retention';
import { supabase } from '@/integrations/supabase/client';

interface UTICoinsContextType {
  coins: UTICoins;
  transactions: CoinTransaction[];
  rules: CoinRule[];
  loading: boolean;
  balanceChanged: boolean;
  earnCoins: (action: string, amount?: number, description?: string, metadata?: Record<string, any>) => Promise<any>;
  spendCoins: (productId: string) => Promise<any>;
  getCoinsForAction: (action: string) => number;
  canEarnCoins: (action: string) => Promise<boolean>;
  processDailyLogin: () => Promise<any>;
  earnScrollCoins: () => Promise<any>;
  refreshData: () => Promise<void>;
}

const UTICoinsContext = createContext<UTICoinsContextType | undefined>(undefined);

interface UTICoinsProviderProps {
  children: ReactNode;
}

export const UTICoinsProvider: React.FC<UTICoinsProviderProps> = ({ children }) => {
  const { user } = useAuth();
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

  // Carregar dados do usuário logado de forma segura
  const loadUserData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Carregar saldo de moedas com tratamento de erro
      const { data: coinsData, error: coinsError } = await supabase
        .from('uti_coins')
        .select('*')
        .eq('user_id', user.id)
        .single();

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
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

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
          metadata: (t.metadata || {}) as Record<string, any>
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de moedas:', error);
      // Definir valores padrão em caso de erro
      setCoins({
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        lastUpdated: new Date().toISOString()
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar regras de moedas de forma segura
  const loadRules = useCallback(async () => {
    try {
      const { data: rulesData, error: rulesError } = await supabase
        .from('coin_rules')
        .select('*')
        .eq('is_active', true)
        .order('action');

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
        }));
        setRules(formattedRules);
      }
    } catch (error) {
      console.error('Erro ao carregar regras de moedas:', error);
      setRules([]);
    }
  }, []);

  // Configurar listener em tempo real APENAS uma vez por usuário
  useEffect(() => {
    if (!user?.id) return;

    // Primeiro carregar os dados
    loadUserData();
    loadRules();

    // Criar canal único por usuário para evitar conflitos
    const channelName = `uti_coins_provider_${user.id}`;
    
    console.log('Criando canal realtime:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'uti_coins',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('UTI Coins real-time update (Provider):', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newData = payload.new as any;
            const newCoins = {
              balance: newData.balance || 0,
              totalEarned: newData.total_earned || 0,
              totalSpent: newData.total_spent || 0,
              lastUpdated: newData.updated_at || new Date().toISOString()
            };

            setCoins(prevCoins => {
              // Detectar mudança no saldo para ativar animação
              if (prevCoins.balance !== newCoins.balance && prevCoins.balance > 0) {
                setBalanceChanged(true);
                setTimeout(() => setBalanceChanged(false), 1000);
              }
              return newCoins;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coin_transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New coin transaction (Provider):', payload);
          // Recarregar dados quando houver nova transação
          loadUserData();
        }
      )
      .subscribe();

    return () => {
      console.log('Removendo canal realtime (Provider):', channelName);
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadUserData, loadRules]);

  // Processar login diário de forma segura
  const processDailyLogin = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('process_daily_login', {
        p_user_id: user.id
      });

      if (error) {
        console.warn('Erro ao processar login diário:', error);
        return { success: false, message: 'Função não disponível' };
      }

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após login
        await loadUserData();
        return result;
      }

      return result || { success: false, message: 'Erro desconhecido' };
    } catch (error) {
      console.error('Erro ao processar login diário:', error);
      return { success: false, message: 'Erro interno' };
    }
  }, [user, loadUserData]);

  // Ganhar moedas por ação de forma segura
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

      if (error) {
        console.warn('Erro ao ganhar moedas:', error);
        return { success: false, message: 'Função não disponível' };
      }

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após ganho
        await loadUserData();
      }

      return result || { success: false, message: 'Erro desconhecido' };
    } catch (error) {
      console.error('Erro ao ganhar moedas:', error);
      return { success: false, message: 'Erro interno' };
    }
  }, [user, loadUserData]);

  // Gastar moedas (resgate de produto) de forma segura
  const spendCoins = useCallback(async (
    productId: string
  ) => {
    if (!user) return { success: false, message: 'Usuário não logado' };

    try {
      const { data, error } = await supabase.rpc('redeem_coin_product', {
        p_user_id: user.id,
        p_product_id: productId
      });

      if (error) {
        console.warn('Erro ao resgatar produto:', error);
        return { success: false, message: 'Função não disponível' };
      }

      const result = data as any;
      if (result?.success) {
        // Recarregar dados após gasto
        await loadUserData();
      }

      return result || { success: false, message: 'Erro desconhecido' };
    } catch (error) {
      console.error('Erro ao resgatar produto:', error);
      return { success: false, message: 'Erro interno' };
    }
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
  }, [user, rules]);

  const getCoinsForAction = useCallback((action: string): number => {
    const rule = rules.find(r => r.action === action && r.isActive);
    return rule?.amount || 0;
  }, [rules]);

  // Ganhar moedas por scroll de forma segura
  const earnScrollCoins = useCallback(async () => {
    return await earnCoins('scroll_page');
  }, [earnCoins]);

  const value: UTICoinsContextType = {
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

  return (
    <UTICoinsContext.Provider value={value}>
      {children}
    </UTICoinsContext.Provider>
  );
};

export const useUTICoins = (): UTICoinsContextType => {
  const context = useContext(UTICoinsContext);
  if (context === undefined) {
    throw new Error('useUTICoins must be used within a UTICoinsProvider');
  }
  return context;
};