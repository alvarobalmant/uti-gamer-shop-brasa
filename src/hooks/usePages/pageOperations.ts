
import { Page } from './types';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPages: Page[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        isActive: page.is_active,
        theme: page.theme || { primaryColor: '#107C10', secondaryColor: '#3A3A3A' },
        filters: { tagIds: [], categoryIds: [] },
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }));

      setPages(transformedPages);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar páginas');
      console.error(err);
    }
  };

  // Criar uma nova página
  const createPage = async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert([{
          title: pageData.title,
          slug: pageData.slug,
          description: pageData.description,
          is_active: pageData.isActive,
          theme: pageData.theme
        }])
        .select()
        .single();

      if (error) throw error;

      const newPage: Page = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        isActive: data.is_active,
        theme: data.theme || { primaryColor: '#107C10', secondaryColor: '#3A3A3A' },
        filters: { tagIds: [], categoryIds: [] },
        createdAt: data.created_at,
        updatedAt: data.updated_at
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
      const { data, error } = await supabase
        .from('pages')
        .update({
          title: pageData.title,
          slug: pageData.slug,
          description: pageData.description,
          is_active: pageData.isActive,
          theme: pageData.theme
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPage: Page = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        isActive: data.is_active,
        theme: data.theme || { primaryColor: '#107C10', secondaryColor: '#3A3A3A' },
        filters: { tagIds: [], categoryIds: [] },
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setPages(prev => prev.map(page => page.id === id ? updatedPage : page));
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
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
