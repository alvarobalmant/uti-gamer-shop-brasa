
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSecurity } from './useAuthSecurity';
import { useSecurityAudit } from './useSecurityAudit';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  securityMetrics: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const {
    recordFailedAttempt,
    recordSuccessfulLogin,
    isBlocked,
    securityMetrics
  } = useAuthSecurity();
  
  // Separar auditoria para não bloquear autenticação
  const { logSecurityEvent } = useSecurityAudit();

  // Função otimizada para verificar admin usando a nova função is_admin()
  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      console.log(`[Auth] Verificando role admin para usuário: ${userId}`);
      
      // Usar a função SQL is_admin() corrigida
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.warn('[Auth] Erro ao verificar role admin:', error);
        return false;
      }
      
      console.log(`[Auth] Resultado is_admin():`, data);
      return data === true;
    } catch (error) {
      console.warn('[Auth] Erro ao verificar admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener otimizado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role de forma otimizada
          try {
            console.log('[Auth] Verificando status de admin...');
            const adminStatus = await checkAdminRole(session.user.id);
            console.log('[Auth] Status de admin:', adminStatus);
            setIsAdmin(adminStatus);
            
            // Log session em background
            setTimeout(() => {
              logSecurityEvent('session_restored', {
                userId: session.user.id,
                email: session.user.email,
                isAdmin: adminStatus
              });
            }, 100);
          } catch (error) {
            console.warn('[Auth] Erro ao configurar sessão:', error);
            setIsAdmin(false);
          }
        } else {
          console.log('[Auth] Nenhum usuário logado');
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[Auth] Initial session check:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.warn('[Auth] Erro ao verificar sessão inicial:', error);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isBlocked) {
      throw new Error('Conta temporariamente bloqueada devido a muitas tentativas de login. Tente novamente mais tarde.');
    }

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        await recordFailedAttempt(email, error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirme seu email antes de fazer login.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
        }
        
        throw error;
      }

      if (data.user) {
        const adminStatus = await checkAdminRole(data.user.id);
        await recordSuccessfulLogin(email, adminStatus);
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setTimeout(() => {
        logSecurityEvent('signup_attempt', { email });
      }, 0);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/`
        },
      });
      
      if (error) {
        setTimeout(() => {
          logSecurityEvent('signup_failed', {
            email,
            error: error.message
          });
        }, 0);
        
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Tente fazer login ou usar outro email.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        
        throw error;
      }

      setTimeout(() => {
        logSecurityEvent('signup_success', { email });
      }, 0);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        setTimeout(() => {
          logSecurityEvent('user_logout', {
            userId: user.id,
            email: user.email,
            wasAdmin: isAdmin
          });
        }, 0);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
      securityMetrics,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
