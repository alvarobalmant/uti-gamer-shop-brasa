import { useState, useEffect } from 'react';
import { dummyProducts } from '@/data/products';
import { Product } from '@/types/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching products from an API
    setTimeout(() => {
      try {
        setProducts(dummyProducts);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }, 500);
  }, []);

  return { products, loading, error };
};

export type { Product };
