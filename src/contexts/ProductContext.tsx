import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/hooks/useProducts/types';
import {
  fetchProductsFromDatabase,
  addProductToDatabase,
  updateProductInDatabase,
  deleteProductFromDatabase,
} from '@/hooks/useProducts/productApi';
import { handleProductError } from '@/hooks/useProducts/productErrorHandler';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  lastUpdated: Date | null;
  fetchProducts: (includeAdmin?: boolean) => Promise<void>;
  addProduct: (product: any) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  invalidateCache: () => void;
  getProductById: (id: string) => Product | undefined;
  subscribeToUpdates: (callback: (products: Product[]) => void) => () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [subscribers, setSubscribers] = useState<Set<(products: Product[]) => void>>(new Set());
  const { toast } = useToast();

  const notifySubscribers = useCallback((updatedProducts: Product[]) => {
    subscribers.forEach(callback => {
      try {
        callback(updatedProducts);
      } catch (error) {
        console.error('Erro ao notificar subscriber:', error);
      }
    });
  }, [subscribers]);

  const fetchProducts = useCallback(async (includeAdmin: boolean = false) => {
    try {
      setLoading(true);
      console.log('[ProductContext] Fetching from integra_products...');
      
      const productsData = await fetchProductsFromDatabase(includeAdmin);
      setProducts(productsData);
      setLastUpdated(new Date());
      notifySubscribers(productsData);
      
      console.log(`[ProductContext] ${productsData.length} produtos carregados`);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      if (errorMessage) {
        toast({
          title: "Erro ao carregar produtos",
          description: errorMessage,
          variant: "destructive",
        });
      }
      console.error('[ProductContext] Erro:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast, notifySubscribers]);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const invalidateCache = useCallback(() => {
    setLastUpdated(null);
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: any): Promise<Product | null> => {
    try {
      const created = await addProductToDatabase(productData);
      if (created) {
        setProducts(prev => [created, ...prev]);
        toast({ title: 'Produto criado', description: created.name });
      }
      return created;
    } catch (error: any) {
      toast({ title: 'Erro ao criar produto', description: error.message, variant: 'destructive' });
      return null;
    }
  }, [toast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const updated = await updateProductInDatabase(id, updates);
      if (updated) {
        setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
        notifySubscribers(products.map(p => (p.id === id ? updated : p)));
        toast({ title: 'Produto atualizado', description: updated.name });
      }
      return updated;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      return null;
    }
  }, [toast, products, notifySubscribers]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteProductFromDatabase(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Produto removido' });
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
      return false;
    }
  }, [toast]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  const subscribeToUpdates = useCallback((callback: (products: Product[]) => void) => {
    setSubscribers(prev => new Set(prev).add(callback));
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value: ProductContextType = {
    products,
    loading,
    lastUpdated,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    invalidateCache,
    getProductById,
    subscribeToUpdates,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext deve ser usado dentro de um ProductProvider');
  }
  return context;
};

export const useProductPage = (productId: string) => {
  const { getProductById, subscribeToUpdates, refreshProducts } = useProductContext();
  const [product, setProduct] = useState<Product | undefined>();

  useEffect(() => {
    const foundProduct = getProductById(productId);
    setProduct(foundProduct);

    const unsubscribe = subscribeToUpdates((products) => {
      const updatedProduct = products.find(p => p.id === productId);
      setProduct(updatedProduct);
    });

    return unsubscribe;
  }, [productId, getProductById, subscribeToUpdates]);

  return { product, refreshProduct: refreshProducts };
};

export default ProductContext;

