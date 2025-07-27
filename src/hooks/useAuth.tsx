
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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role using setTimeout to avoid infinite recursion
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              setIsAdmin(profile?.role === 'admin');
            } catch (error) {
              console.log('Error checking admin role:', error);
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      const isAutoLoginSession = localStorage.getItem('admin_auto_login_session') === 'true';
      
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
