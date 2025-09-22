// Teste comparativo entre algoritmo atual e melhorado
const products = [
  {
    id: '1',
    name: 'Resident Evil 4 Remake PS5',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'capcom', name: 'Capcom' },
      { id: 'remake', name: 'Remake' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '2',
    name: 'Resident Evil 2 Remake',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'capcom', name: 'Capcom' },
      { id: 'remake', name: 'Remake' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '3',
    name: 'Dead Space Remake',
    tags: [
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'remake', name: 'Remake' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '4',
    name: 'Pantufa Garfield',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'conforto', name: 'Conforto' },
      { id: 'pantufa', name: 'Pantufa' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '5',
    name: 'FIFA 24 PS5',
    tags: [
      { id: 'fifa', name: 'FIFA' },
      { id: 'esporte', name: 'Esporte' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '6',
    name: 'The Last of Us Part II',
    tags: [
      { id: 'the-last-of-us', name: 'The Last of Us' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'naughty-dog', name: 'Naughty Dog' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '7',
    name: 'Mouse Gamer RGB',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'gaming', name: 'Gaming' },
      { id: 'mouse', name: 'Mouse' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '8',
    name: 'Resident Evil 3 Remake',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'capcom', name: 'Capcom' },
      { id: 'remake', name: 'Remake' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '9',
    name: 'Street Fighter 6',
    tags: [
      { id: 'street-fighter', name: 'Street Fighter' },
      { id: 'luta', name: 'Luta' },
      { id: 'capcom', name: 'Capcom' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'jogo', name: 'Jogo' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '10',
    name: 'Camiseta Resident Evil',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'camiseta', name: 'Camiseta' },
      { id: 'roupa', name: 'Roupa' }
    ],
    product_type: 'simple',
    is_active: true
  }
];

// Algoritmo atual (simplificado)
function getCurrentAlgorithm(currentProduct, allProducts) {
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  if (!currentProduct.tags || currentProduct.tags.length === 0) {
    return { products: validProducts.slice(0, 8), algorithm: 'fallback' };
  }
  
  const currentTags = currentProduct.tags.map(tag => tag.id);
  const productsWithMatches = [];
  
  validProducts.forEach(product => {
    if (!product.tags || product.tags.length === 0) {
      return;
    }
    
    const productTags = product.tags.map(tag => tag.id);
    const matches = currentTags.filter(tagId => productTags.includes(tagId)).length;
    
    if (matches > 0) {
      productsWithMatches.push({ product, matches });
    }
  });
  
  productsWithMatches.sort((a, b) => {
    if (a.matches !== b.matches) {
      return b.matches - a.matches;
    }
    return Math.random() - 0.5;
  });
  
  const relatedProducts = productsWithMatches.map(item => item.product);
  let finalProducts = relatedProducts.slice(0, 8);
  
  if (finalProducts.length < 8) {
    const usedIds = new Set([currentProduct.id, ...finalProducts.map(p => p.id)]);
    const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
    const additionalProducts = remainingProducts.slice(0, 8 - finalProducts.length);
    finalProducts = [...finalProducts, ...additionalProducts];
  }
  
  return { products: finalProducts, algorithm: 'tags' };
}

// Algoritmo melhorado (simplificado)
function getImprovedAlgorithm(currentProduct, allProducts) {
  const TAG_WEIGHTS = {
    FRANCHISE: 100,
    MAIN_GAME: 80,
    GENRE: 50,
    DEVELOPER: 40,
    PLATFORM: 20,
    ATTRIBUTE: 10,
    GENERIC: 5
  };
  
  const TAG_CATEGORIES = {
    'resident-evil': 'FRANCHISE',
    'fifa': 'FRANCHISE',
    'street-fighter': 'FRANCHISE',
    'the-last-of-us': 'MAIN_GAME',
    'survival-horror': 'GENRE',
    'esporte': 'GENRE',
    'luta': 'GENRE',
    'capcom': 'DEVELOPER',
    'naughty-dog': 'DEVELOPER',
    'playstation-5': 'PLATFORM',
    'remake': 'ATTRIBUTE',
    'jogo': 'GENERIC',
    'acessorio': 'GENERIC',
    'roupa': 'GENERIC'
  };
  
  const PRODUCT_CATEGORIES = {
    GAMES: ['jogo', 'game'],
    ACCESSORIES: ['acessorio', 'mouse'],
    CLOTHING: ['roupa', 'camiseta', 'pantufa']
  };
  
  function getProductMainCategory(product) {
    if (!product.tags) return 'UNKNOWN';
    const tagNames = product.tags.map(tag => tag.name.toLowerCase());
    
    for (const [category, keywords] of Object.entries(PRODUCT_CATEGORIES)) {
      if (keywords.some(keyword => tagNames.some(tagName => tagName.includes(keyword)))) {
        return category;
      }
    }
    return 'UNKNOWN';
  }
  
  function calculateWeightedScore(currentProduct, candidateProduct) {
    if (!currentProduct.tags || !candidateProduct.tags) return 0;
    
    const currentTagIds = currentProduct.tags.map(tag => tag.id);
    const candidateTagIds = candidateProduct.tags.map(tag => tag.id);
    
    let score = 0;
    for (const tagId of candidateTagIds) {
      if (currentTagIds.includes(tagId)) {
        const category = TAG_CATEGORIES[tagId] || 'GENERIC';
        score += TAG_WEIGHTS[category];
      }
    }
    
    // Boost para mesmo desenvolvedor
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
      score += 20; // Boost para mesmo desenvolvedor
    }
    
    return score;
  }
  
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  const currentCategory = getProductMainCategory(currentProduct);
  const sameCategoryProducts = validProducts.filter(product => 
    getProductMainCategory(product) === currentCategory
  );
  
  const productsWithScores = [];
  sameCategoryProducts.forEach(product => {
    const score = calculateWeightedScore(currentProduct, product);
    if (score >= 50) { // Limite mínimo de relevância
      productsWithScores.push({ product, score });
    }
  });
  
  productsWithScores.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return (b.product.tags?.length || 0) - (a.product.tags?.length || 0);
  });
  
  let finalProducts = productsWithScores.slice(0, 8).map(item => item.product);
  let algorithm = 'weighted_tags';
  
  // Fallback estratégico se necessário
  if (finalProducts.length < 3) {
    const usedIds = new Set(finalProducts.map(p => p.id));
    const remainingCategoryProducts = sameCategoryProducts
      .filter(p => !usedIds.has(p.id))
      .slice(0, 3 - finalProducts.length);
    
    finalProducts = [...finalProducts, ...remainingCategoryProducts];
    algorithm = 'category_fallback';
  }
  
  return { 
    products: finalProducts, 
    algorithm,
    scores: Object.fromEntries(productsWithScores.map(item => [item.product.id, item.score]))
  };
}

// Função para testar e comparar
function compareAlgorithms(testProduct, allProducts) {
  console.log(`\n🎮 TESTE: ${testProduct.name}`);
  console.log('='.repeat(50));
  
  const currentResult = getCurrentAlgorithm(testProduct, allProducts);
  const improvedResult = getImprovedAlgorithm(testProduct, allProducts);
  
  console.log('\n📊 ALGORITMO ATUAL:');
  currentResult.products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
  });
  
  console.log('\n🚀 ALGORITMO MELHORADO:');
  improvedResult.products.forEach((product, index) => {
    const score = improvedResult.scores?.[product.id] || 0;
    console.log(`${index + 1}. ${product.name} (Score: ${score})`);
  });
  
  console.log(`\nAlgoritmo usado: ${improvedResult.algorithm}`);
  
  // Análise de relevância
  const currentCategory = improvedResult.products.length > 0 ? 
    (improvedResult.products[0].tags?.some(t => t.name.toLowerCase().includes('jogo')) ? 'GAMES' : 'OTHER') : 'NONE';
  
  const testCategory = testProduct.tags?.some(t => t.name.toLowerCase().includes('jogo')) ? 'GAMES' : 'OTHER';
  
  console.log(`\n📈 ANÁLISE DE RELEVÂNCIA:`);
  console.log(`- Categoria do produto teste: ${testCategory}`);
  console.log(`- Produtos na mesma categoria (melhorado): ${improvedResult.products.length}`);
  console.log(`- Produtos totais (atual): ${currentResult.products.length}`);
}

// Executar testes
console.log('🔬 COMPARAÇÃO DE ALGORITMOS DE PRODUTOS RELACIONADOS');
console.log('====================================================');

// Teste 1: Resident Evil 4 (jogo popular)
compareAlgorithms(products[0], products);

// Teste 2: Pantufa Garfield (acessório)
compareAlgorithms(products[3], products);

// Teste 3: FIFA 24 (jogo de esporte)
compareAlgorithms(products[4], products);

console.log('\n\n🎯 RESUMO DOS BENEFÍCIOS DO ALGORITMO MELHORADO:');
console.log('- ✅ Filtragem por categoria evita produtos irrelevantes');
console.log('- ✅ Sistema de pontuação ponderada prioriza tags importantes');
console.log('- ✅ Limite mínimo de relevância elimina produtos com baixo score');
console.log('- ✅ Fallback estratégico mantém qualidade mesmo com poucos produtos');
console.log('- ✅ Boosts contextuais refinam ainda mais a relevância');
