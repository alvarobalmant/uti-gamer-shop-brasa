
import { Page, PageLayoutItem } from './types';

export const initialPages: Page[] = [
  {
    id: '1',
    title: 'Nintendo Switch',
    slug: 'nintendo',
    description: 'Tudo sobre Nintendo Switch',
    is_active: true,
    theme: {
      primaryColor: '#E60012',
      secondaryColor: '#0066CC',
    },
    filters: {
      tagIds: ['nintendo', 'switch'],
      categoryIds: ['games', 'consoles']
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'PlayStation',
    slug: 'playstation',
    description: 'Mundo PlayStation',
    is_active: true,
    theme: {
      primaryColor: '#003087',
      secondaryColor: '#00439C',
    },
    filters: {
      tagIds: ['playstation', 'ps5'],
      categoryIds: ['games', 'consoles']
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Xbox',
    slug: 'xbox',
    description: 'Universo Xbox',
    is_active: true,
    theme: {
      primaryColor: '#107C10',
      secondaryColor: '#5BB85C',
    },
    filters: {
      tagIds: ['xbox', 'gamepass'],
      categoryIds: ['games', 'consoles']
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const initialPageLayouts: Record<string, PageLayoutItem[]> = {
  '1': [
    {
      id: '1',
      page_id: '1',
      section_key: 'hero_banner',
      title: 'Nintendo Banner',
      display_order: 1,
      is_visible: true,
      section_type: 'banner',
      section_config: {
        title: 'Nintendo Switch',
        subtitle: 'A melhor experiência portátil',
        imageUrl: '/banners/nintendo-banner.jpg'
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      page_id: '1',
      section_key: 'featured_games',
      title: 'Jogos em Destaque',
      display_order: 2,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['nintendo'],
          limit: 8
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      page_id: '1',
      section_key: 'accessories',
      title: 'Acessórios',
      display_order: 3,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['acessorios', 'nintendo'],
          limit: 6
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      page_id: '1',
      section_key: 'custom_content',
      title: 'Sobre Nintendo',
      display_order: 4,
      is_visible: true,
      section_type: 'custom',
      section_config: {
        content: '<p>A Nintendo é uma das empresas mais icônicas da indústria de games...</p>'
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  '2': [
    {
      id: '5',
      page_id: '2',
      section_key: 'hero_banner',
      title: 'PlayStation Banner',
      display_order: 1,
      is_visible: true,
      section_type: 'banner',
      section_config: {
        title: 'PlayStation 5',
        subtitle: 'A nova geração chegou',
        imageUrl: '/banners/playstation-banner.jpg'
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      page_id: '2',
      section_key: 'ps5_games',
      title: 'Jogos PS5',
      display_order: 2,
      is_visible: true,
      section_type: 'featured',
      section_config: {
        filter: {
          tagIds: ['ps5'],
          limit: 8
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      page_id: '2',
      section_key: 'ps4_games',
      title: 'Jogos PS4',
      display_order: 3,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['ps4'],
          limit: 6
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      page_id: '2',
      section_key: 'playstation_accessories',
      title: 'Acessórios PlayStation',
      display_order: 4,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['acessorios', 'playstation'],
          limit: 4
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ],
  '3': [
    {
      id: '9',
      page_id: '3',
      section_key: 'hero_banner',
      title: 'Xbox Banner',
      display_order: 1,
      is_visible: true,
      section_type: 'banner',
      section_config: {
        title: 'Xbox Series X|S',
        subtitle: 'Power Your Dreams',
        imageUrl: '/banners/xbox-banner.jpg'
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '10',
      page_id: '3',
      section_key: 'gamepass_games',
      title: 'Game Pass',
      display_order: 2,
      is_visible: true,
      section_type: 'featured',
      section_config: {
        filter: {
          tagIds: ['gamepass'],
          limit: 8
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '11',
      page_id: '3',
      section_key: 'xbox_exclusives',
      title: 'Exclusivos Xbox',
      display_order: 3,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['xbox', 'exclusivo'],
          limit: 6
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '12',
      page_id: '3',
      section_key: 'xbox_accessories',
      title: 'Controles e Acessórios',
      display_order: 4,
      is_visible: true,
      section_type: 'products',
      section_config: {
        filter: {
          tagIds: ['acessorios', 'xbox'],
          limit: 4
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]
};
