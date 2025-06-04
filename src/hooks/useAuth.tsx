import { useState, useEffect, createContext, useContext, useCallback } from 'react';
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

const MOCK_USER: User | null = null;
const MOCK_SESSION: Session | null = null;
const MOCK_IS_ADMIN = false;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('[useAuth] AuthProvider RENDERIZANDO...');
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [session, setSession] = useState<Session | null>(MOCK_SESSION);
  const [isAdmin, setIsAdmin] = useState(MOCK_IS_ADMIN);
  const [loading, setLoading] = useState(true); // Start as true
  const { toast } = useToast();

  // Function to check admin status with robust error handling and timeout
  const checkAdminStatus = useCallback(async (userId: string | undefined): Promise<boolean> => {
    console.log(`[useAuth] checkAdminStatus chamado para userId: ${userId}`);
    if (!userId) {
      console.log('[useAuth] checkAdminStatus: userId nulo, definindo isAdmin como false.');
      setIsAdmin(false);
      return false;
    }

    let isAdminResult = false;
    try {
      console.log(`[useAuth] checkAdminStatus: Buscando perfil para userId: ${userId}`);
      // Implement a simple timeout mechanism (e.g., 5 seconds)
      const profilePromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao buscar perfil')), 5000)
      );

      // Race the profile fetch against the timeout
      const { data: profile, error } = await Promise.race([
          profilePromise,
          timeoutPromise as Promise<{ data: any; error: Error | null }>
      ]);

      if (error) {
        // Handle specific Supabase errors or the timeout error
        console.error('[useAuth] checkAdminStatus: Erro ao buscar perfil (ou timeout):', error);
        isAdminResult = false;
      } else {
        isAdminResult = profile?.role === 'admin';
        console.log(`[useAuth] checkAdminStatus: Perfil encontrado: ${JSON.stringify(profile)}, isAdmin: ${isAdminResult}`);
      }
    } catch (error) {
      // Catch any unexpected errors during the process
      console.error('[useAuth] checkAdminStatus: Erro GERAL ao verificar perfil:', error);
      isAdminResult = false;
    } finally {
        // Always update the isAdmin state based on the result (even if it's false due to error/timeout)
        console.log(`[useAuth] checkAdminStatus: Definindo isAdmin como ${isAdminResult} no finally.`);
        setIsAdmin(isAdminResult);
    }
    return isAdminResult; // Return the determined admin status
  }, []);

  useEffect(() => {
    console.log('[useAuth] useEffect INICIADO. Configurando listener e buscando sessão inicial.');
    setLoading(true); // Ensure loading is true at the start
    let isMounted = true;

    // 1. Set up the auth state change listener
    console.log('[useAuth] Configurando onAuthStateChange listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) {
            console.log('[useAuth] onAuthStateChange: Componente desmontado, ignorando.');
            return;
        }
        console.log(`[useAuth] onAuthStateChange EVENTO: ${event}`, session);
        // Set user/session first
        setSession(session);
        setUser(session?.user ?? null);
        // Check admin status, but don't necessarily wait for it to set loading false
        // The checkAdminStatus itself will update isAdmin state when it resolves/fails
        checkAdminStatus(session?.user?.id);
        // Crucially, set loading false *after* basic session info is set
        console.log('[useAuth] onAuthStateChange: Estado base (user/session) atualizado, definindo loading como false.');
        setLoading(false);
      }
    );
    console.log('[useAuth] onAuthStateChange listener CONFIGURADO.');

    // 2. Check the initial session state with robust finally block
    const checkInitialSession = async () => {
      try {
        console.log('[useAuth] checkInitialSession: Chamando supabase.auth.getSession()...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        console.log('[useAuth] checkInitialSession: getSession() concluído.', { initialSession, sessionError });

        if (!isMounted) {
            console.log('[useAuth] checkInitialSession: Componente desmontado, ignorando.');
            return;
        }

        if (sessionError) {
          console.error('[useAuth] checkInitialSession: Erro ao buscar sessão inicial:', sessionError);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          // setLoading(false) will be handled in finally
          return; // Exit early on error
        }

        // Set basic session info
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        // Trigger admin check, but don't await it here to block loading state
        if (initialSession?.user) {
            checkAdminStatus(initialSession.user.id);
        } else {
            setIsAdmin(false); // No user, definitely not admin
        }

      } catch (error) {
        if (!isMounted) return;
        console.error('[useAuth] checkInitialSession: Erro GERAL ao verificar sessão inicial:', error);
        setUser(MOCK_USER);
        setSession(MOCK_SESSION);
        setIsAdmin(MOCK_IS_ADMIN);
      } finally {
        // *** ALWAYS set loading to false in finally block ***
        if (isMounted) {
          console.log('[useAuth] checkInitialSession: Bloco finally executado, definindo loading como false.');
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    // Cleanup function
    return () => {
      console.log('[useAuth] useEffect CLEANUP. Desinscrevendo listener.');
      isMounted = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
        console.log('[useAuth] Listener desinscrito com sucesso.');
      } else {
        console.warn('[useAuth] Não foi possível desinscrever o listener.');
      }
    };
  }, [checkAdminStatus]);

  // --- signIn, signUp, signOut functions remain largely the same, ensure they don't prematurely set loading=false ---
  const signIn = async (email: string, password: string) => {
    console.log(`[useAuth] signIn chamado para email: ${email}`);
    // setLoading(true); // Let the listener handle loading state changes
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[useAuth] signIn: Erro retornado pelo Supabase:', error);
        toast({ title: "Erro no login", description: error.message, variant: "destructive" });
        throw error;
      }
      console.log('[useAuth] signIn: Sucesso. Aguardando onAuthStateChange...');
      // Success toast might be better handled by the listener confirming the state change
      // toast({ title: "Login realizado com sucesso!", description: "Bem-vindo de volta!" });
    } catch (error: any) {
      console.error('[useAuth] signIn: Erro no bloco catch:', error);
      // Ensure toast shows even if it's not a Supabase error
      if (!error.message.includes('supabase')) {
          toast({ title: "Erro no login", description: error.message || 'Ocorreu um erro desconhecido.', variant: "destructive" });
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log(`[useAuth] signUp chamado para email: ${email}`);
    // setLoading(true); // Let the listener handle loading state changes
    try {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) {
        console.error('[useAuth] signUp: Erro retornado pelo Supabase:', error);
        toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
        throw error;
      }
      console.log('[useAuth] signUp: Sucesso. Verifique seu email.');
      toast({ title: "Conta criada com sucesso!", description: "Verifique seu email para confirmação." });
    } catch (error: any) {
      console.error('[useAuth] signUp: Erro no bloco catch:', error);
      if (!error.message.includes('supabase')) {
          toast({ title: "Erro ao criar conta", description: error.message || 'Ocorreu um erro desconhecido.', variant: "destructive" });
      }
      throw error;
    }
  };

  const signOut = async () => {
    console.log('[useAuth] signOut chamado.');
    // setLoading(true); // Let the listener handle loading state changes
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.error('[useAuth] signOut: Erro retornado pelo Supabase:', error);
         toast({ title: "Erro no logout", description: error.message, variant: "destructive" });
         throw error;
      }
      console.log('[useAuth] signOut: Sucesso. Aguardando onAuthStateChange...');
      // Clear state immediately for faster UI update, listener will confirm
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast({ title: "Logout realizado com sucesso!" });
    } catch (error: any) {
      console.error('[useAuth] signOut: Erro no bloco catch:', error);
      if (!error.message.includes('supabase')) {
          toast({ title: "Erro no logout", description: error.message || 'Ocorreu um erro desconhecido.', variant: "destructive" });
      }
    }
  };
  // --- End of signIn, signUp, signOut ---

  console.log(`[useAuth] AuthProvider RENDERIZANDO com estado: loading=${loading}, user=${!!user}, isAdmin=${isAdmin}`);

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
      {/* Render children immediately, but components should check 'loading' state if needed */}
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

