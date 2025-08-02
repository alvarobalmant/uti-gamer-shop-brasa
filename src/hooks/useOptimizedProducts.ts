
import { useProducts } from './useProducts';

// Stub hook that falls back to regular useProducts
export const useOptimizedProducts = () => {
  const { data: products, isLoading, error } = useProducts();
  
  return {
    data: products || [],
    isLoading,
    error
  };
};
