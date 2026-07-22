// Main products hook - uses integra_products table
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts/types';
import { 
  fetchProductsFromDatabase, 
  addProductToDatabase, 
  updateProductInDatabase, 
  deleteProductFromDatabase,
  fetchProductsByCriteria,
  fetchSingleProductFromDatabase
} from './useProducts/productApi';
import { handleProductError } from './useProducts/productErrorHandler';
import { CarouselConfig } from '@/types/specialSections';
import { invalidateAllProductCaches, debugProductLoading } from './useProducts/cacheInvalidator';

export type { Product } from './useProducts/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async (includeAdmin: boolean = true) => {
    try {
      setLoading(true);
      console.log('[useProducts] Fetching products from integra_products');
      const productsData = await fetchProductsFromDatabase(includeAdmin);
      console.log('[useProducts] Fetched products count:', productsData.length);
      debugProductLoading(productsData, 'useProducts.fetchProducts');
      setProducts(productsData);
    } catch (error: any) {
      console.error('[useProducts] Error fetching products:', error);
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      
      if (errorMessage) {
        toast({
          title: "Erro ao carregar produtos",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      setProducts([]);
      invalidateAllProductCaches();
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchProductsByConfig = useCallback(async (config: CarouselConfig) => {
    if (!config) return;
    setLoading(true);
    try {
      const productsData = await fetchProductsByCriteria(config);
      setProducts(productsData);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos do carrossel');
      if (errorMessage) {
        toast({
          title: "Erro ao carregar produtos do carrossel",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addProduct = async (productData: any) => {
    try {
      const created = await addProductToDatabase(productData);
      if (created) {
        setProducts(prev => [created, ...prev]);
        toast({ title: 'Produto criado', description: created.name });
      }
      return created;
    } catch (error: any) {
      console.error('[useProducts] addProduct error:', error);
      toast({ title: 'Erro ao criar produto', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      const updated = await updateProductInDatabase(id, updates);
      if (updated) {
        setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
        toast({ title: 'Produto atualizado', description: updated.name });
      }
      return updated;
    } catch (error: any) {
      console.error('[useProducts] updateProduct error:', error);
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromDatabase(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Produto removido' });
    } catch (error: any) {
      console.error('[useProducts] deleteProduct error:', error);
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' });
    }
  };

  const fetchSingleProduct = async (id: string): Promise<Product | null> => {
    try {
      console.log('useProducts: fetchSingleProduct called with ID:', id);
      const product = await fetchSingleProductFromDatabase(id);
      console.log('useProducts: fetchSingleProduct result:', product);
      return product;
    } catch (error: any) {
      console.error('useProducts: Error fetching single product:', error);
      const errorMessage = handleProductError(error, 'ao carregar produto');
      if (errorMessage) {
        toast({
          title: "Erro ao carregar produto",
          description: errorMessage,
          variant: "destructive",
        });
      }
      return null;
    }
  };

  useEffect(() => {
    console.log('[useProducts] Initial fetch from integra_products');
    fetchProducts(true); 
  }, [fetchProducts]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
    refreshProducts: fetchProducts,
    fetchProductsByConfig,
    fetchSingleProduct,
  };
};

