
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let sessionCheckInProgress = false;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Prevent race conditions during session checks
        if (sessionCheckInProgress) return;
        sessionCheckInProgress = true;
        
        // Handle session invalidation check
        if (session?.access_token) {
          setTimeout(async () => {
            try {
              const { data: invalidatedSession } = await supabase
                .from('invalidated_sessions')
                .select('id')
                .eq('session_id', session.access_token)
                .maybeSingle();
              
              if (invalidatedSession) {
                // Session was manually invalidated, force local logout
                setSession(null);
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
                sessionCheckInProgress = false;
                return;
              }
            } catch (error) {
              console.log('Error checking invalidated session:', error);
              // Continue with normal flow even if check fails
            }
            
            // Update session state
            setSession(session);
            setUser(session?.user ?? null);
            
            // Check admin role
            if (session?.user) {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', session.user.id)
                  .maybeSingle();
                
                setIsAdmin(profile?.role === 'admin');
              } catch (error) {
                console.log('Error checking admin role:', error);
                setIsAdmin(false);
              }
            } else {
              setIsAdmin(false);
            }
            
            setLoading(false);
            sessionCheckInProgress = false;
          }, 0);
        } else {
          // No session
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          sessionCheckInProgress = false;
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!sessionCheckInProgress) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      sessionCheckInProgress = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
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
