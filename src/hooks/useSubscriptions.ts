
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
      setUsuario(null);
      return;
    }

    try {
      console.log('Buscando dados do usuário:', user.id);
      
      // Buscar dados do usuário na tabela usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (usuarioError && usuarioError.code !== 'PGRST116') {
        console.error('Erro ao buscar usuário:', usuarioError);
        throw usuarioError;
      }

      if (usuarioData) {
        setUsuario(usuarioData);
        console.log('Dados do usuário encontrados:', usuarioData);

        // Verificar se tem assinatura ativa
        if (usuarioData.status_assinatura === 'Ativo' && 
            usuarioData.data_expiracao && 
            new Date(usuarioData.data_expiracao) > new Date()) {
          
          // Buscar dados detalhados da assinatura
          const { data: subscriptionData, error: subError } = await supabase
            .rpc('get_active_subscription', { user_id: user.id });

          if (subError) {
            console.error('Erro na função get_active_subscription:', subError);
          } else if (subscriptionData && subscriptionData.length > 0) {
            setUserSubscription(subscriptionData[0]);
            console.log('Assinatura ativa encontrada:', subscriptionData[0]);
          } else {
            // Usar dados da tabela usuarios como fallback
            setUserSubscription({
              subscription_id: user.id, // fallback
              plan_name: usuarioData.plano || 'UTI PRO',
              discount_percentage: usuarioData.desconto || 0,
              end_date: usuarioData.data_expiracao || ''
            });
          }
        } else {
          setUserSubscription(null);
          console.log('Nenhuma assinatura ativa encontrada');
        }
      } else {
        setUsuario(null);
        setUserSubscription(null);
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

      // Criar assinatura no user_subscriptions
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          end_date: endDate.toISOString(),
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erro ao inserir nova assinatura:', insertError);
        throw insertError;
      }

      // Atualizar ou criar registro na tabela usuarios
      const { error: upsertError } = await supabase
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

      if (upsertError) {
        console.error('Erro ao atualizar usuário:', upsertError);
        throw upsertError;
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
      console.log('Cancelando assinatura do usuário:', user?.id);

      if (!user) throw new Error('Usuário não autenticado');

      // Usar a função do banco para cancelar
      const { data, error } = await supabase.rpc('cancelar_assinatura', {
        user_id: user.id
      });

      if (error) {
        console.error('Erro ao cancelar assinatura:', error);
        throw error;
      }

      // Cancelar também no user_subscriptions
      await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'active');

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
    return userSubscription !== null && 
           usuario?.status_assinatura === 'Ativo' &&
           usuario?.data_expiracao &&
           new Date(usuario.data_expiracao) > new Date();
  };

  const getDiscountPercentage = () => {
    return hasActiveSubscription() ? (usuario?.desconto || userSubscription?.discount_percentage || 0) : 0;
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
      setUsuario(null);
    }
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
