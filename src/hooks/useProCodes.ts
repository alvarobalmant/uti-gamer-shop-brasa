
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

  const redeemProCode = useCallback(async (codeId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      // Calculate end date based on code duration
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
    }
  }, [proCodes, toast, fetchProCodes]);

  useEffect(() => {
    fetchProCodes();
  }, [fetchProCodes]);

  return { 
    proCodes, 
    loading, 
    error, 
    fetchProCodes, 
    createProCode, 
    deactivateProCode, 
    redeemProCode 
  };
};
