import { Product } from '@/hooks/useProducts/types';

export const useProductDetail = (id: string | undefined) => {
  return {
    product: null as Product | null,
    skuNavigation: null,
    loading: true,
    error: null
  };
};