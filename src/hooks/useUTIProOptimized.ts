import { useMemo } from 'react';
import { Product } from '@/hooks/useProducts/types';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export interface UTIProPricingOptimized {
  isEnabled: boolean;
  isUserPro: boolean;
  proPrice: number | null;
  savings: number | null;
  discountPercentage: number | null;
  showProMessage: boolean;
  showMemberMessage: boolean;
  loading: boolean;
}

export const useUTIProOptimized = (product: Product): UTIProPricingOptimized => {
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscriptions();
  const { utiProSettings, loading: settingsLoading } = useSiteSettings();
  
  return useMemo(() => {
    const isLoading = subscriptionLoading || settingsLoading;
    const isUserPro = hasActiveSubscription();
    
    // Se ainda está carregando, não mostrar nada do UTI PRO
    if (isLoading) {
      return {
        isEnabled: false,
        isUserPro: false,
        proPrice: null,
        savings: null,
        discountPercentage: null,
        showProMessage: false,
        showMemberMessage: false,
        loading: true,
      };
    }

    // Verifica se o UTI PRO está globalmente habilitado
    if (!utiProSettings.enabled) {
      return {
        isEnabled: false,
        isUserPro: false,
        proPrice: null,
        savings: null,
        discountPercentage: null,
        showProMessage: false,
        showMemberMessage: false,
        loading: false,
      };
    }

    // Só mostra preço PRO se foi configurado no admin (tem pro_price)
    if (!product.pro_price || product.pro_price <= 0) {
      return {
        isEnabled: false,
        isUserPro: isUserPro,
        proPrice: null,
        savings: null,
        discountPercentage: null,
        showProMessage: false,
        showMemberMessage: false,
        loading: false,
      };
    }

    const proPrice = product.pro_price;
    const savings = product.price - proPrice;
    const discountPercentage = Math.round(((product.price - proPrice) / product.price) * 100);

    return {
      isEnabled: true,
      isUserPro: isUserPro,
      proPrice: Math.max(0, proPrice),
      savings: Math.max(0, savings),
      discountPercentage: Math.max(0, discountPercentage),
      showProMessage: !isUserPro, // Mostra "Preço Membro UTI PRO" para não membros
      showMemberMessage: isUserPro, // Mostra "Seu Preço UTI PRO" para membros
      loading: false,
    };
  }, [product, utiProSettings.enabled, hasActiveSubscription, subscriptionLoading, settingsLoading]);
};