import { useMemo, useCallback } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { useUTICoins } from '@/contexts/UTICoinsContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UTICoinsProductPricing {
  isEnabled: boolean;
  rate: number;
  maxDiscount: number;
  cashbackRate: number;
  canUseCoins: boolean;
  maxCoinsForDiscount: number;
  estimatedCashback: number;
  calculateDiscount: (coinsToSpend: number) => Promise<{
    success: boolean;
    discountAmount: number;
    coinsNeeded: number;
    message?: string;
  }>;
}

export const useUTICoinsProduct = (product: Product): UTICoinsProductPricing => {
  const { balance } = useUTICoins();
  const { user } = useAuth();

  const productConfig = useMemo(() => ({
    isEnabled: product.uti_coins_enabled || false,
    rate: product.uti_coins_rate || 0,
    maxDiscount: product.uti_coins_max_discount || 0,
    cashbackRate: product.uti_coins_cashback_rate || 0,
  }), [product]);

  const canUseCoins = useMemo(() => {
    return productConfig.isEnabled && 
           productConfig.rate > 0 && 
           balance > 0 && 
           !!user;
  }, [productConfig.isEnabled, productConfig.rate, balance, user]);

  const maxCoinsForDiscount = useMemo(() => {
    if (!canUseCoins) return 0;
    
    const maxFromPrice = Math.floor(product.price / productConfig.rate);
    const maxFromLimit = productConfig.maxDiscount > 0 
      ? Math.floor(productConfig.maxDiscount / productConfig.rate) 
      : Infinity;
    const maxFromBalance = balance;

    return Math.min(maxFromPrice, maxFromLimit, maxFromBalance);
  }, [canUseCoins, product.price, productConfig.rate, productConfig.maxDiscount, balance]);

  const estimatedCashback = useMemo(() => {
    if (!productConfig.isEnabled || !productConfig.cashbackRate) return 0;
    return Math.floor(product.price * productConfig.cashbackRate);
  }, [productConfig.isEnabled, productConfig.cashbackRate, product.price]);

  const calculateDiscount = useCallback(async (coinsToSpend: number) => {
    if (!user) {
      return {
        success: false,
        discountAmount: 0,
        coinsNeeded: 0,
        message: 'Usuário não logado'
      };
    }

    if (!canUseCoins) {
      return {
        success: false,
        discountAmount: 0,
        coinsNeeded: 0,
        message: 'Produto não permite desconto com UTI Coins'
      };
    }

    if (coinsToSpend <= 0 || coinsToSpend > balance) {
      return {
        success: false,
        discountAmount: 0,
        coinsNeeded: 0,
        message: 'Quantidade de UTI Coins inválida'
      };
    }

    try {
      const { data, error } = await supabase.rpc('apply_product_uti_coins_discount', {
        p_user_id: user.id,
        p_product_id: product.id,
        p_coins_to_spend: coinsToSpend
      });

      if (error) {
        console.error('Erro ao calcular desconto:', error);
        return {
          success: false,
          discountAmount: 0,
          coinsNeeded: 0,
          message: 'Erro ao calcular desconto'
        };
      }

      return {
        success: data.success,
        discountAmount: data.discount_amount || 0,
        coinsNeeded: data.coins_needed || 0,
        message: data.message
      };
    } catch (error) {
      console.error('Erro na função calculateDiscount:', error);
      return {
        success: false,
        discountAmount: 0,
        coinsNeeded: 0,
        message: 'Erro interno'
      };
    }
  }, [user, canUseCoins, balance, product.id]);

  return {
    isEnabled: productConfig.isEnabled,
    rate: productConfig.rate,
    maxDiscount: productConfig.maxDiscount,
    cashbackRate: productConfig.cashbackRate,
    canUseCoins,
    maxCoinsForDiscount,
    estimatedCashback,
    calculateDiscount
  };
};