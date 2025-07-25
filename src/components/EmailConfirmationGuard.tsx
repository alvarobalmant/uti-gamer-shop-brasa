import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
}

export const EmailConfirmationGuard = ({ 
  children, 
  fallback, 
  featureName = "esta funcionalidade" 
}: EmailConfirmationGuardProps) => {
  const { user, isEmailConfirmed } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = React.useState(false);

  // Se não há usuário logado, não mostrar nada
  if (!user) {
    return null;
  }

  // Se email confirmado, mostrar conteúdo normal
  if (isEmailConfirmed) {
    return <>{children}</>;
  }

  // Se há fallback customizado, usar ele
  if (fallback) {
    return <>{fallback}</>;
  }

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
      toast({
        title: "Erro ao reenviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Mostrar aviso padrão
  return (
    <Alert className="border-amber-200 bg-amber-50 shadow-sm">
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="mb-3">
          <div className="font-semibold text-amber-900 mb-2">
            🔒 Email não confirmado
          </div>
          <div className="text-sm text-amber-700">
            Para acessar <strong>{featureName}</strong>, você precisa confirmar seu email primeiro.
            <br />
            <span className="text-xs mt-1 block text-amber-600">
              ✨ Confirme seu email e desbloqueie recursos exclusivos como UTI Coins e UTI Pro!
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resendConfirmation}
          disabled={isResending}
          className="border-amber-300 text-amber-800 hover:bg-amber-100 font-medium"
        >
          {isResending ? "Reenviando..." : "📬 Reenviar email de confirmação"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};