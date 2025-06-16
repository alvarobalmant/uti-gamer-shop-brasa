
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

  // Função otimizada para verificar admin (sem dependência de auditoria)
  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Aviso: Erro ao verificar role admin:', error);
        return false;
      }
      
      return profile?.role === 'admin';
    } catch (error) {
      console.warn('Aviso: Erro ao verificar admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener (sem auditoria para evitar circular dependency)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role de forma não-bloqueante
          try {
            const adminStatus = await checkAdminRole(session.user.id);
            setIsAdmin(adminStatus);
            
            // Log session restoration em background (depois da auth estar configurada)
            setTimeout(() => {
              logSecurityEvent('session_restored', {
                userId: session.user.id,
                email: session.user.email,
                isAdmin: adminStatus
              });
            }, 100);
          } catch (error) {
            console.warn('Aviso: Erro ao configurar sessão:', error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session (sem auditoria)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.warn('Aviso: Erro ao verificar sessão inicial:', error);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // Remover dependência de logSecurityEvent

  const signIn = async (email: string, password: string) => {
    // Check if user is blocked
    if (isBlocked) {
      throw new Error('Conta temporariamente bloqueada devido a muitas tentativas de login. Tente novamente mais tarde.');
    }

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Record failed attempt with security logging
        await recordFailedAttempt(email, error.message);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirme seu email antes de fazer login.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
        }
        
        throw error;
      }

      // Record successful login
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
      // Log em background
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
        
        // Provide user-friendly error messages
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
      // Log logout event em background
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
