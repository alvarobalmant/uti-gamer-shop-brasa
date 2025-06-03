<<<<<<< HEAD
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
=======
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b

export interface ProCode {
  id: string;
  code: string;
  duration_months: number;
<<<<<<< HEAD
  created_at: string;
  expires_at: string | null;
  used_by: string | null;
  used_at: string | null;
  is_active: boolean;
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
      expiresAt.setMonth(expiresAt.getMonth() + 3); // Códigos expiram em 3 meses se não usados
      
      // Inserir no banco de dados
      const { data, error } = await supabase
        .from('pro_codes')
        .insert({
          code,
          duration_months: durationMonths,
          expires_at: expiresAt.toISOString(),
          is_active: true
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
      // Verificar se o código existe e está ativo
      const { data: codeData, error: codeError } = await supabase
        .from('pro_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .is('used_by', null)
        .single();
      
      if (codeError || !codeData) {
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
      
      // Iniciar transação para atualizar o código e criar/atualizar a assinatura
      const { data: subscription, error: subscriptionError } = await supabase.rpc('redeem_pro_code', {
        p_code_id: codeData.id,
        p_user_id: user.id,
        p_end_date: endDate.toISOString()
      });
      
      if (subscriptionError) throw subscriptionError;
      
      toast({
        title: "Código resgatado com sucesso!",
        description: `Sua assinatura UTI PRO foi ativada por ${codeData.duration_months} meses.`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao resgatar código",
        description: error.message || "Ocorreu um erro ao processar o código UTI PRO.",
        variant: "destructive",
=======
  expires_at?: string;
  used_by?: string;
  used_at?: string;
  is_active: boolean;
  created_at?: string;
  created_by?: string;
}

export const useProCodes = () => {
  const [proCodes, setProCodes] = useState<ProCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingCode, setGeneratingCode] = useState<boolean>(false);
  const [redeemingCode, setRedeemingCode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('pro_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProCodes(data || []);
    } catch (err: any) {
      console.error('Error fetching pro codes:', err);
      setError('Falha ao carregar códigos PRO.');
      setProCodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const generateCode = useCallback(async (durationMonths: number) => {
    setGeneratingCode(true);
    try {
      const code = generateRandomCode();
      const { data, error: insertError } = await supabase
        .from('pro_codes')
        .insert([{ 
          code, 
          duration_months: durationMonths, 
          is_active: true 
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Código PRO gerado com sucesso.' 
      });

      await fetchProCodes();
      return data;
    } catch (err: any) {
      console.error('Error generating pro code:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao gerar código PRO.', 
        variant: 'destructive' 
      });
      throw err;
    } finally {
      setGeneratingCode(false);
    }
  }, [toast, fetchProCodes]);

  const listCodes = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('pro_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err: any) {
      console.error('Error listing pro codes:', err);
      return [];
    }
  }, []);

  const createProCode = useCallback(async (codeData: { code: string; duration_months: number; expires_at?: string }) => {
    try {
      const { data, error: insertError } = await supabase
        .from('pro_codes')
        .insert([{ ...codeData, is_active: true }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ 
        title: 'Sucesso', 
        description: 'Código PRO criado com sucesso.' 
      });

      await fetchProCodes();
      return data;
    } catch (err: any) {
      console.error('Error creating pro code:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao criar código PRO.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProCodes]);

  const deactivateProCode = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('pro_codes')
        .update({ is_active: false })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({ 
        title: 'Sucesso', 
        description: 'Código PRO desativado com sucesso.' 
      });

      await fetchProCodes();
      return true;
    } catch (err: any) {
      console.error('Error deactivating pro code:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao desativar código PRO.', 
        variant: 'destructive' 
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
      });
      return false;
    } finally {
      setRedeemingCode(false);
    }
  };

<<<<<<< HEAD
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
=======
  const redeemCode = useCallback(async (code: string) => {
    const foundCode = proCodes.find(c => c.code === code);
    if (!foundCode) {
      throw new Error('Código não encontrado');
    }
    return await redeemProCode(foundCode.id);
  }, [proCodes, redeemProCode]);

  useEffect(() => {
    fetchProCodes();
  }, [fetchProCodes]);

  return { 
    proCodes, 
    loading, 
    error, 
    generatingCode,
    redeemingCode,
    fetchProCodes, 
    generateCode,
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
    listCodes,
    deactivateCode,
<<<<<<< HEAD
    loading,
    generatingCode,
    redeemingCode
=======
    redeemProCode,
    redeemCode
>>>>>>> da2b0b990b4d707ba50852d48a4480b97c38074b
  };
};
