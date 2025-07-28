
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { securityMonitor } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  invalidateSession: (sessionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const checkSessionAndRole = async (session: Session | null) => {
      if (!mounted) return;
      
      if (session?.access_token) {
        try {
          // Check if session was manually invalidated
          const { data: invalidatedSession } = await supabase
            .from('invalidated_sessions')
            .select('id')
            .eq('session_id', session.access_token)
            .maybeSingle();
          
          if (invalidatedSession) {
            // Session was manually invalidated, force local logout
            if (mounted) {
              setSession(null);
              setUser(null);
              setIsAdmin(false);
              setLoading(false);
            }
            return;
          }
        } catch (error) {
          console.log('Error checking invalidated session:', error);
        }
        
        // Update session state
        if (mounted) {
          setSession(session);
          setUser(session.user);
        }
        
        // Check admin role
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setIsAdmin(profile?.role === 'admin');
          }
        } catch (error) {
          console.log('Error checking admin role:', error);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      } else {
        // No session
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await checkSessionAndRole(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSessionAndRole(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check rate limiting before attempting login
      if (!securityMonitor.checkRateLimit(`login_${email}`, 5, 900000)) { // 5 attempts per 15 minutes
        throw new Error('Too many login attempts. Please try again later.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        securityMonitor.logEvent({
          type: 'auth_failure',
          message: 'Login failed',
          details: { email, error: error.message }
        });
        throw error;
      }
      
      securityMonitor.logEvent({
        type: 'auth_failure', // Using existing type for consistency
        message: 'User logged in successfully',
        details: { email }
      });
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
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
      throw error;
    }
    
    return { error: null };
  };

  const signOut = async () => {
    try {
      const currentSession = session;
      const isAutoLoginSession = localStorage.getItem('admin_auto_login_session') === 'true';
      
      // Log security event
      securityMonitor.logEvent({
        type: 'auth_failure',
        message: 'User signed out',
        details: { userId: currentSession?.user?.id, isAutoLogin: isAutoLoginSession }
      });
      
      // Se há uma sessão válida e usuário autenticado, marcar como invalidada
      if (currentSession?.access_token && currentSession?.user?.id) {
        try {
          await supabase
            .from('invalidated_sessions')
            .insert({
              session_id: currentSession.access_token,
              user_id: currentSession.user.id
            });
        } catch (invalidateError: any) {
          console.log('Erro ao invalidar sessão:', invalidateError.message);
          // Continua com o logout mesmo se falhar ao invalidar
        }
      }
      
      // Clear any cached admin status
      sessionStorage.removeItem('isAdmin');
      
      // Limpar flag de auto-login se existir
      if (isAutoLoginSession) {
        localStorage.removeItem('admin_auto_login_session');
      }
      
      // Tentar logout no servidor, mas não falhar se a sessão não existir
      try {
        await supabase.auth.signOut();
      } catch (serverError: any) {
        // Para sessões de auto-login ou sessões inválidas, o servidor pode não reconhecer
        console.log('Logout do servidor falhou (esperado para auto-login):', serverError.message);
      }
      
      // Sempre limpar estado local independentemente do resultado do servidor
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Logout realizado com sucesso!",
      });
    } catch (error: any) {
      // Em caso de erro geral, ainda fazer limpeza local
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Logout realizado com sucesso!",
      });
    }
  };

  const invalidateSession = async (sessionId: string) => {
    try {
      if (!session) return;
      
      await supabase.from('invalidated_sessions').insert({
        user_id: session.user.id,
        session_id: sessionId
      });
      
      securityMonitor.logEvent({
        type: 'privilege_escalation',
        message: 'Session manually invalidated',
        details: { sessionId }
      });
      
      // Force sign out if it's the current session
      if (session.access_token === sessionId) {
        await signOut();
      }
    } catch (error: any) {
      console.error('Error invalidating session:', error);
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
      invalidateSession,
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
