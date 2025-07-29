import { useCallback } from 'react';
import { useProductContext } from '@/contexts/ProductContext';

/**
 * Hook para gerenciar o refresh automático de produtos após operações CRUD
 */
export const useProductRefresh = () => {
  const { refreshProducts } = useProductContext();

  const refreshAfterOperation = useCallback(async (operationName: string) => {
    try {
      console.log(`[useProductRefresh] Atualizando produtos após ${operationName}`);
      await refreshProducts();
      console.log(`[useProductRefresh] Produtos atualizados com sucesso após ${operationName}`);
    } catch (error) {
      console.error(`[useProductRefresh] Erro ao atualizar produtos após ${operationName}:`, error);
    }
  }, [refreshProducts]);

  return {
    refreshAfterOperation
  };
};