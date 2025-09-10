import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UTICoinsSavings {
  total_discount_amount: number;
  total_coins_used: number;
  order_count: number;
}

export const useUTICoinsSavings = () => {
  const { user } = useAuth();

  const {
    data: savings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['uti-coins-savings', user?.id],
    queryFn: async (): Promise<UTICoinsSavings> => {
      if (!user?.id) {
        return {
          total_discount_amount: 0,
          total_coins_used: 0,
          order_count: 0
        };
      }

      const { data, error } = await supabase
        .from('order_verification_codes')
        .select('uti_coins_discount_amount, uti_coins_used')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('uti_coins_discount_amount', 'is', null);

      if (error) {
        console.error('Erro ao buscar economia com UTI Coins:', error);
        throw error;
      }

      const result = data.reduce(
        (acc, order) => ({
          total_discount_amount: acc.total_discount_amount + (order.uti_coins_discount_amount || 0),
          total_coins_used: acc.total_coins_used + (order.uti_coins_used || 0),
          order_count: acc.order_count + 1
        }),
        { total_discount_amount: 0, total_coins_used: 0, order_count: 0 }
      );

      return result;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false
  });

  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return {
    savings: savings || {
      total_discount_amount: 0,
      total_coins_used: 0,
      order_count: 0
    },
    isLoading,
    error,
    refetch,
    // Valores formatados
    formattedTotalSavings: formatCurrency(savings?.total_discount_amount || 0),
    // Estatísticas úteis
    hasAnySavings: (savings?.total_discount_amount || 0) > 0,
    averageSavingsPerOrder: savings?.order_count ? (savings.total_discount_amount / savings.order_count) : 0
  };
};