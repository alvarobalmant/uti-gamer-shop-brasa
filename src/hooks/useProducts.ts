
import { useState, useEffect } from 'react';
import { dummyProducts } from '@/data/products';
import { Product } from '@/types/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, productData: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

  const addProduct = async (productData: any): Promise<void> => {
    // TODO: Implement actual API call
    console.log('Adding product:', productData);
  };

  const updateProduct = async (id: string, productData: any): Promise<void> => {
    // TODO: Implement actual API call
    console.log('Updating product:', id, productData);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    // TODO: Implement actual API call
    console.log('Deleting product:', id);
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};

export type { Product };
