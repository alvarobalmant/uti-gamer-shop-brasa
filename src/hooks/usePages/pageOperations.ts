
import { Page } from './types';
import { mockPages } from './mockData';

// Utility functions for page operations
export const createPageOperations = (
  setPages: React.Dispatch<React.SetStateAction<Page[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  // Buscar uma página pelo slug
  const getPageBySlug = (pages: Page[], slug: string) => {
    return pages.find(page => page.slug === slug) || null;
  };

  // Buscar uma página pelo ID
  const getPageById = (pages: Page[], id: string) => {
    return pages.find(page => page.id === id) || null;
  };

  // Carregar todas as páginas
  const fetchPages = async () => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPages(mockPages);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar páginas');
      console.error(err);
    }
  };

  // Criar uma nova página
  const createPage = async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPage: Page = {
        ...pageData,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPages(prev => [...prev, newPage]);
      return newPage;
    } catch (err) {
      setError('Erro ao criar página');
      console.error(err);
      throw err;
    }
  };

  // Atualizar uma página existente
  const updatePage = async (id: string, pageData: Partial<Omit<Page, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedPage: Page | undefined;
      setPages(prev => {
        const updated = prev.map(page => {
          if (page.id === id) {
            updatedPage = { 
              ...page, 
              ...pageData, 
              updatedAt: new Date().toISOString() 
            };
            return updatedPage;
          }
          return page;
        });
        return updated;
      });
      
      return updatedPage;
    } catch (err) {
      setError(`Erro ao atualizar página ${id}`);
      console.error(err);
      throw err;
    }
  };

  // Excluir uma página
  const deletePage = async (id: string) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPages(prev => prev.filter(page => page.id !== id));
      return true;
    } catch (err) {
      setError(`Erro ao excluir página ${id}`);
      console.error(err);
      throw err;
    }
  };

  return {
    getPageBySlug,
    getPageById,
    fetchPages,
    createPage,
    updatePage,
    deletePage
  };
};
