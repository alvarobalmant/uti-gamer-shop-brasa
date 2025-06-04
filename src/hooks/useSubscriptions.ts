
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
  status?: 'active' | 'expired' | 'cancelled';
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  data_cadastro: string;
  plano?: string;
  status_assinatura: string;
  desconto?: number;
  data_expiracao?: string;
}

export const useSubscriptions = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<ActiveSubscription | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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
      setPlans([]);
      
      toast({
        title: "Erro ao carregar planos",
        description: "Não foi possível carregar os planos de assinatura.",
        variant: "destructive",
      });
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) {
      setUserSubscription(null);
      setUsuario(null);
      return;
    }

    try {
      console.log('Buscando dados do usuário:', user.id);
      
      // Buscar dados do perfil atualizado
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
      }

      console.log('Dados do perfil:', profileData);

      // Verificar se tem assinatura ativa através do perfil
      if (profileData?.is_pro_member && 
          profileData?.pro_expires_at && 
          new Date(profileData.pro_expires_at) > new Date()) {
        
        // Buscar dados detalhados da assinatura
        const { data: subscriptionData, error: subError } = await supabase
          .rpc('get_active_subscription', { user_id: user.id });

        if (subError) {
          console.error('Erro na função get_active_subscription:', subError);
        }

        if (subscriptionData && subscriptionData.length > 0) {
          setUserSubscription(subscriptionData[0]);
          console.log('Assinatura ativa encontrada:', subscriptionData[0]);
        } else {
          // Usar dados do perfil como fallback
          setUserSubscription({
            subscription_id: user.id,
            plan_name: 'UTI PRO',
            discount_percentage: 10, // Padrão UTI PRO
            end_date: profileData.pro_expires_at
          });
        }
      } else {
        setUserSubscription(null);
        console.log('Nenhuma assinatura ativa encontrada no perfil');
      }

      // Buscar dados da tabela usuarios (se existir)
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (usuarioError && usuarioError.code !== 'PGRST116') {
        console.error('Erro ao buscar usuário:', usuarioError);
      }

      if (usuarioData) {
        setUsuario(usuarioData);
        console.log('Dados do usuário encontrados:', usuarioData);
      } else {
        setUsuario(null);
        console.log('Usuário não encontrado na tabela usuarios');
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do usuário:', error);
      setUserSubscription(null);
      setUsuario(null);
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

      console.log('=== CRIANDO ASSINATURA ===');
      console.log('Usuário:', user.id);
      console.log('Plano:', planId, plan.name);

      // Calcular data de expiração
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      // Cancelar assinaturas existentes
      const { error: cancelError } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (cancelError) {
        console.error('Erro ao cancelar assinaturas existentes:', cancelError);
      }

      // Criar nova assinatura
      const { data: newSubscription, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          end_date: endDate.toISOString(),
          status: 'active',
          start_date: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar nova assinatura:', insertError);
        throw insertError;
      }

      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_pro_member: true,
          pro_expires_at: endDate.toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        throw profileError;
      }

      // Atualizar tabela usuarios (se existir)
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          nome: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          papel: 'user',
          status_assinatura: 'Ativo',
          plano: plan.name,
          desconto: plan.discount_percentage,
          data_expiracao: endDate.toISOString()
        });

      if (usuarioError) {
        console.error('Erro ao atualizar tabela usuarios:', usuarioError);
      }

      console.log('✅ Assinatura criada com sucesso');

      // Atualizar dados
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
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cancelar assinatura.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('=== CANCELANDO ASSINATURA ===');

      // Cancelar assinaturas na tabela user_subscriptions
      const { error: cancelError } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (cancelError) {
        console.error('Erro ao cancelar assinaturas:', cancelError);
        throw cancelError;
      }

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_pro_member: false,
          pro_expires_at: null
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        throw profileError;
      }

      // Atualizar tabela usuarios
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({
          status_assinatura: 'Expirado',
          data_expiracao: null,
          plano: null,
          desconto: 0
        })
        .eq('id', user.id);

      if (usuarioError) {
        console.error('Erro ao atualizar usuário:', usuarioError);
      }

      console.log('✅ Assinatura cancelada com sucesso');

      // Atualizar estado
      setUserSubscription(null);
      await fetchUserSubscription();
      
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
    if (!user) return false;
    
    return userSubscription !== null && 
           new Date(userSubscription.end_date) > new Date();
  };

  const getDiscountPercentage = () => {
    return hasActiveSubscription() ? (userSubscription?.discount_percentage || 10) : 0;
  };

  // Efeito principal
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

  return {
    plans,
    userSubscription,
    usuario,
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
