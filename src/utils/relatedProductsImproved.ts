import { Product } from '@/hooks/useProducts/types';

/**
 * Interface para resultado de produtos relacionados melhorado
 */
export interface ImprovedRelatedProductsResult {
  products: Product[];
  algorithm: 'weighted_tags' | 'category_fallback' | 'popular_fallback';
  scores: { [productId: string]: number };
  debugInfo: {
    totalCandidates: number;
    afterCategoryFilter: number;
    afterRelevanceFilter: number;
    minScoreThreshold: number;
  };
}

/**
 * Configuração de pesos para diferentes tipos de tags
 */
const TAG_WEIGHTS = {
  FRANCHISE: 100,     // resident-evil, final-fantasy, mario
  MAIN_GAME: 80,      // the-last-of-us, cyberpunk-2077
  GENRE: 50,          // survival-horror, rpg, fps
  DEVELOPER: 40,      // capcom, naughty-dog, square-enix
  PLATFORM: 20,       // playstation-5, pc, nintendo-switch
  ATTRIBUTE: 10,      // remake, multiplayer, 4k
  GENERIC: 5          // jogo, acessorio, lancamento
};

/**
 * Mapeamento de tags para suas categorias e pesos
 * Em uma implementação real, isso viria de uma base de dados ou configuração
 */
const TAG_CATEGORIES: { [tagId: string]: keyof typeof TAG_WEIGHTS } = {
  // Franchises
  'resident-evil': 'FRANCHISE',
  'final-fantasy': 'FRANCHISE',
  'mario': 'FRANCHISE',
  'zelda': 'FRANCHISE',
  'fifa': 'FRANCHISE',
  
  // Main Games
  'the-last-of-us': 'MAIN_GAME',
  'cyberpunk-2077': 'MAIN_GAME',
  'god-of-war': 'MAIN_GAME',
  'horizon': 'MAIN_GAME',
  
  // Genres
  'survival-horror': 'GENRE',
  'rpg': 'GENRE',
  'fps': 'GENRE',
  'esporte': 'GENRE',
  'acao': 'GENRE',
  'aventura': 'GENRE',
  
  // Developers
  'capcom': 'DEVELOPER',
  'naughty-dog': 'DEVELOPER',
  'square-enix': 'DEVELOPER',
  'sony': 'DEVELOPER',
  'nintendo': 'DEVELOPER',
  
  // Platforms
  'playstation-5': 'PLATFORM',
  'playstation-4': 'PLATFORM',
  'pc': 'PLATFORM',
  'nintendo-switch': 'PLATFORM',
  'xbox': 'PLATFORM',
  
  // Attributes
  'remake': 'ATTRIBUTE',
  'multiplayer': 'ATTRIBUTE',
  '4k': 'ATTRIBUTE',
  'dlc': 'ATTRIBUTE',
  'edicao-especial': 'ATTRIBUTE',
  
  // Generic
  'jogo': 'GENERIC',
  'acessorio': 'GENERIC',
  'lancamento': 'GENERIC',
  'promocao': 'GENERIC'
};

/**
 * Configuração de categorias principais de produtos
 */
const PRODUCT_CATEGORIES = {
  GAMES: ['jogo', 'game', 'videogame'],
  ACCESSORIES: ['acessorio', 'controle', 'headset', 'mouse', 'teclado'],
  CLOTHING: ['roupa', 'camiseta', 'pantufa', 'vestuario'],
  COLLECTIBLES: ['colecionavel', 'figura', 'boneco', 'poster']
};

/**
 * Boosts contextuais aplicados após o cálculo base
 */
const CONTEXTUAL_BOOSTS = {
  SAME_DEVELOPER: 20,
  RECENT_RELEASE: 15,
  POPULAR_ITEM: 10,
  FREQUENTLY_BOUGHT_TOGETHER: 50
};

/**
 * Configurações do algoritmo
 */
const ALGORITHM_CONFIG = {
  MIN_RELEVANCE_SCORE: 50,    // Score mínimo para um produto ser considerado relevante
  MAX_RESULTS: 8,             // Número máximo de produtos a retornar
  MIN_RESULTS: 3              // Número mínimo desejado de produtos
};

/**
 * Determina a categoria principal de um produto baseado em suas tags
 */
function getProductMainCategory(product: Product): string {
  if (!product.tags || product.tags.length === 0) {
    return 'UNKNOWN';
  }
  
  const tagNames = product.tags.map(tag => tag.name.toLowerCase());
  
  for (const [category, keywords] of Object.entries(PRODUCT_CATEGORIES)) {
    if (keywords.some(keyword => tagNames.some(tagName => tagName.includes(keyword)))) {
      return category;
    }
  }
  
  return 'UNKNOWN';
}

/**
 * Calcula o score de relevância baseado em tags ponderadas
 */
function calculateWeightedTagScore(currentProduct: Product, candidateProduct: Product): number {
  if (!currentProduct.tags || !candidateProduct.tags) {
    return 0;
  }
  
  const currentTagIds = currentProduct.tags.map(tag => tag.id);
  const candidateTagIds = candidateProduct.tags.map(tag => tag.id);
  
  let score = 0;
  
  for (const tagId of candidateTagIds) {
    if (currentTagIds.includes(tagId)) {
      const category = TAG_CATEGORIES[tagId] || 'GENERIC';
      score += TAG_WEIGHTS[category];
    }
  }
  
  return score;
}

/**
 * Aplica boosts contextuais ao score base
 */
function applyContextualBoosts(
  currentProduct: Product, 
  candidateProduct: Product, 
  baseScore: number
): number {
  let boostedScore = baseScore;
  
  // Boost para mesmo desenvolvedor
  if (currentProduct.tags && candidateProduct.tags) {
    const currentDeveloperTags = currentProduct.tags.filter(tag => 
      TAG_CATEGORIES[tag.id] === 'DEVELOPER'
    );
    const candidateDeveloperTags = candidateProduct.tags.filter(tag => 
      TAG_CATEGORIES[tag.id] === 'DEVELOPER'
    );
    
    const hasSameDeveloper = currentDeveloperTags.some(currentTag =>
      candidateDeveloperTags.some(candidateTag => candidateTag.id === currentTag.id)
    );
    
    if (hasSameDeveloper) {
      boostedScore += CONTEXTUAL_BOOSTS.SAME_DEVELOPER;
    }
  }
  
  // Boost para produtos populares (simulado - em produção viria de analytics)
  // Por enquanto, vamos dar boost para produtos com mais tags (proxy para popularidade)
  if (candidateProduct.tags && candidateProduct.tags.length >= 5) {
    boostedScore += CONTEXTUAL_BOOSTS.POPULAR_ITEM;
  }
  
  return boostedScore;
}

/**
 * Algoritmo melhorado de produtos relacionados
 */
export const getImprovedRelatedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  maxResults: number = ALGORITHM_CONFIG.MAX_RESULTS
): ImprovedRelatedProductsResult => {
  console.log(`[getImprovedRelatedProducts] 🚀 Iniciando algoritmo melhorado para: ${currentProduct.name}`);
  
  // Fase 1: Filtrar produtos válidos
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  console.log(`[getImprovedRelatedProducts] ✅ Produtos válidos: ${validProducts.length}`);
  
  // Fase 2: Filtrar por categoria principal
  const currentCategory = getProductMainCategory(currentProduct);
  const sameCategoryProducts = validProducts.filter(product => 
    getProductMainCategory(product) === currentCategory
  );
  
  console.log(`[getImprovedRelatedProducts] 🏷️ Categoria atual: ${currentCategory}`);
  console.log(`[getImprovedRelatedProducts] 🎯 Produtos da mesma categoria: ${sameCategoryProducts.length}`);
  
  // Fase 3: Calcular scores para produtos da mesma categoria
  const productsWithScores: { product: Product; score: number }[] = [];
  
  sameCategoryProducts.forEach(product => {
    const baseScore = calculateWeightedTagScore(currentProduct, product);
    const finalScore = applyContextualBoosts(currentProduct, product, baseScore);
    
    if (finalScore > 0) {
      productsWithScores.push({ product, score: finalScore });
    }
  });
  
  console.log(`[getImprovedRelatedProducts] 📊 Produtos com score > 0: ${productsWithScores.length}`);
  
  // Fase 4: Filtrar por relevância mínima
  const relevantProducts = productsWithScores.filter(item => 
    item.score >= ALGORITHM_CONFIG.MIN_RELEVANCE_SCORE
  );
  
  console.log(`[getImprovedRelatedProducts] ⭐ Produtos relevantes (score >= ${ALGORITHM_CONFIG.MIN_RELEVANCE_SCORE}): ${relevantProducts.length}`);
  
  // Fase 5: Ordenar por score
  relevantProducts.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score; // Maior score primeiro
    }
    // Desempate: produto com mais tags (proxy para completude de dados)
    const aTagCount = a.product.tags?.length || 0;
    const bTagCount = b.product.tags?.length || 0;
    return bTagCount - aTagCount;
  });
  
  // Fase 6: Selecionar produtos finais
  let finalProducts = relevantProducts.slice(0, maxResults).map(item => item.product);
  let algorithm: ImprovedRelatedProductsResult['algorithm'] = 'weighted_tags';
  
  // Fase 7: Fallback estratégico se necessário
  if (finalProducts.length < ALGORITHM_CONFIG.MIN_RESULTS) {
    console.log(`[getImprovedRelatedProducts] 🔄 Aplicando fallback estratégico...`);
    
    // Fallback 1: Produtos populares da mesma categoria (mesmo com score baixo)
    if (sameCategoryProducts.length > finalProducts.length) {
      const usedIds = new Set(finalProducts.map(p => p.id));
      const remainingCategoryProducts = sameCategoryProducts
        .filter(p => !usedIds.has(p.id))
        .slice(0, ALGORITHM_CONFIG.MIN_RESULTS - finalProducts.length);
      
      finalProducts = [...finalProducts, ...remainingCategoryProducts];
      algorithm = 'category_fallback';
      
      console.log(`[getImprovedRelatedProducts] 📂 Fallback categoria: +${remainingCategoryProducts.length} produtos`);
    }
    
    // Fallback 2: Produtos populares gerais (último recurso)
    if (finalProducts.length < ALGORITHM_CONFIG.MIN_RESULTS) {
      const usedIds = new Set(finalProducts.map(p => p.id));
      const remainingProducts = validProducts
        .filter(p => !usedIds.has(p.id))
        .sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0)) // Ordenar por "popularidade" (número de tags)
        .slice(0, ALGORITHM_CONFIG.MIN_RESULTS - finalProducts.length);
      
      finalProducts = [...finalProducts, ...remainingProducts];
      algorithm = 'popular_fallback';
      
      console.log(`[getImprovedRelatedProducts] 🌟 Fallback popular: +${remainingProducts.length} produtos`);
    }
  }
  
  // Criar mapa de scores para debug
  const scores: { [productId: string]: number } = {};
  productsWithScores.forEach(item => {
    scores[item.product.id] = item.score;
  });
  
  // Log final
  console.log(`[getImprovedRelatedProducts] 🎉 Resultado final:`);
  finalProducts.forEach((product, index) => {
    const score = scores[product.id] || 0;
    console.log(`  ${index + 1}. ${product.name} (Score: ${score})`);
  });
  
  return {
    products: finalProducts,
    algorithm,
    scores,
    debugInfo: {
      totalCandidates: validProducts.length,
      afterCategoryFilter: sameCategoryProducts.length,
      afterRelevanceFilter: relevantProducts.length,
      minScoreThreshold: ALGORITHM_CONFIG.MIN_RELEVANCE_SCORE
    }
  };
};

/**
 * Função para analisar e debugar o novo algoritmo
 */
export const analyzeImprovedAlgorithm = (
  currentProduct: Product,
  allProducts: Product[]
): void => {
  console.log('\n=== ANÁLISE DETALHADA DO ALGORITMO MELHORADO ===');
  
  const result = getImprovedRelatedProducts(currentProduct, allProducts);
  
  console.log('\n📊 ESTATÍSTICAS:');
  console.log(`- Algoritmo usado: ${result.algorithm}`);
  console.log(`- Produtos retornados: ${result.products.length}`);
  console.log(`- Score mínimo aplicado: ${result.debugInfo.minScoreThreshold}`);
  
  console.log('\n🎯 DISTRIBUIÇÃO DE SCORES:');
  const scoreDistribution: { [range: string]: number } = {};
  Object.values(result.scores).forEach(score => {
    if (score >= 100) scoreDistribution['100+'] = (scoreDistribution['100+'] || 0) + 1;
    else if (score >= 50) scoreDistribution['50-99'] = (scoreDistribution['50-99'] || 0) + 1;
    else if (score >= 20) scoreDistribution['20-49'] = (scoreDistribution['20-49'] || 0) + 1;
    else scoreDistribution['0-19'] = (scoreDistribution['0-19'] || 0) + 1;
  });
  
  Object.entries(scoreDistribution).forEach(([range, count]) => {
    console.log(`- Score ${range}: ${count} produtos`);
  });
  
  console.log('\n🏆 TOP PRODUTOS POR SCORE:');
  const sortedScores = Object.entries(result.scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  sortedScores.forEach(([productId, score], index) => {
    const product = allProducts.find(p => p.id === productId);
    console.log(`${index + 1}. ${product?.name} - Score: ${score}`);
  });
};
