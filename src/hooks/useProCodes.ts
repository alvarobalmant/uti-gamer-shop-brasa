
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProCode {
  id: string;
  code: string;
  duration_months: number;
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

  const deactivateProCode = useCallback(async (id: string) => {
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
    } catch (err: any) {
      console.error('Error deactivating pro code:', err);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao desativar código PRO.', 
        variant: 'destructive' 
      });
      throw err;
    }
  }, [toast, fetchProCodes]);

  const deactivateCode = useCallback(async (id: string) => {
    const success = await deactivateProCode(id);
    return !!success;
  }, [deactivateProCode]);

  const redeemProCode = useCallback(async (codeId: string) => {
    setRedeemingCode(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      const code = proCodes.find(c => c.id === codeId);
      if (!code) {
        throw new Error('Código não encontrado');
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + code.duration_months);

      const { data, error } = await supabase.rpc('redeem_pro_code', {
        p_code_id: codeId,
        p_user_id: user.user.id,
        p_end_date: endDate.toISOString()
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast({ 
          title: 'Sucesso', 
          description: result.message 
        });
        await fetchProCodes();
      } else {
        throw new Error(result.message);
      }

      return result;
    } catch (err: any) {
      console.error('Error redeeming pro code:', err);
      toast({ 
        title: 'Erro', 
        description: err.message || 'Falha ao resgatar código PRO.', 
        variant: 'destructive' 
      });
      throw err;
    } finally {
      setRedeemingCode(false);
    }
  }, [proCodes, toast, fetchProCodes]);

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
    listCodes,
    createProCode, 
    deactivateProCode,
    deactivateCode,
    redeemProCode,
    redeemCode
  };
};
