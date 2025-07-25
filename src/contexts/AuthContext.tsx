import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isEmailConfirmed: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resendConfirmation: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const { toast } = useToast();

  // Função para verificar se é admin
  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
      setIsAdmin(false);
    }
  };

  // Configurar listeners de autenticação
  useEffect(() => {
    let mounted = true;

    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setSession(session);
            setUser(session.user);
            setIsEmailConfirmed(!!session.user.email_confirmed_at);
            await checkAdminStatus(session.user.id);
            console.log('✅ Sessão inicial carregada:', session.user.email);
          } else {
            setSession(null);
            setUser(null);
            setIsEmailConfirmed(false);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão inicial:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listener para mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          setIsEmailConfirmed(!!session.user.email_confirmed_at);
          
          // Verificar se é admin apenas se não estamos fazendo logout
          if (event !== 'SIGNED_OUT') {
            await checkAdminStatus(session.user.id);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsEmailConfirmed(false);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔑 Tentando login:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        
        let errorMessage = 'Erro ao fazer login';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
      }

      console.log('✅ Login realizado com sucesso:', data.user?.email);
      
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${data.user?.email}!`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('💥 Erro inesperado no login:', error);
      return { success: false, error: 'Erro inesperado. Tente novamente.' };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Tentando cadastro:', email);
      
      const cleanEmail = email.trim().toLowerCase();
      
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`
        },
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        let errorMessage = 'Erro ao criar conta';
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Email inválido. Verifique o endereço.';
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log('✅ Cadastro realizado:', data.user.email);
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Você foi automaticamente logado. Verifique seu email para confirmar sua conta.",
        });

        return { success: true };
      }

      return { success: false, error: 'Erro inesperado ao criar conta' };
    } catch (error: any) {
      console.error('💥 Erro inesperado no cadastro:', error);
      return { success: false, error: 'Erro inesperado. Tente novamente.' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Fazendo logout...');
      
      // Limpar estado imediatamente para feedback visual
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsEmailConfirmed(false);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
        // Mesmo com erro, manter o estado limpo
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      // Mesmo com erro, manter o estado limpo
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado.",
      });
    }
  };

  const resendConfirmation = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user?.email) {
      return { success: false, error: 'Nenhum usuário logado' };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Erro ao reenviar confirmação:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro inesperado ao reenviar:', error);
      return { success: false, error: 'Erro inesperado' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    isEmailConfirmed,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};