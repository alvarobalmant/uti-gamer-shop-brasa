import { Product } from '@/hooks/useProducts/types';
import { searchProductsByMultipleTags } from './multiTagSearch';

/**
 * Interface para resultado de produtos relacionados baseado no sistema de busca
 */
export interface RelatedProductsResult {
  products: Product[];
  algorithm: 'search_based' | 'fallback';
  scores?: { [productId: string]: number };
  debugInfo?: {
    totalCandidates: number;
    searchResults: number;
    afterFiltering: number;
    usedFallback: boolean;
  };
}

/**
 * Configurações do algoritmo baseado na busca
 */
const SEARCH_ALGORITHM_CONFIG = {
  MAX_RESULTS: 8,               // Número máximo de produtos a retornar
  MIN_RESULTS_FOR_FALLBACK: 3   // Se tiver menos que isso, usa fallback
};

/**
 * Calcula produtos relacionados usando EXATAMENTE o mesmo sistema da busca principal
 * Usa o nome do produto atual como query para a função searchProductsByMultipleTags
 */
export const getRelatedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  maxResults: number = SEARCH_ALGORITHM_CONFIG.MAX_RESULTS
): RelatedProductsResult => {
  console.log(`[getRelatedProducts] 🔍 Usando sistema de busca para: ${currentProduct.name}`);
  
  // 1. Filtrar produtos válidos (excluir produto atual e produtos mestre)
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  console.log(`[getRelatedProducts] ✅ Produtos válidos para análise: ${validProducts.length}`);
  
  // 2. Usar o nome do produto atual como query de busca
  const searchQuery = currentProduct.name;
  console.log(`[getRelatedProducts] 🎯 Query de busca: "${searchQuery}"`);
  
  // 3. Usar EXATAMENTE a mesma função da busca principal
  const searchResults = searchProductsByMultipleTags(validProducts, searchQuery);
  
  console.log(`[getRelatedProducts] 📊 Resultados da busca:`);
  console.log(`- Matches exatos: ${searchResults.exactMatches.length}`);
  console.log(`- Produtos relacionados: ${searchResults.relatedProducts.length}`);
  
  // 4. Combinar resultados exatos e relacionados
  const allSearchResults = [
    ...searchResults.exactMatches,
    ...searchResults.relatedProducts
  ];
  
  // 5. Ordenar por score (se disponível) e depois por preço
  allSearchResults.sort((a, b) => {
    // Primeiro por relevance_score (se existir)
    const scoreA = a.relevance_score || 0;
    const scoreB = b.relevance_score || 0;
    
    if (Math.abs(scoreA - scoreB) > 0.1) {
      return scoreB - scoreA; // Maior score primeiro
    }
    
    // Se scores similares, ordenar por preço (menor primeiro)
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    
    if (Math.abs(priceA - priceB) > 0.01) {
      return priceA - priceB;
    }
    
    // Se preços similares, ordenar alfabeticamente
    return a.name.localeCompare(b.name);
  });
  
  // 6. Selecionar os melhores produtos
  let finalProducts = allSearchResults.slice(0, maxResults);
  let algorithm: RelatedProductsResult['algorithm'] = 'search_based';
  let usedFallback = false;
  
  // 7. Fallback se não encontrou produtos suficientes
  if (finalProducts.length < SEARCH_ALGORITHM_CONFIG.MIN_RESULTS_FOR_FALLBACK) {
    console.log(`[getRelatedProducts] 🔄 Poucos produtos encontrados (${finalProducts.length}), aplicando fallback...`);
    
    const usedIds = new Set(finalProducts.map(p => p.id));
    const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
    
    // Embaralhar e pegar produtos aleatórios para completar
    const shuffled = remainingProducts.sort(() => Math.random() - 0.5);
    const additionalProducts = shuffled.slice(0, maxResults - finalProducts.length);
    
    finalProducts = [...finalProducts, ...additionalProducts];
    algorithm = 'fallback';
    usedFallback = true;
    
    console.log(`[getRelatedProducts] 🎲 Adicionados ${additionalProducts.length} produtos aleatórios`);
  }
  
  // 8. Criar mapa de scores para debug
  const scores: { [productId: string]: number } = {};
  allSearchResults.forEach(product => {
    if (product.relevance_score) {
      scores[product.id] = product.relevance_score;
    }
  });
  
  // Log final
  console.log(`[getRelatedProducts] 🎉 Resultado final (sistema de busca):`);
  finalProducts.forEach((product, index) => {
    const score = scores[product.id] || 0;
    const method = score > 0 ? 'busca' : 'fallback';
    console.log(`  ${index + 1}. ${product.name} (Score: ${score.toFixed(1)} - ${method})`);
  });
  
  return {
    products: finalProducts,
    algorithm,
    scores,
    debugInfo: {
      totalCandidates: validProducts.length,
      searchResults: allSearchResults.length,
      afterFiltering: finalProducts.length,
      usedFallback
    }
  };
};

/**
 * Filtra produtos mestre de qualquer lista de produtos
 * Deve ser usado em todos os lugares onde produtos são exibidos (exceto admin)
 * @param products - Lista de produtos
 * @returns Lista sem produtos mestre
 */
export const filterMasterProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.product_type !== 'master');
};

/**
 * Verifica se um produto é mestre
 * @param product - Produto a verificar
 * @returns true se for produto mestre
 */
export const isMasterProduct = (product: Product): boolean => {
  return product.product_type === 'master' || product.is_master_product === true;
};

/**
 * Debug: Analisa como a busca está funcionando para um produto específico
 * @param currentProduct - Produto atual
 * @param allProducts - Lista de todos os produtos
 */
export const analyzeSearchBasedRelated = (
  currentProduct: Product,
  allProducts: Product[]
): void => {
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  const searchQuery = currentProduct.name;
  const searchResults = searchProductsByMultipleTags(validProducts, searchQuery);
  
  console.log('[analyzeSearchBasedRelated] Análise detalhada:');
  console.log(`- Query: "${searchQuery}"`);
  console.log(`- Produtos válidos: ${validProducts.length}`);
  console.log(`- Matches exatos: ${searchResults.exactMatches.length}`);
  console.log(`- Produtos relacionados: ${searchResults.relatedProducts.length}`);
  
  // Mostrar top 5 de cada categoria
  console.log('- Top 5 matches exatos:');
  searchResults.exactMatches.slice(0, 5).forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name} (Score: ${product.relevance_score || 0})`);
  });
  
  console.log('- Top 5 relacionados:');
  searchResults.relatedProducts.slice(0, 5).forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name} (Score: ${product.relevance_score || 0})`);
  });
};
