// Configuração de segurança para o Supabase
import { createClient } from '@supabase/supabase-js';

// Criação do cliente Supabase com opções de segurança aprimoradas
export const createSecureSupabaseClient = (supabaseUrl, supabaseKey, options = {}) => {
  // Opções padrão de segurança
  const securityOptions = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // Configurações de cookies mais seguras
      storageOptions: {
        cookie: {
          name: 'uti-games-session',
          lifetime: 60 * 60 * 8, // 8 horas
          domain: window.location.hostname,
          path: '/',
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        }
      }
    },
    // Configurações globais para todas as requisições
    global: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
    // Merge com opções personalizadas
    ...options
  };

  return createClient(supabaseUrl, supabaseKey, securityOptions);
};

// Função para verificar e renovar tokens quando necessário
export const ensureValidSession = async (supabase) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { valid: false };
  }

  // Verificar se o token está próximo de expirar (menos de 10 minutos)
  const expiresAt = new Date(session.expires_at * 1000);
  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

  if (expiresAt < tenMinutesFromNow) {
    // Token próximo de expirar, renovar
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Erro ao renovar sessão:', error);
      return { valid: false, error };
    }
    
    return { valid: true, session: data.session };
  }

  return { valid: true, session };
};

// Função para configurar políticas RLS no Supabase
export const setupRlsPolicies = async (supabase, adminKey) => {
  // Esta função deve ser executada apenas em ambiente de desenvolvimento
  // ou por um script de administração, nunca no cliente
  if (!adminKey) {
    throw new Error('Admin key is required to setup RLS policies');
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    adminKey
  );

  // Exemplo de criação de política RLS para tabela de produtos
  // Apenas administradores podem criar/editar/excluir produtos
  await adminClient.rpc('create_rls_policy', {
    table_name: 'products',
    policy_name: 'admin_all',
    definition: '(auth.uid() IN (SELECT id FROM profiles WHERE role = \'admin\'))',
    operation: 'ALL'
  });

  // Qualquer usuário pode visualizar produtos
  await adminClient.rpc('create_rls_policy', {
    table_name: 'products',
    policy_name: 'public_select',
    definition: 'true',
    operation: 'SELECT'
  });

  // Usuários só podem ver seus próprios dados de perfil
  await adminClient.rpc('create_rls_policy', {
    table_name: 'profiles',
    policy_name: 'users_select_own',
    definition: '(auth.uid() = id)',
    operation: 'SELECT'
  });

  // Usuários só podem atualizar seus próprios dados de perfil
  await adminClient.rpc('create_rls_policy', {
    table_name: 'profiles',
    policy_name: 'users_update_own',
    definition: '(auth.uid() = id)',
    operation: 'UPDATE'
  });

  // Administradores podem ver todos os perfis
  await adminClient.rpc('create_rls_policy', {
    table_name: 'profiles',
    policy_name: 'admin_select_all',
    definition: '(auth.uid() IN (SELECT id FROM profiles WHERE role = \'admin\'))',
    operation: 'SELECT'
  });

  // Políticas para códigos UTI PRO
  // Apenas administradores podem criar códigos
  await adminClient.rpc('create_rls_policy', {
    table_name: 'pro_codes',
    policy_name: 'admin_insert',
    definition: '(auth.uid() IN (SELECT id FROM profiles WHERE role = \'admin\'))',
    operation: 'INSERT'
  });

  // Apenas administradores podem ver todos os códigos
  await adminClient.rpc('create_rls_policy', {
    table_name: 'pro_codes',
    policy_name: 'admin_select',
    definition: '(auth.uid() IN (SELECT id FROM profiles WHERE role = \'admin\'))',
    operation: 'SELECT'
  });

  // Usuários só podem ver códigos que resgataram
  await adminClient.rpc('create_rls_policy', {
    table_name: 'pro_codes',
    policy_name: 'users_select_own',
    definition: '(used_by = auth.uid())',
    operation: 'SELECT'
  });

  return { success: true };
};

// Função para registrar eventos de segurança
export const logSecurityEvent = async (supabase, eventData) => {
  const { error } = await supabase
    .from('security_logs')
    .insert({
      event_type: eventData.type,
      user_id: eventData.userId || null,
      details: eventData.details || {},
      ip_address: eventData.ipAddress || null,
      user_agent: eventData.userAgent || null,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Erro ao registrar evento de segurança:', error);
    return { success: false, error };
  }

  return { success: true };
};
