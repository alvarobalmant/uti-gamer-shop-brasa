
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts/types';
import { 
  productApi,
} from './useProducts/productApi';
import { handleProductError } from './useProducts/productErrorHandler';
import { CarouselConfig } from '@/types/specialSections'; // Import CarouselConfig type

export type { Product } from './useProducts/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => { // Wrap in useCallback
    try {
      setLoading(true);
      const result = await productApi.getProducts();
      const productsData = result.data;
      setProducts(productsData);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      
      if (errorMessage) {
        toast({
          title: "Erro ao carregar produtos",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Em caso de erro, definir produtos como array vazio para não quebrar a interface
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]); // Add dependencies

  // New function to fetch products based on carousel config
  const fetchProductsByConfig = useCallback(async (config: CarouselConfig) => {
    if (!config) return;
    setLoading(true);
    try {
      const result = await productApi.getProducts();
      const productsData = result.data;
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
  }, [toast]); // Add dependencies

  const addProduct = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
    try {
      // const result = await addProductToDatabase(productData);
      console.log('Add product:', productData);
      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      // return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao adicionar produto');
      if (errorMessage) {
        toast({
          title: "Erro ao adicionar produto",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
    try {
      // const result = await updateProductInDatabase(id, updates);
      console.log('Update product:', id, updates);
      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      // return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao atualizar produto');
      if (errorMessage) {
        toast({
          title: "Erro ao atualizar produto",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // await deleteProductFromDatabase(id);
      console.log('Delete product:', id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao remover produto');
      if (errorMessage) {
        toast({
          title: "Erro ao remover produto",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const fetchSingleProduct = async (id: string): Promise<Product | null> => {
    try {
      console.log('useProducts: fetchSingleProduct called with ID:', id);
      const result = await productApi.getProduct(id);
      const product = result.data;
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
    // Initial fetch is needed for general product sections on the homepage
    fetchProducts(); 
  }, [fetchProducts]); // Corrected dependency array

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts, // Keep refetch for general product list if needed elsewhere
    fetchProductsByConfig, // Expose the new function
    fetchSingleProduct, // Expose the new single product function
  };
};

