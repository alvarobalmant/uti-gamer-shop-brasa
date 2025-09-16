import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SIMPLIFICADO: Hook para navegação unificada usando React Router diretamente
 * Remove complexidade do GlobalNavigationContext que causa conflitos de scroll
 */
export const useGlobalNavigationLinks = () => {
  const navigate = useNavigate();

  // Função para navegar para páginas de categoria
  const navigateToCategory = useCallback((category: string) => {
    navigate(`/${category}`);
  }, [navigate]);

  // Função para navegar para home
  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Função para navegar para busca
  const navigateToSearch = useCallback((query: string) => {
    navigate(`/busca?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  // Função para navegar para produto
  const navigateToProduct = useCallback((productId: string) => {
    navigate(`/produto/${productId}`);
  }, [navigate]);

  return {
    navigateToCategory,
    navigateToHome,
    navigateToSearch,
    navigateToProduct,
  };
};