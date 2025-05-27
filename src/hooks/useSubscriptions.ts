
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
      const { data, error } = await supabase
        .rpc('get_active_subscription', { user_id: user.id });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setUserSubscription(data[0]);
      } else {
        setUserSubscription(null);
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

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          end_date: endDate.toISOString(),
          status: 'active'
        });

      if (error) throw error;

      await fetchUserSubscription();
      
      toast({
        title: "Assinatura ativada!",
        description: `Você agora é membro UTI PRO com ${plan.discount_percentage}% de desconto!`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!userSubscription) return false;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', userSubscription.subscription_id);

      if (error) throw error;

      setUserSubscription(null);
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura UTI PRO foi cancelada.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const hasActiveSubscription = () => {
    return userSubscription !== null;
  };

  const getDiscountPercentage = () => {
    return userSubscription ? userSubscription.discount_percentage : 0;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPlans(), fetchUserSubscription()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    plans,
    userSubscription,
    loading,
    createSubscription,
    cancelSubscription,
    hasActiveSubscription,
    getDiscountPercentage,
    refetch: () => Promise.all([fetchPlans(), fetchUserSubscription()]),
  };
};
