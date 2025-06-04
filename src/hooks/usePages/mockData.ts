
import { Page, PageLayoutItem } from './types';

// Mock de dados iniciais para as páginas de plataforma
export const initialPages: Page[] = [
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
export const initialPageLayouts: Record<string, PageLayoutItem[]> = {
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
