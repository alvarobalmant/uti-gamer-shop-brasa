
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts/types';
import { 
  fetchProductsFromDatabase, 
  addProductToDatabase, 
  updateProductInDatabase, 
  deleteProductFromDatabase 
} from './useProducts/productApi';
import { handleProductError } from './useProducts/productErrorHandler';

export type { Product } from './useProducts/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await fetchProductsFromDatabase();
      setProducts(productsData);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      
      toast({
        title: "Erro ao carregar produtos",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Em caso de erro, definir produtos como array vazio para não quebrar a interface
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
    try {
      const result = await addProductToDatabase(productData);
      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao adicionar produto');
      toast({
        title: "Erro ao adicionar produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
    try {
      const result = await updateProductInDatabase(id, updates);
      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao atualizar produto');
      toast({
        title: "Erro ao atualizar produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromDatabase(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao remover produto');
      toast({
        title: "Erro ao remover produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
