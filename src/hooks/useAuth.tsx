import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isPro: boolean;
  profile: any;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user?.id) return;
    
    try {
      // Buscar dados do profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar profile:', profileError);
        return;
      }

      setProfile(profileData);
      setIsAdmin(profileData?.role === 'admin');

      // Verificar status PRO
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const hasActivePro = subscriptionData && 
        subscriptionData.subscription_type !== 'free' && 
        (!subscriptionData.expires_at || new Date(subscriptionData.expires_at) > new Date());

      setIsPro(hasActivePro);
    } catch (error) {
      console.error('Erro ao atualizar profile:', error);
    }
  };

  useEffect(() => {
    console.log('🔐 [AuthProvider] Inicializando novo sistema de autenticação...');
    let mounted = true;
    
    // Configurar listener de auth state PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log(`🔐 [AuthProvider] Evento auth: ${event}`, { 
          session: !!session, 
          user: session?.user?.email 
        });
        
        // Atualizações síncronas apenas
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Buscar dados do profile se houver usuário
        if (session?.user) {
          // Usar setTimeout para evitar problemas de recursão
          setTimeout(() => {
            if (!mounted) return;
            refreshProfile();
          }, 100);
        } else {
          setIsAdmin(false);
          setIsPro(false);
          setProfile(null);
        }
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      console.log('🔐 [AuthProvider] Verificação inicial de sessão:', { 
        session: !!session, 
        user: session?.user?.email,
        error: !!error
      });
      
      if (error) {
        console.error('🔐 [AuthProvider] Erro ao obter sessão inicial:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Se há usuário, buscar profile
      if (session?.user) {
        refreshProfile();
      }
    });

    return () => {
      mounted = false;
      console.log('🔐 [AuthProvider] Limpando subscription de auth');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthProvider] Tentando fazer login para:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 [AuthProvider] Erro no login:', error);
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login';
        } else if (error.message?.includes('Email rate limit exceeded')) {
          errorMessage = 'Muitas tentativas de login. Tente novamente em alguns minutos.';
        }
        
        toast({
          title: "Erro no Login",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      }

      console.log('✅ [AuthProvider] Login realizado com sucesso:', data.user?.email);
      
      // Atualizar última atividade de login
      if (data.user) {
        supabase
          .from('user_accounts')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id)
          .then(({ error: updateError }) => {
            if (updateError) {
              console.warn('Aviso: Não foi possível atualizar último login:', updateError);
            }
          });
      }

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta!`,
      });

      return { error: null };
    } catch (error) {
      console.error('🔐 [AuthProvider] Erro inesperado no login:', error);
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
      console.log('🔐 [AuthProvider] Tentando criar conta para:', email);
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
        console.error('🔐 [AuthProvider] Erro no cadastro:', error);
        let errorMessage = 'Erro ao criar conta';
        
        if (error.message?.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (error.message?.includes('Password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message?.includes('Signup is disabled')) {
          errorMessage = 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.';
        }
        
        toast({
          title: "Erro no Cadastro",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error };
      }

      console.log('✅ [AuthProvider] Cadastro realizado com sucesso:', data.user?.email);
      
      if (data.user && !data.session) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      } else {
        toast({
          title: "Conta criada e login realizado!",
          description: "Bem-vindo ao UTI dos Games!",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('🔐 [AuthProvider] Erro inesperado no cadastro:', error);
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
      console.log('🔐 [AuthProvider] Fazendo logout do usuário:', user?.email);
      setLoading(true);

      // Limpar dados locais imediatamente
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      setIsPro(false);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔐 [AuthProvider] Erro no logout:', error);
        toast({
          title: "Erro ao sair",
          description: "Não foi possível fazer logout completamente. Tente novamente.",
          variant: "destructive",
        });
      } else {
        console.log('✅ [AuthProvider] Logout realizado com sucesso');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
    } catch (error) {
      console.error('🔐 [AuthProvider] Erro inesperado no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isPro,
    profile,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    refreshProfile,
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