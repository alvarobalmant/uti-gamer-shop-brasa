
import { Product } from '@/hooks/useProducts';

// Função para filtrar produtos baseado nas tags padronizadas
export const getProductsForSection = (products: Product[], config: any): Product[] => {
  if (!products || !config) return [];
  
  const { filter = {}, limit = 4 } = config;
  const { tagIds = [], tagNames = [] } = filter;
  
  // Filtrar produtos por tags (usando as tags padronizadas)
  let filteredProducts = products.filter(product => {
    if (tagIds.length === 0 && tagNames.length === 0) return true;
    
    // Verificar se o produto tem as tags necessárias
    const productTags = product.tags || [];
    
    // Verificar por IDs de tags
    const hasRequiredTagIds = tagIds.length === 0 || tagIds.some((tagId: string) => 
      productTags.some(tag => tag.id === tagId)
    );
    
    // Verificar por nomes de tags (padronizadas)
    const hasRequiredTagNames = tagNames.length === 0 || tagNames.some((tagName: string) => 
      productTags.some(tag => tag.name?.toLowerCase() === tagName.toLowerCase())
    );
    
    return hasRequiredTagIds && hasRequiredTagNames;
  });
  
  // Aplicar limite
  return filteredProducts.slice(0, limit);
};

// Função para processar produtos da view_product_with_tags
export const processProductsFromRows = (rows: any[]): Product[] => {
  if (!rows || !Array.isArray(rows)) return [];
  
  // Agrupar produtos por ID para evitar duplicatas
  const productsMap = new Map<string, Product>();
  
  rows.forEach(row => {
    if (!row || !row.product_id) return;
    
    const productId = row.product_id;
    
    if (!productsMap.has(productId)) {
      // Criar novo produto
      const product: Product = {
        id: productId,
        name: row.product_name || '',
        description: row.product_description || '',
        price: Number(row.product_price) || 0,
        image: row.product_image || '',
        stock: row.product_stock || 0,
        badge_text: row.badge_text || '',
        badge_color: row.badge_color || '',
        badge_visible: row.badge_visible || false,
        tags: [],
        is_active: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      productsMap.set(productId, product);
    }
    
    // Adicionar tag se existir
    if (row.tag_id && row.tag_name) {
      const product = productsMap.get(productId)!;
      const tagExists = product.tags?.some(tag => tag.id === row.tag_id);
      
      if (!tagExists) {
        product.tags = product.tags || [];
        product.tags.push({
          id: row.tag_id,
          name: row.tag_name
        });
      }
    }
  });
  
  return Array.from(productsMap.values());
};

// Função para filtrar produtos Xbox especificamente
export const getXboxProducts = (products: Product[]): Product[] => {
  return products.filter(product => {
    const hasXboxTag = product.tags?.some(tag => 
      tag.name?.toLowerCase() === 'xbox'
    );
    
    return hasXboxTag;
  });
};

// Função para filtrar por categoria com tags padronizadas
export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  const xboxProducts = getXboxProducts(products);
  
  return xboxProducts.filter(product => {
    const hasCategoryTag = product.tags?.some(tag => 
      tag.name?.toLowerCase() === category.toLowerCase()
    );
    
    return hasCategoryTag;
  });
};
