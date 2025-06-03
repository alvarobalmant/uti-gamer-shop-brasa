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
  status?: 'active' | 'expired' | 'cancelled'; // Fixed: Added status property
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

// Dados mockados para uso offline/demonstrativo
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'mock-plan-1',
    name: 'UTI PRO Mensal',
    description: 'Assinatura mensal com 5% de desconto em todos os produtos',
    price: 19.90,
    duration_months: 1,
    discount_percentage: 5,
    is_active: true
  },
  {
    id: 'mock-plan-2',
    name: 'UTI PRO Trimestral',
    description: 'Assinatura trimestral com 8% de desconto em todos os produtos',
    price: 49.90,
    duration_months: 3,
    discount_percentage: 8,
    is_active: true
  },
  {
    id: 'mock-plan-3',
    name: 'UTI PRO Anual',
    description: 'Assinatura anual com 12% de desconto em todos os produtos',
    price: 149.90,
    duration_months: 12,
    discount_percentage: 12,
    is_active: true
  }
];

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
      
      // Se não houver planos, usar dados mockados
      if (!data || data.length === 0) {
        console.log('Nenhum plano encontrado, usando dados mockados');
        setPlans(MOCK_PLANS);
        return;
      }
      
      setPlans(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar planos:', error);
      
      // Em caso de erro, usar dados mockados
      console.log('Erro ao buscar planos, usando dados mockados');
      setPlans(MOCK_PLANS);
      
      toast({
        title: "Aviso",
        description: "Usando dados de demonstração devido a um problema de conexão.",
        variant: "default",
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

      console.log('=== INICIANDO CRIAÇÃO DE ASSINATURA ===');
      console.log('Usuário:', user.id);
      console.log('Plano:', planId, plan.name);

      // PASSO 1: BUSCAR E CANCELAR TODAS AS ASSINATURAS ATIVAS
      console.log('PASSO 1: Buscando assinaturas ativas...');
      const { data: activeSubscriptions, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status, end_date')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (fetchError) {
        console.error('Erro ao buscar assinaturas ativas:', fetchError);
        throw fetchError;
      }

      console.log('Assinaturas ativas encontradas:', activeSubscriptions?.length || 0);

      // PASSO 2: CANCELAR ASSINATURAS EXISTENTES (SE HOUVER)
      if (activeSubscriptions && activeSubscriptions.length > 0) {
        console.log('PASSO 2: Cancelando', activeSubscriptions.length, 'assinaturas ativas...');
        
        for (const subscription of activeSubscriptions) {
          console.log('Cancelando assinatura:', subscription.id);
          const { error: cancelError } = await supabase
            .from('user_subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id);

          if (cancelError) {
            console.error('Erro ao cancelar assinatura:', subscription.id, cancelError);
            throw cancelError;
          }
          console.log('Assinatura cancelada com sucesso:', subscription.id);
        }
      }

      // PASSO 3: VERIFICAR SE NÃO HÁ MAIS ASSINATURAS ATIVAS
      console.log('PASSO 3: Verificando se todas as assinaturas foram canceladas...');
      const { data: remainingActive, error: verifyError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (verifyError) {
        console.error('Erro ao verificar assinaturas remanescentes:', verifyError);
        throw verifyError;
      }

      if (remainingActive && remainingActive.length > 0) {
        console.error('ERRO: Ainda existem', remainingActive.length, 'assinaturas ativas após cancelamento!');
        throw new Error('Falha ao cancelar assinaturas existentes');
      }

      console.log('✅ Todas as assinaturas foram canceladas com sucesso');

      // PASSO 4: CALCULAR DATA DE EXPIRAÇÃO
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);
      console.log('PASSO 4: Data de expiração calculada:', endDate.toISOString());

      // PASSO 5: CRIAR NOVA ASSINATURA
      console.log('PASSO 5: Criando nova assinatura...');
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

      console.log('✅ Nova assinatura criada:', newSubscription.id);

      // PASSO 6: ATUALIZAR TABELA USUARIOS
      console.log('PASSO 6: Atualizando tabela usuarios...');
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
          data_expiracao: endDate.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        console.error('Erro ao atualizar usuário:', upsertError);
        throw upsertError;
      }

      console.log('✅ Tabela usuarios atualizada com sucesso');

      // PASSO 7: VERIFICAÇÃO FINAL
      console.log('PASSO 7: Verificação final...');
      const { data: finalCheck, error: finalError } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (finalError) {
        console.error('Erro na verificação final:', finalError);
        throw finalError;
      }

      console.log('Assinaturas ativas após criação:', finalCheck?.length || 0);
      if (finalCheck && finalCheck.length !== 1) {
        console.error('ERRO: Deveria haver exatamente 1 assinatura ativa, mas foram encontradas:', finalCheck?.length);
        throw new Error('Estado inconsistente após criação da assinatura');
      }

      console.log('=== ASSINATURA CRIADA COM SUCESSO ===');

      // Atualizar dados imediatamente
      await fetchUserSubscription();
      
      toast({
        title: "Assinatura ativada!",
        description: `Você agora é membro UTI PRO com ${plan.discount_percentage}% de desconto!`,
      });

      return true;
    } catch (error: any) {
      console.error('=== ERRO NA CRIAÇÃO DA ASSINATURA ===');
      console.error('Erro:', error);
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
      console.log('=== INICIANDO CANCELAMENTO DE ASSINATURA ===');
      console.log('Usuário:', user?.id);

      if (!user) throw new Error('Usuário não autenticado');

      // PASSO 1: BUSCAR TODAS AS ASSINATURAS ATIVAS
      console.log('PASSO 1: Buscando assinaturas ativas...');
      const { data: activeSubscriptions, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (fetchError) {
        console.error('Erro ao buscar assinaturas ativas:', fetchError);
        throw fetchError;
      }

      console.log('Assinaturas ativas encontradas:', activeSubscriptions?.length || 0);

      if (!activeSubscriptions || activeSubscriptions.length === 0) {
        console.log('Nenhuma assinatura ativa encontrada para cancelar');
        toast({
          title: "Aviso",
          description: "Nenhuma assinatura ativa encontrada para cancelar.",
          variant: "destructive",
        });
        return false;
      }

      // PASSO 2: CANCELAR TODAS AS ASSINATURAS ATIVAS
      console.log('PASSO 2: Cancelando', activeSubscriptions.length, 'assinaturas...');
      for (const subscription of activeSubscriptions) {
        console.log('Cancelando assinatura:', subscription.id);
        const { error: cancelError } = await supabase
          .from('user_subscriptions')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);

        if (cancelError) {
          console.error('Erro ao cancelar assinatura:', subscription.id, cancelError);
          throw cancelError;
        }
        console.log('Assinatura cancelada:', subscription.id);
      }

      // PASSO 3: ATUALIZAR TABELA USUARIOS
      console.log('PASSO 3: Atualizando tabela usuarios...');
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          status_assinatura: 'Expirado',
          data_expiracao: null,
          plano: null,
          desconto: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        throw updateError;
      }

      // PASSO 4: VERIFICAÇÃO FINAL
      console.log('PASSO 4: Verificação final...');
      const { data: finalCheck, error: finalError } = await supabase
        .from('user_subscriptions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (finalError) {
        console.error('Erro na verificação final:', finalError);
        throw finalError;
      }

      console.log('Assinaturas ativas após cancelamento:', finalCheck?.length || 0);
      if (finalCheck && finalCheck.length > 0) {
        console.error('ERRO: Ainda existem assinaturas ativas após cancelamento!');
        throw new Error('Falha ao cancelar todas as assinaturas');
      }

      console.log('=== CANCELAMENTO CONCLUÍDO COM SUCESSO ===');

      // Atualizar estado imediatamente
      setUserSubscription(null);
      await fetchUserSubscription();
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura UTI PRO foi cancelada.",
      });

      return true;
    } catch (error: any) {
      console.error('=== ERRO NO CANCELAMENTO ===');
      console.error('Erro:', error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const hasActiveSubscription = () => {
    // Modo demo: retornar false para simular usuário sem assinatura
    return false;
    
    // Código original:
    // return userSubscription !== null && 
    //        usuario?.status_assinatura === 'Ativo' &&
    //        usuario?.data_expiracao &&
    //        new Date(usuario.data_expiracao) > new Date();
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
