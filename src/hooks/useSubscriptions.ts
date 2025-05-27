
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_months: number;
  discount_percentage: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  plan?: SubscriptionPlan;
}

export interface ActiveSubscription {
  subscription_id: string;
  plan_name: string;
  discount_percentage: number;
  end_date: string;
}

export const useSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
      console.error('Erro ao carregar planos:', error);
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) {
      setUserSubscription(null);
      return;
    }

    try {
      console.log('Buscando assinatura do usuário:', user.id);
      
      const { data, error } = await supabase
        .rpc('get_active_subscription', { user_id: user.id });

      if (error) {
        console.error('Erro na função get_active_subscription:', error);
        throw error;
      }
      
      console.log('Dados da assinatura retornados:', data);
      
      if (data && data.length > 0) {
        setUserSubscription(data[0]);
        console.log('Assinatura ativa encontrada:', data[0]);
      } else {
        setUserSubscription(null);
        console.log('Nenhuma assinatura ativa encontrada');
      }
    } catch (error: any) {
      console.error('Erro ao carregar assinatura:', error);
      setUserSubscription(null);
    }
  };

  const createSubscription = async (planId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plano não encontrado');

      // Cancelar assinaturas ativas existentes primeiro
      const { data: existingSubscriptions, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString());

      if (fetchError) {
        console.error('Erro ao buscar assinaturas existentes:', fetchError);
      }

      // Cancelar assinaturas existentes se houver
      if (existingSubscriptions && existingSubscriptions.length > 0) {
        console.log('Cancelando assinaturas existentes:', existingSubscriptions.length);
        
        for (const sub of existingSubscriptions) {
          await supabase
            .from('user_subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', sub.id);
        }
      }

      // Calcular data de expiração
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      console.log('Criando nova assinatura:', {
        user_id: user.id,
        plan_id: planId,
        end_date: endDate.toISOString()
      });

      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          end_date: endDate.toISOString(),
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao inserir nova assinatura:', error);
        throw error;
      }

      console.log('Assinatura criada com sucesso');

      // Atualizar dados imediatamente
      await fetchUserSubscription();
      
      toast({
        title: "Assinatura ativada!",
        description: `Você agora é membro UTI PRO com ${plan.discount_percentage}% de desconto!`,
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!userSubscription) {
      toast({
        title: "Erro",
        description: "Nenhuma assinatura ativa encontrada.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Cancelando assinatura:', userSubscription.subscription_id);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', userSubscription.subscription_id);

      if (error) {
        console.error('Erro ao cancelar assinatura:', error);
        throw error;
      }

      console.log('Assinatura cancelada com sucesso');

      // Atualizar estado imediatamente
      setUserSubscription(null);
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura UTI PRO foi cancelada.",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const hasActiveSubscription = () => {
    return userSubscription !== null && new Date(userSubscription.end_date) > new Date();
  };

  const getDiscountPercentage = () => {
    return hasActiveSubscription() ? userSubscription!.discount_percentage : 0;
  };

  // Efeito principal para carregar dados
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPlans(), fetchUserSubscription()]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Efeito para atualizar dados quando o usuário muda
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    } else {
      setUserSubscription(null);
    }
  }, [user]);

  return {
    plans,
    userSubscription,
    loading,
    createSubscription,
    cancelSubscription,
    hasActiveSubscription,
    getDiscountPercentage,
    refetch: async () => {
      console.log('Refazendo busca de dados...');
      await Promise.all([fetchPlans(), fetchUserSubscription()]);
    },
  };
};
