import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 [AuthProvider] Initializing simplified auth system...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔐 [AuthProvider] Auth event: ${event}`, { 
          session: !!session, 
          user: session?.user?.email 
        });
        
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role if user is logged in
        if (session?.user) {
          console.log('🔐 [AuthProvider] Checking admin role for user:', session.user.email);
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('🔐 [AuthProvider] Error checking admin role:', error);
              setIsAdmin(false);
            } else {
              const adminStatus = profile?.role === 'admin';
              console.log('🔐 [AuthProvider] Admin status:', adminStatus, 'for role:', profile?.role);
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.warn('🔐 [AuthProvider] Could not check admin role:', error);
            setIsAdmin(false);
          }
        } else {
          console.log('🔐 [AuthProvider] No user session, setting admin to false');
          setIsAdmin(false);
        }
        
        console.log('🔐 [AuthProvider] Setting loading to false');
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔐 [AuthProvider] Initial session check:', { 
        session: !!session, 
        user: session?.user?.email,
        error: !!error
      });
      
      if (error) {
        console.error('🔐 [AuthProvider] Error getting initial session:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session, set loading to false immediately
      if (!session) {
        console.log('🔐 [AuthProvider] No initial session, setting loading to false');
        setLoading(false);
      }
    });

    return () => {
      console.log('🔐 [AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthProvider] Attempting sign in for:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 [AuthProvider] Sign in error:', error);
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        }
        
        toast({
          title: "Erro no Login",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      }

      console.log('✅ [AuthProvider] Sign in successful:', data.user?.email);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${data.user?.email}`,
      });

      return { error: null };
    } catch (error) {
      console.error('🔐 [AuthProvider] Unexpected sign in error:', error);
      toast({
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      console.log('🔐 [AuthProvider] Attempting sign up for:', email);
      setLoading(true);

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        console.error('🔐 [AuthProvider] Sign up error:', error);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.message?.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (error.message?.includes('Password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        }
        
        toast({
          title: "Erro no Cadastro",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      }

      console.log('✅ [AuthProvider] Sign up successful:', data.user?.email);
      
      if (data.user && !data.session) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      } else {
        toast({
          title: "Conta criada e login realizado!",
          description: `Bem-vindo, ${data.user?.email}`,
        });
      }

      return { error: null };
    } catch (error) {
      console.error('🔐 [AuthProvider] Unexpected sign up error:', error);
      toast({
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 [AuthProvider] Signing out user:', user?.email);
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔐 [AuthProvider] Sign out error:', error);
        toast({
          title: "Erro ao sair",
          description: "Não foi possível fazer logout. Tente novamente.",
          variant: "destructive",
        });
      } else {
        console.log('✅ [AuthProvider] Sign out successful');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error('🔐 [AuthProvider] Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}