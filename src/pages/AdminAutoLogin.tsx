import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const processAutoLogin = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token não encontrado na URL');
        return;
      }

      try {
        // Se o usuário estiver logado, deslogar primeiro
        await signOut();
        
        setMessage('Validando token administrativo...');

        // Processar o login automático via edge function
        const { data, error } = await supabase.functions.invoke('admin-auto-login', {
          body: { 
            token: token,
            clientIP: null // O edge function vai detectar o IP automaticamente
          }
        });

        if (error) throw error;

        if (!data.success) {
          throw new Error(data.message);
        }

        setMessage('Token válido! Redirecionando para login...');

        // Redirecionar para o link de autenticação mágica
        window.location.href = data.authUrl;

      } catch (error: any) {
        console.error('Erro no login automático:', error);
        setStatus('error');
        setMessage(error.message || 'Erro desconhecido no processo de login');
        
        // Redirecionar para home após 3 segundos em caso de erro
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