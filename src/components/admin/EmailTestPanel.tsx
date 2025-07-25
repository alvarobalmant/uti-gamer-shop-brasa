
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const EmailTestPanel = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  const testSignupEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Erro",
        description: "Digite um e-mail para testar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "E-mail de confirmação enviado",
        description: `Um e-mail customizado foi enviado para ${testEmail}`,
      });
    } catch (error: any) {
      console.error('Erro ao testar e-mail:', error);
      toast({
        title: "Erro no teste",
        description: error.message || "Erro ao enviar e-mail de teste",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testRecoveryEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Erro",
        description: "Digite um e-mail para testar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      toast({
        title: "E-mail de recuperação enviado",
        description: `Um e-mail customizado de recuperação foi enviado para ${testEmail}`,
      });
    } catch (error: any) {
      console.error('Erro ao testar e-mail de recuperação:', error);
      toast({
        title: "Erro no teste",
        description: error.message || "Erro ao enviar e-mail de teste",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste de E-mails Customizados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Digite um e-mail para testar"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={testSignupEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Enviando...' : 'Testar E-mail de Confirmação'}
          </Button>
          
          <Button 
            onClick={testRecoveryEmail}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Enviando...' : 'Testar E-mail de Recuperação'}
          </Button>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Nota:</strong> Os e-mails serão enviados usando os templates customizados do React Email.</p>
          <p>Verifique a caixa de entrada e spam do e-mail testado.</p>
        </div>
      </CardContent>
    </Card>
  );
};
