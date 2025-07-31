import { Product } from '@/hooks/useProducts/types';

export const useHomepageProducts = () => {
  return {
    products: [] as Product[],
    data: [] as Product[],
    loading: false,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve()
  };
};