import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EmailConfirmationBanner = () => {
  const { user, isEmailConfirmed } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = React.useState(true);
  const [isResending, setIsResending] = React.useState(false);

  // Só mostrar se usuário logado mas email não confirmado
  if (!user || isEmailConfirmed || !isVisible) {
    return null;
  }

  console.log('Email confirmation status:', { 
    hasUser: !!user, 
    isEmailConfirmed, 
    email_confirmed_at: user?.email_confirmed_at 
  });

  const resendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Email reenviado!",
        description: "Verificque sua caixa de entrada para confirmar seu email.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <Mail className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Confirme seu email para acessar todas as funcionalidades!</strong>
          <br />
          Enviamos um email de confirmação para <strong>{user.email}</strong>. 
          Sem a confirmação, você não poderá acessar UTI Coins, UTI Pro e outras funcionalidades.
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resendConfirmation}
            disabled={isResending}
            className="border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            {isResending ? "Reenviando..." : "Reenviar"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-amber-800 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};