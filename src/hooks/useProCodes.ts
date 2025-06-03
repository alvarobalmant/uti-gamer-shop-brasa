
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ProCode {
  id: string;
  code: string;
  duration_months: number;
  created_by: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const useProCodes = () => {
  const [redeemingCode, setRedeemingCode] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateCode = async (durationMonths: number): Promise<ProCode | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerar códigos.",
        variant: "destructive",
      });
      return null;
    }

    setGeneratingCode(true);

    try {
      // Generate a random code
      const code = Math.random().toString(36).substring(2, 15).toUpperCase();
      
      const { data, error } = await supabase
        .from('pro_codes')
        .insert({
          code,
          duration_months: durationMonths,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Código gerado com sucesso!",
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao gerar código:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar código.",
        variant: "destructive",
      });
      return null;
    } finally {
      setGeneratingCode(false);
    }
  };

  const listCodes = async (): Promise<ProCode[]> => {
    try {
      const { data, error } = await supabase
        .from('pro_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Erro ao listar códigos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar códigos.",
        variant: "destructive",
      });
      return [];
    }
  };

  const deactivateCode = async (codeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('pro_codes')
        .update({ is_active: false })
        .eq('id', codeId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Código desativado com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao desativar código:', error);
      toast({
        title: "Erro",
        description: "Erro ao desativar código.",
        variant: "destructive",
      });
      return false;
    }
  };

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

      // Type the result properly
      const typedResult = result as { success: boolean; message?: string } | null;

      if (typedResult && typedResult.success) {
        toast({
          title: "Sucesso!",
          description: "Código resgatado com sucesso! Sua assinatura UTI PRO está ativa.",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: typedResult?.message || "Erro ao processar código.",
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
    generateCode,
    generatingCode,
    listCodes,
    deactivateCode,
  };
};
