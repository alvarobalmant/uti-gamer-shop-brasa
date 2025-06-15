
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
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminRole = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      return profile?.role === 'admin';
    } catch (error) {
      console.log('Error checking admin role:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
          console.log('Admin status for user:', session.user.email, adminStatus);
          
          // Enhanced security logging for admin access
          if (adminStatus) {
            console.warn('Admin user authenticated:', {
              userId: session.user.id,
              email: session.user.email,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              sessionId: session.access_token.substring(0, 10) + '...'
            });
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const adminStatus = await checkAdminRole(session.user.id);
        setIsAdmin(adminStatus);
        console.log('Initial admin status for user:', session.user.email, adminStatus);
        
        // Enhanced security logging for existing admin sessions
        if (adminStatus) {
          console.warn('Existing admin session restored:', {
            userId: session.user.id,
            email: session.user.email,
            timestamp: new Date().toISOString(),
            sessionId: session.access_token.substring(0, 10) + '...'
          });
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Security logging for login attempts
      console.log('Login attempt:', {
        email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Enhanced error logging for security monitoring
        console.error('Sign in error:', {
          email,
          error: error.message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        
        // Provide generic error message to prevent user enumeration
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirme seu email antes de fazer login.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
        }
        
        throw error;
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
      // Security logging for signup attempts
      console.log('Signup attempt:', {
        email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });

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
        // Enhanced error logging
        console.error('Sign up error:', {
          email,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Provide user-friendly error messages
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Tente fazer login ou usar outro email.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        
        throw error;
      }
      
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
      // Security logging for logout
      if (user) {
        console.log('User logout:', {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
          wasAdmin: isAdmin
        });
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
