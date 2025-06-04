import { useState, useEffect, useCallback } from 'react';

// Definição dos tipos para páginas dinâmicas
export interface PageTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  bannerImage?: string;
}

export interface PageFilter {
  tagIds?: string[];
  categoryIds?: string[];
  excludeTagIds?: string[];
  excludeCategoryIds?: string[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  theme: PageTheme;
  filters: PageFilter;
  createdAt: string;
  updatedAt: string;
}

export interface PageLayoutItem {
  id: number;
  pageId: string;
  sectionKey: string;
  title?: string;
  displayOrder: number;
  isVisible: boolean;
  sectionType: 'banner' | 'products' | 'featured' | 'custom';
  sectionConfig?: any; // Configurações específicas da seção
}

// Mock de dados iniciais para as páginas de plataforma
const initialPages: Page[] = [
  {
    id: '1',
    title: 'Xbox',
    slug: 'xbox',
    description: 'Tudo sobre Xbox: jogos, consoles e acessórios',
    isActive: true,
    theme: {
      primaryColor: '#107C10',
      secondaryColor: '#3A3A3A',
      accentColor: '#52B043',
      bannerImage: '/banners/xbox-banner.jpg'
    },
    filters: {
      tagIds: ['xbox', 'microsoft'],
      categoryIds: ['consoles', 'jogos', 'acessorios']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'PlayStation',
    slug: 'playstation',
    description: 'Descubra o universo PlayStation: PS5, PS4, jogos exclusivos e mais',
    isActive: true,
    theme: {
      primaryColor: '#0070D1',
      secondaryColor: '#1F1F1F',
      accentColor: '#FFFFFF',
      bannerImage: '/banners/playstation-banner.jpg'
    },
    filters: {
      tagIds: ['playstation', 'sony'],
      categoryIds: ['consoles', 'jogos', 'acessorios']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Nintendo',
    slug: 'nintendo',
    description: 'O mundo mágico da Nintendo: Switch, jogos para toda a família e personagens icônicos',
    isActive: true,
    theme: {
      primaryColor: '#E60012',
      secondaryColor: '#FFFFFF',
      accentColor: '#00C3E3',
      bannerImage: '/banners/nintendo-banner.jpg'
    },
    filters: {
      tagIds: ['nintendo', 'switch'],
      categoryIds: ['consoles', 'jogos', 'acessorios']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock de dados iniciais para o layout das páginas
const initialPageLayouts: Record<string, PageLayoutItem[]> = {
  '1': [ // Xbox
    {
      id: 101,
      pageId: '1',
      sectionKey: 'hero_banner',
      title: 'Banner Principal',
      displayOrder: 1,
      isVisible: true,
      sectionType: 'banner',
      sectionConfig: {
        imageUrl: '/banners/xbox-hero.jpg',
        title: 'Xbox Series X|S',
        subtitle: 'Poder Inigualável',
        ctaText: 'Comprar Agora',
        ctaLink: '/categoria/xbox-consoles'
      }
    },
    {
      id: 102,
      pageId: '1',
      sectionKey: 'featured_products',
      title: 'Destaques Xbox',
      displayOrder: 2,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['xbox', 'destaque'],
          limit: 8
        }
      }
    },
    {
      id: 103,
      pageId: '1',
      sectionKey: 'new_releases',
      title: 'Lançamentos',
      displayOrder: 3,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['xbox', 'lancamento'],
          limit: 6
        }
      }
    },
    {
      id: 104,
      pageId: '1',
      sectionKey: 'accessories',
      title: 'Acessórios',
      displayOrder: 4,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['xbox', 'acessorio'],
          limit: 4
        }
      }
    }
  ],
  '2': [ // PlayStation
    {
      id: 201,
      pageId: '2',
      sectionKey: 'hero_banner',
      title: 'Banner Principal',
      displayOrder: 1,
      isVisible: true,
      sectionType: 'banner',
      sectionConfig: {
        imageUrl: '/banners/playstation-hero.jpg',
        title: 'PlayStation 5',
        subtitle: 'Jogue Sem Limites',
        ctaText: 'Explorar',
        ctaLink: '/categoria/playstation-consoles'
      }
    },
    {
      id: 202,
      pageId: '2',
      sectionKey: 'featured_products',
      title: 'Destaques PlayStation',
      displayOrder: 2,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['playstation', 'destaque'],
          limit: 8
        }
      }
    },
    {
      id: 203,
      pageId: '2',
      sectionKey: 'exclusives',
      title: 'Exclusivos',
      displayOrder: 3,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['playstation', 'exclusivo'],
          limit: 6
        }
      }
    },
    {
      id: 204,
      pageId: '2',
      sectionKey: 'accessories',
      title: 'Acessórios',
      displayOrder: 4,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['playstation', 'acessorio'],
          limit: 4
        }
      }
    }
  ],
  '3': [ // Nintendo
    {
      id: 301,
      pageId: '3',
      sectionKey: 'hero_banner',
      title: 'Banner Principal',
      displayOrder: 1,
      isVisible: true,
      sectionType: 'banner',
      sectionConfig: {
        imageUrl: '/banners/nintendo-hero.jpg',
        title: 'Nintendo Switch',
        subtitle: 'Diversão Para Todos',
        ctaText: 'Descubra',
        ctaLink: '/categoria/nintendo-consoles'
      }
    },
    {
      id: 302,
      pageId: '3',
      sectionKey: 'featured_products',
      title: 'Destaques Nintendo',
      displayOrder: 2,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['nintendo', 'destaque'],
          limit: 8
        }
      }
    },
    {
      id: 303,
      pageId: '3',
      sectionKey: 'family_games',
      title: 'Jogos para Família',
      displayOrder: 3,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['nintendo', 'familia'],
          limit: 6
        }
      }
    },
    {
      id: 304,
      pageId: '3',
      sectionKey: 'accessories',
      title: 'Acessórios',
      displayOrder: 4,
      isVisible: true,
      sectionType: 'products',
      sectionConfig: {
        filter: {
          tagIds: ['nintendo', 'acessorio'],
          limit: 4
        }
      }
    }
  ]
};

// Hook para gerenciar páginas dinâmicas
export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageLayouts, setPageLayouts] = useState<Record<string, PageLayoutItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todas as páginas
  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPages(initialPages);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar páginas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar layout de uma página específica
  const fetchPageLayout = useCallback(async (pageId: string) => {
    setLoading(true);
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 300));
      const layout = initialPageLayouts[pageId] || [];
      setPageLayouts(prev => ({ ...prev, [pageId]: layout }));
      setError(null);
      return layout;
    } catch (err) {
      setError(`Erro ao carregar layout da página ${pageId}`);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar uma página pelo slug
  const getPageBySlug = useCallback((slug: string) => {
    return pages.find(page => page.slug === slug) || null;
  }, [pages]);

  // Buscar uma página pelo ID
  const getPageById = useCallback((id: string) => {
    return pages.find(page => page.id === id) || null;
  }, [pages]);

  // Criar uma nova página
  const createPage = useCallback(async (pageData: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
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
  }, []);

  // Atualizar uma página existente
  const updatePage = useCallback(async (id: string, pageData: Partial<Omit<Page, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPages(prev => prev.map(page => 
        page.id === id 
          ? { 
              ...page, 
              ...pageData, 
              updatedAt: new Date().toISOString() 
            } 
          : page
      ));
      
      return getPageById(id);
    } catch (err) {
      setError(`Erro ao atualizar página ${id}`);
      console.error(err);
      throw err;
    }
  }, [getPageById]);

  // Excluir uma página
  const deletePage = useCallback(async (id: string) => {
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
  }, []);

  // Atualizar layout de uma página
  const updatePageLayout = useCallback(async (pageId: string, layoutItems: Partial<PageLayoutItem>[]) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentLayout = pageLayouts[pageId] || [];
      
      const updatedLayout = layoutItems.map(item => {
        const existingItem = currentLayout.find(i => i.id === item.id);
        if (existingItem) {
          return { ...existingItem, ...item };
        }
        return item as PageLayoutItem;
      });
      
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout as PageLayoutItem[] }));
      return updatedLayout;
    } catch (err) {
      setError(`Erro ao atualizar layout da página ${pageId}`);
      console.error(err);
      throw err;
    }
  }, [pageLayouts]);

  // Adicionar uma nova seção ao layout
  const addPageSection = useCallback(async (pageId: string, section: Omit<PageLayoutItem, 'id'>) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentLayout = pageLayouts[pageId] || [];
      const newId = Math.max(0, ...currentLayout.map(item => item.id)) + 1;
      
      const newSection: PageLayoutItem = {
        ...section,
        id: newId,
        pageId
      };
      
      const updatedLayout = [...currentLayout, newSection];
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      
      return newSection;
    } catch (err) {
      setError(`Erro ao adicionar seção à página ${pageId}`);
      console.error(err);
      throw err;
    }
  }, [pageLayouts]);

  // Remover uma seção do layout
  const removePageSection = useCallback(async (pageId: string, sectionId: number) => {
    try {
      // Simulação de chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentLayout = pageLayouts[pageId] || [];
      const updatedLayout = currentLayout.filter(item => item.id !== sectionId);
      
      setPageLayouts(prev => ({ ...prev, [pageId]: updatedLayout }));
      return true;
    } catch (err) {
      setError(`Erro ao remover seção ${sectionId} da página ${pageId}`);
      console.error(err);
      throw err;
    }
  }, [pageLayouts]);

  // Carregar páginas ao inicializar
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return {
    pages,
    pageLayouts,
    loading,
    error,
    fetchPages,
    fetchPageLayout,
    getPageBySlug,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    updatePageLayout,
    addPageSection,
    removePageSection
  };
};
