
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserOrder {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_items?: {
    id: string;
    product_id: string;
    quantity: number;
    price_at_time: number;
    product?: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export const useUserOrders = () => {
  const { user } = useAuth();

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async (): Promise<UserOrder[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_orders')
        .select(`
          id,
          user_id,
          order_number,
          total_amount,
          status,
          created_at,
          updated_at,
          order_items:order_items (
            id,
            product_id,
            quantity,
            price_at_time,
            product:products (
              id,
              name,
              image
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
      }

      return data || [];
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

  // Função para formatar status
  const formatStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'processing': 'Processando',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Função para obter cor do status
  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'pending': 'text-yellow-600',
      'processing': 'text-blue-600',
      'shipped': 'text-purple-600',
      'delivered': 'text-green-600',
      'cancelled': 'text-red-600'
    };
    return colorMap[status] || 'text-gray-600';
  };

  return {
    orders,
    isLoading,
    error,
    refetch,
    formatCurrency,
    formatStatus,
    getStatusColor,
    ordersCount: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0)
  };
};
