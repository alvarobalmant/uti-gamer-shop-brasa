
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useProCodes = () => {
  const [redeemingCode, setRedeemingCode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const redeemCode = async (code: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para resgatar um código.",
        variant: "destructive",
      });
      return false;
    }

    if (!code.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código válido.",
        variant: "destructive",
      });
      return false;
    }

    setRedeemingCode(true);

    try {
      // First, find the code
      const { data: codeData, error: findError } = await supabase
        .from('pro_codes')
        .select('*')
        .eq('code', code.trim())
        .eq('is_active', true)
        .is('used_by', null)
        .single();

      if (findError || !codeData) {
        toast({
          title: "Código inválido",
          description: "Código não encontrado ou já utilizado.",
          variant: "destructive",
        });
        return false;
      }

      // Check if code is expired
      if (codeData.expires_at) {
        const now = new Date();
        const expirationDate = new Date(codeData.expires_at);
        if (expirationDate <= now) {
          toast({
            title: "Código expirado",
            description: "Este código já expirou.",
            variant: "destructive",
          });
          return false;
        }
      }

      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + codeData.duration_months);

      // Use the redeem function
      const { data: result, error: redeemError } = await supabase
        .rpc('redeem_pro_code', {
          p_code_id: codeData.id,
          p_user_id: user.id,
          p_end_date: endDate.toISOString()
        });

      if (redeemError) {
        console.error('Erro ao resgatar código:', redeemError);
        toast({
          title: "Erro",
          description: "Erro interno ao processar código.",
          variant: "destructive",
        });
        return false;
      }

      if (result && result.success) {
        toast({
          title: "Sucesso!",
          description: "Código resgatado com sucesso! Sua assinatura UTI PRO está ativa.",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: result?.message || "Erro ao processar código.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao resgatar código:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao resgatar código.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRedeemingCode(false);
    }
  };

  return {
    redeemCode,
    redeemingCode,
  };
};
