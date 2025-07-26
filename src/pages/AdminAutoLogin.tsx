import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const AdminAutoLogin = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processando login automático...');
  const hasProcessed = useRef(false); // Evitar processamento duplo

  useEffect(() => {
    const processAutoLogin = async () => {
      // Evitar processamento duplo
      if (hasProcessed.current || !token) {
        if (!token) {
          setStatus('error');
          setMessage('Token não encontrado na URL');
        }
        return;
      }

      hasProcessed.current = true;

      try {
        console.log('Iniciando processo de auto-login com token:', token);
        setMessage('Validando token administrativo...');
        
        console.log('Chamando edge function admin-auto-login');

        // Processar o login automático via edge function (uma única vez)
        const { data, error } = await supabase.functions.invoke('admin-auto-login', {
          body: { 
            token: token,
            clientIP: null
          }
        });

        console.log('Resposta da edge function:', { data, error });

        if (error) {
          console.error('Erro na edge function:', error);
          throw error;
        }

        if (!data?.success) {
          console.error('Edge function retornou falha:', data?.message);
          throw new Error(data?.message || 'Falha na validação do token');
        }

        console.log('Token validado com sucesso, processando login...');
        console.log('Dados recebidos da edge function:', JSON.stringify(data, null, 2));
        setMessage('Criando sessão administrativa...');

        // Verificar se recebemos tokens de sessão
        if (data.sessionTokens?.access_token && data.sessionTokens?.refresh_token) {
          console.log('✅ Tokens de sessão recebidos:', {
            access_token_length: data.sessionTokens.access_token?.length,
            refresh_token_length: data.sessionTokens.refresh_token?.length,
            admin_email: data.adminEmail
          });
          
          // Aguardar um pouco antes de tentar criar a sessão
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('🔄 Criando sessão com tokens...');
          
          // Usar os tokens para criar a sessão localmente
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: data.sessionTokens.access_token,
            refresh_token: data.sessionTokens.refresh_token
          });

          console.log('📋 Resultado do setSession:', {
            sessionData,
            sessionError,
            hasSession: !!sessionData?.session,
            hasUser: !!sessionData?.session?.user,
            userId: sessionData?.session?.user?.id,
            userEmail: sessionData?.session?.user?.email
          });

          if (sessionError) {
            console.error('❌ Erro ao criar sessão:', sessionError);
            throw new Error(`Erro ao criar sessão administrativa: ${sessionError.message}`);
          }

          if (!sessionData.session) {
            console.error('❌ Sessão não foi criada - sessionData.session é null');
            throw new Error('Sessão não foi criada corretamente');
          }

          console.log('✅ Sessão administrativa criada com sucesso!');
          console.log('👤 Usuário logado:', {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email,
            role: sessionData.session.user.user_metadata?.role
          });
          
          // Verificar se a sessão foi realmente estabelecida
          console.log('🔍 Verificando sessão atual...');
          const { data: currentSession } = await supabase.auth.getSession();
          console.log('📊 Sessão atual:', {
            hasCurrentSession: !!currentSession?.session,
            currentUserId: currentSession?.session?.user?.id,
            currentUserEmail: currentSession?.session?.user?.email
          });
          
          setStatus('success');
          setMessage('✅ Login administrativo realizado com sucesso! Redirecionando para painel...');
          
          // Aguardar 2 segundos para mostrar a mensagem de sucesso
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('🔄 Redirecionando para /admin...');
          navigate('/admin', { replace: true });
        } else {
          console.error('❌ Tokens de sessão não recebidos');
          console.log('📋 Dados recebidos:', data);
          throw new Error('Tokens de autenticação não foram recebidos da edge function');
        }

      } catch (error: any) {
        console.error('Erro no processo de auto-login:', error);
        setStatus('error');
        setMessage(error.message || 'Erro desconhecido no processo de login');
        
        // Redirecionar para home após erro (3 segundos)
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    processAutoLogin();
  }, [token, navigate, signOut]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          {status === 'processing' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h1 className="text-2xl font-bold text-white">Login Administrativo</h1>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold text-white">Login Realizado!</h1>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold text-white">Erro no Login</h1>
            </>
          )}
          
          <p className="text-gray-400 max-w-md">
            {message}
          </p>
          
          {status === 'error' && (
            <p className="text-sm text-gray-500">
              Você será redirecionado para a página inicial em alguns segundos...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};