import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProductPriceManager = () => {
  const [loading, setLoading] = useState(false);

  const updateProductPrice = async (productId: string, price: number | null, proPrice?: number | null, listPrice?: number | null) => {
    setLoading(true);
    
    try {
      console.log('Atualizando preço do produto:', { productId, price, proPrice, listPrice });
      
      // Preparar update específico apenas para preços
      const updates: { 
        price?: number | null; 
        pro_price?: number | null; 
        list_price?: number | null;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString()
      };
      
      if (price !== undefined) updates.price = price;
      if (proPrice !== undefined) updates.pro_price = proPrice;
      if (listPrice !== undefined) updates.list_price = listPrice;

      console.log('Updates de preço que serão enviados:', updates);
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw new Error(`Erro ao atualizar preço: ${error.message}`);
      }

      console.log('Preço atualizado com sucesso:', data);
      toast.success('Preço atualizado com sucesso!');
      return data;

    } catch (error) {
      console.error('Erro ao atualizar preço do produto:', error);
      toast.error('Erro ao atualizar preço');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProductPrice,
    loading
  };
};