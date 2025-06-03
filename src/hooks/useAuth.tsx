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

// Dados mockados para uso offline/demonstrativo
const MOCK_USER: User | null = null; // Simulando usuário não logado por padrão
const MOCK_SESSION: Session | null = null;
const MOCK_IS_ADMIN = false;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [session, setSession] = useState<Session | null>(MOCK_SESSION);
  const [isAdmin, setIsAdmin] = useState(MOCK_IS_ADMIN);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Função para carregar dados de autenticação
    const loadAuthData = async () => {
      try {
        // Configurar listener de mudança de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Verificar se é admin
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', session.user.id)
                  .single();
                
                setIsAdmin(profile?.role === 'admin');
              } catch (error) {
                console.log('Erro ao verificar perfil:', error);
                setIsAdmin(false);
              }
            } else {
              setIsAdmin(false);
            }
            
            setLoading(false);
          }
        );

        // Verificar sessão existente
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            setIsAdmin(profile?.role === 'admin');
          } catch (error) {
            console.log('Erro ao verificar perfil:', error);
            setIsAdmin(false);
          }
        }
        
        setLoading(false);
        return subscription;
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        // Fallback para modo offline - usar dados mockados
        setUser(MOCK_USER);
        setSession(MOCK_SESSION);
        setIsAdmin(MOCK_IS_ADMIN);
        setLoading(false);
        return { unsubscribe: () => {} };
      }
    };

    // Iniciar carregamento com tratamento de erro
    const subscription = loadAuthData();
    
    // Cleanup
    return () => {
      subscription.then(sub => {
        if (typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      }).catch(err => console.error('Erro ao desinscrever:', err));
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
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });
    } catch (error: any) {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso!",
      });
    } catch (error: any) {
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
