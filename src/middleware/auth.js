// Middleware de autenticação e autorização
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// Função para verificar se o usuário tem permissões de administrador
export const isAdmin = async (req, supabase) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  // Buscar perfil do usuário para verificar role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    console.error('Erro ao verificar permissões de administrador:', error);
    return false;
  }

  return profile.role === 'admin';
};

// Middleware para proteger rotas administrativas
export const withAdminAuth = async (req) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const adminUser = await isAdmin(req, supabase);
  
  if (!adminUser) {
    // Registrar tentativa de acesso não autorizado
    console.warn('Tentativa de acesso não autorizado à área administrativa', {
      path: req.nextUrl.pathname,
      ip: req.ip || 'unknown',
      timestamp: new Date().toISOString(),
    });
    
    // Redirecionar para página de acesso negado
    return NextResponse.redirect(new URL('/access-denied', req.url));
  }
  
  return res;
};

// Middleware para verificar autenticação geral
export const withAuth = async (req) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirecionar para login
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
};

// Middleware para verificar propriedade de recursos
export const verifyResourceOwnership = async (supabase, resourceTable, resourceId, userId) => {
  const { data, error } = await supabase
    .from(resourceTable)
    .select('user_id')
    .eq('id', resourceId)
    .single();
    
  if (error || !data) {
    console.error(`Erro ao verificar propriedade do recurso ${resourceTable}:${resourceId}`, error);
    return false;
  }
  
  return data.user_id === userId;
};

// Utilitário para validação consistente de permissões
export const validatePermission = async (supabase, userId, permission) => {
  // Verificar se o usuário existe e está ativo
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('active, role, permissions')
    .eq('id', userId)
    .single();
    
  if (userError || !user || !user.active) {
    return false;
  }
  
  // Administradores têm todas as permissões
  if (user.role === 'admin') {
    return true;
  }
  
  // Verificar permissão específica
  return user.permissions && user.permissions.includes(permission);
};

// Função para registrar tentativas de acesso
export const logAccessAttempt = async (supabase, {
  userId,
  resource,
  action,
  success,
  ipAddress,
  userAgent
}) => {
  const { error } = await supabase
    .from('security_logs')
    .insert({
      user_id: userId,
      resource,
      action,
      success,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    });
    
  if (error) {
    console.error('Erro ao registrar tentativa de acesso:', error);
  }
};
