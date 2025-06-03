
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  subscription_plans?: SubscriptionPlan;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  plano: string | null;
  status_assinatura: string;
  desconto: number | null;
  data_expiracao: string | null;
  data_cadastro: string;
  created_at: string;
  updated_at: string;
}

export const useSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Erro ao buscar planos:', error);
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Buscando dados do usuário:', userId);

      // Fetch user subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Erro ao buscar assinatura:', subscriptionError);
      } else {
        setUserSubscription(subscriptionData);
      }

      // Fetch usuario data (legacy table)
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single

      if (usuarioError && usuarioError.code !== 'PGRST116') {
        console.error('Erro ao buscar usuário:', usuarioError);
      } else {
        setUsuario(usuarioData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchPlans();
        if (user?.id) {
          await fetchUserData(user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const createSubscription = async (planId: string): Promise<boolean> => {
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
      if (!plan) {
        toast({
          title: "Erro",
          description: "Plano não encontrado.",
          variant: "destructive",
        });
        return false;
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        });

      if (error) throw error;

      // Update profile
      await supabase
        .from('profiles')
        .update({
          is_pro_member: true,
          pro_expires_at: endDate.toISOString(),
        })
        .eq('id', user.id);

      toast({
        title: "Sucesso!",
        description: "Assinatura criada com sucesso!",
      });

      await fetchUserData(user.id);
      return true;
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar assinatura.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !userSubscription) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update profile
      await supabase
        .from('profiles')
        .update({
          is_pro_member: false,
          pro_expires_at: null,
        })
        .eq('id', user.id);

      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura foi cancelada com sucesso.",
      });

      await fetchUserData(user.id);
      return true;
    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cancelar assinatura.",
        variant: "destructive",
      });
      return false;
    }
  };

  const hasActiveSubscription = (): boolean => {
    if (userSubscription) {
      const now = new Date();
      const endDate = new Date(userSubscription.end_date);
      return userSubscription.status === 'active' && endDate > now;
    }
    
    if (usuario) {
      const now = new Date();
      const expireDate = usuario.data_expiracao ? new Date(usuario.data_expiracao) : null;
      return usuario.status_assinatura === 'Ativo' && expireDate && expireDate > now;
    }
    
    return false;
  };

  const getDiscountPercentage = (): number => {
    if (userSubscription?.subscription_plans) {
      return userSubscription.subscription_plans.discount_percentage;
    }
    
    if (usuario?.desconto) {
      return usuario.desconto;
    }
    
    return 10; // Default discount percentage
  };

  const refetch = async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  };

  return {
    plans,
    userSubscription,
    usuario,
    loading,
    createSubscription,
    cancelSubscription,
    hasActiveSubscription,
    getDiscountPercentage,
    refetch,
  };
};
