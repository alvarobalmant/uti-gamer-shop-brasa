import { Product } from '@/hooks/useProducts/types';

export const useProductsEnhanced = () => {
  return {
    products: [] as Product[],
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
    addProduct: (...args: any[]) => Promise.resolve(),
    updateProduct: (...args: any[]) => Promise.resolve(),
    deleteProduct: (...args: any[]) => Promise.resolve(),
    refreshProducts: () => {},
    batchOperations: {
      updateMultiple: (...args: any[]) => Promise.resolve(),
      deleteMultiple: (...args: any[]) => Promise.resolve()
    }
  };
};

export const useProductsAdmin = () => {
  return {
    products: [] as Product[],
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
    addProduct: (...args: any[]) => Promise.resolve(),
    updateProduct: (...args: any[]) => Promise.resolve(),
    deleteProduct: (...args: any[]) => Promise.resolve(),
    refreshProducts: () => {},
    batchOperations: {
      updateMultiple: (...args: any[]) => Promise.resolve(),
      deleteMultiple: (...args: any[]) => Promise.resolve()
    }
  };
};