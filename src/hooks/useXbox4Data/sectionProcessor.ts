
import { Product } from '@/hooks/useProducts';
import { getProductsForSection, getProductsByCategory } from './productFilters';

export const processSections = (sections: any[], products: Product[]) => {
  let consoles: Product[] = [];
  let games: Product[] = [];
  let accessories: Product[] = [];
  let deals: Product[] = [];
  let newsArticles: any[] = [];

  sections?.forEach((section: any) => {
    const config = section.section_config || {};
    
    switch (section.section_key) {
      case 'xbox4_consoles':
        // Usar filtro baseado em tags padronizadas para consoles
        consoles = getProductsByCategory(products, 'console');
        break;
        
      case 'xbox4_games':
        // Usar filtro baseado em tags padronizadas para jogos
        games = getProductsByCategory(products, 'game');
        break;
        
      case 'xbox4_accessories':
        // Usar filtro baseado em tags padronizadas para acessórios
        accessories = getProductsByCategory(products, 'accessory');
        break;
        
      case 'xbox4_deals':
        // Usar filtro baseado em tags padronizadas para ofertas
        deals = getProductsByCategory(products, 'offer');
        break;
        
      case 'xbox4_news':
        // Processar artigos de notícias se disponível
        newsArticles = config.articles || [];
        break;
        
      default:
        // Para seções customizadas, usar o filtro genérico
        const sectionProducts = getProductsForSection(products, config);
        
        // Determinar onde colocar os produtos baseado no tipo da seção
        if (section.section_type === 'products') {
          if (section.title?.toLowerCase().includes('console')) {
            consoles = [...consoles, ...sectionProducts];
          } else if (section.title?.toLowerCase().includes('jogo') || section.title?.toLowerCase().includes('game')) {
            games = [...games, ...sectionProducts];
          } else if (section.title?.toLowerCase().includes('acessório') || section.title?.toLowerCase().includes('accessory')) {
            accessories = [...accessories, ...sectionProducts];
          } else if (section.title?.toLowerCase().includes('oferta') || section.title?.toLowerCase().includes('deal')) {
            deals = [...deals, ...sectionProducts];
          }
        }
        break;
    }
  });

  // Aplicar limite padrão para cada seção se não especificado
  return {
    consoles: consoles.slice(0, 4),
    games: games.slice(0, 6),
    accessories: accessories.slice(0, 4),
    deals: deals.slice(0, 4),
    newsArticles: newsArticles.slice(0, 3)
  };
};
