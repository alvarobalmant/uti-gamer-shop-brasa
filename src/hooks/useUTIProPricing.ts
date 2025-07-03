import { useMemo } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { useSubscriptions } from '@/hooks/useSubscriptions';

export interface UTIProPricing {
  isEnabled: boolean;
  proPrice: number | null;
  savings: number | null;
  discountPercentage: number | null;
}

export const useUTIProPricing = (product: Product): UTIProPricing => {
  const { hasActiveSubscription } = useSubscriptions();
  const isUserPro = hasActiveSubscription();

  return useMemo(() => {
    // Se UTI Pro não está habilitado para este produto
    if (!product.uti_pro_enabled) {
      return {
        isEnabled: false,
        proPrice: null,
        savings: null,
        discountPercentage: null,
      };
    }

    let proPrice: number;
    let discountPercentage: number;

    if (product.uti_pro_type === 'fixed' && product.uti_pro_custom_price) {
      // Preço fixo
      proPrice = product.uti_pro_custom_price;
      discountPercentage = Math.round(((product.price - proPrice) / product.price) * 100);
    } else {
      // Porcentagem de desconto
      const discount = product.uti_pro_value || 10;
      discountPercentage = discount;
      proPrice = product.price * (1 - discount / 100);
    }

    const savings = product.price - proPrice;

    return {
      isEnabled: true,
      proPrice: Math.max(0, proPrice), // Garantir que não seja negativo
      savings: Math.max(0, savings),
      discountPercentage,
    };
  }, [product]);
};