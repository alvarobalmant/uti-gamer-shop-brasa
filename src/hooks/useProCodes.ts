
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ProCode {
  id: string;
  code: string;
  duration_months: number;
  created_at: string;
  expires_at: string | null;
  used_by: string | null;
  used_at: string | null;
  is_active: boolean;
  created_by?: string | null;
}

export const useProCodes = () => {
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [redeemingCode, setRedeemingCode] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Gerar um novo código UTI PRO (apenas admin)
  const generateCode = async (durationMonths: number): Promise<ProCode | null> => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem gerar códigos UTI PRO.",
        variant: "destructive",
      });
      return null;
    }

    setGeneratingCode(true);
    
    try {
      // Gerar código aleatório (formato: UTI-XXXX-XXXX-XXXX)
      const randomPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `UTI-${randomPart()}-${randomPart()}-${randomPart()}`;
      
      // Calcular data de expiração (3 meses após geração)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3);
      
      // Inserir no banco de dados
      const { data, error } = await supabase
        .from('pro_codes')
        .insert({
          code,
          duration_months: durationMonths,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          created_by: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Código gerado com sucesso",
        description: `Código UTI PRO válido por ${durationMonths} meses criado.`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro ao gerar código:', error);
      toast({
        title: "Erro ao gerar código",
        description: error.message || "Ocorreu um erro ao gerar o código UTI PRO.",
        variant: "destructive",
      });
      return null;
    } finally {
      setGeneratingCode(false);
    }
  };

  // Resgatar um código UTI PRO (usuários)
  const redeemCode = async (code: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para resgatar um código UTI PRO.",
        variant: "destructive",
      });
      return false;
    }

    setRedeemingCode(true);
    
    try {
      console.log('Tentando resgatar código:', code);
      
      // Verificar se o código existe e está ativo
      const { data: codeData, error: codeError } = await supabase
        .from('pro_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .is('used_by', null)
        .single();
      
      if (codeError || !codeData) {
        console.error('Código não encontrado:', codeError);
        toast({
          title: "Código inválido",
          description: "O código informado não existe, já foi utilizado ou está expirado.",
          variant: "destructive",
        });
        return false;
      }
      
      // Verificar se o código não expirou
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        toast({
          title: "Código expirado",
          description: "Este código UTI PRO expirou e não pode mais ser utilizado.",
          variant: "destructive",
        });
        return false;
      }
      
      // Calcular data de término da assinatura
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + codeData.duration_months);
      
      console.log('Chamando função redeem_pro_code com:', {
        p_code_id: codeData.id,
        p_user_id: user.id,
        p_end_date: endDate.toISOString()
      });
      
      // Usar a função RPC para resgatar o código
      const { data: result, error: redeemError } = await supabase.rpc('redeem_pro_code', {
        p_code_id: codeData.id,
        p_user_id: user.id,
        p_end_date: endDate.toISOString()
      });
      
      if (redeemError) {
        console.error('Erro na função redeem_pro_code:', redeemError);
        throw redeemError;
      }
      
      console.log('Resultado da função:', result);
      
      // Handle the result properly - it could be a boolean or an object
      let success = false;
      let message = '';
      
      if (typeof result === 'boolean') {
        success = result;
      } else if (typeof result === 'object' && result !== null) {
        success = (result as any).success === true;
        message = (result as any).message || '';
      }
      
      if (success) {
        toast({
          title: "Código resgatado com sucesso!",
          description: `Sua assinatura UTI PRO foi ativada por ${codeData.duration_months} meses.`,
        });
        return true;
      } else {
        throw new Error(message || 'Erro desconhecido ao resgatar código');
      }
    } catch (error: any) {
      console.error('Erro ao resgatar código:', error);
      toast({
        title: "Erro ao resgatar código",
        description: error.message || "Ocorreu um erro ao processar o código UTI PRO.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRedeemingCode(false);
    }
  };

  // Listar todos os códigos (apenas admin)
  const listCodes = async (): Promise<ProCode[]> => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem listar códigos UTI PRO.",
        variant: "destructive",
      });
      return [];
    }

    setLoading(true);
    
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
        title: "Erro ao listar códigos",
        description: error.message || "Ocorreu um erro ao buscar os códigos UTI PRO.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Desativar um código (apenas admin)
  const deactivateCode = async (codeId: string): Promise<boolean> => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem desativar códigos UTI PRO.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('pro_codes')
        .update({ is_active: false })
        .eq('id', codeId);
      
      if (error) throw error;
      
      toast({
        title: "Código desativado",
        description: "O código UTI PRO foi desativado com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao desativar código:', error);
      toast({
        title: "Erro ao desativar código",
        description: error.message || "Ocorreu um erro ao desativar o código UTI PRO.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateCode,
    redeemCode,
    listCodes,
    deactivateCode,
    loading,
    generatingCode,
    redeemingCode
  };
};
