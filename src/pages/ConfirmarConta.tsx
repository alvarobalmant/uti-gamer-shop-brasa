import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ConfirmarConta = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState<{ email: string; password?: string } | null>(null);

  useEffect(() => {
    const confirmarEmail = async () => {
      if (!codigo) {
        setStatus('error');
        setMessage('Código de confirmação inválido');
        return;
      }

      try {
        console.log('🔄 Iniciando confirmação com código:', codigo);

        // Tentar confirmar o email usando o código como token_hash
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: codigo,
          type: 'email'
        });

        if (error) {
          console.error('❌ Erro na confirmação:', error);
          setStatus('error');
          setMessage('Link de confirmação inválido ou expirado. Tente solicitar um novo email de confirmação.');
          return;
        }

        if (data.user) {
          console.log('✅ Email confirmado com sucesso para:', data.user.email);
          
          // Email confirmado com sucesso
          setStatus('success');
          setMessage('Email confirmado com sucesso! Você será redirecionado em alguns segundos...');
          setUserData({ email: data.user.email || '' });

          // Auto-redirecionar após 3 segundos
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);

          // Mostrar toast de sucesso
          toast({
            title: "Email Confirmado!",
            description: "Sua conta foi ativada com sucesso. Bem-vindo ao UTI dos Games!",
          });
        } else {
          setStatus('error');
          setMessage('Erro na confirmação do email. Tente novamente.');
        }

      } catch (error: any) {
        console.error('❌ Erro inesperado:', error);
        setStatus('error');
        setMessage('Erro interno. Tente novamente mais tarde.');
      }
    };

    confirmarEmail();
  }, [codigo, navigate, signIn]);

  const handleVoltar = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirmando Email...'}
            {status === 'success' && 'Email Confirmado!'}
            {status === 'error' && 'Erro na Confirmação'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">
                Verificando seu email, aguarde um momento...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-green-700">
                  Conta ativada com sucesso!
                </p>
                <p className="text-muted-foreground">
                  Bem-vindo ao <strong>UTI dos Games</strong>!
                </p>
                {userData?.email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {userData.email}
                  </p>
                )}
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  Você será redirecionado automaticamente em alguns segundos...
                </p>
              </div>
              <Button onClick={handleVoltar} className="w-full">
                Ir para o Site Agora
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-red-700">
                  Erro na Confirmação
                </p>
                <p className="text-muted-foreground">
                  {message}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">
                  Tente solicitar um novo email de confirmação ou entre em contato com o suporte.
                </p>
              </div>
              <Button onClick={handleVoltar} variant="outline" className="w-full">
                Voltar ao Site
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmarConta;