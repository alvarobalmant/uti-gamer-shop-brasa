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
        description: "Verifique sua caixa de entrada para confirmar seu email.",
      });
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      toast({
        title: "Erro ao reenviar email",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800 shadow-sm">
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-amber-900 mb-1">
            ✨ Confirme seu email para desbloquear todas as funcionalidades!
          </div>
          <div className="text-sm text-amber-700">
            Enviamos um email de confirmação para <strong>{user.email}</strong>. 
            <br />
            <span className="inline-flex items-center gap-1 mt-1">
              <span>📧 Verifique sua caixa de entrada</span>
              <span>•</span>
              <span>🎮 Acesse UTI Coins e UTI Pro</span>
              <span>•</span>
              <span>🎯 Desbloqueie recursos exclusivos</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resendConfirmation}
            disabled={isResending}
            className="border-amber-300 text-amber-800 hover:bg-amber-100 font-medium"
          >
            {isResending ? "Reenviando..." : "📬 Reenviar"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-amber-800 hover:bg-amber-100"
            title="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};