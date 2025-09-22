// Teste do algoritmo de produtos relacionados
const products = [
  {
    id: '1',
    name: 'Resident Evil 4 Remake PS5',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'capcom', name: 'Capcom' }
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
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '3',
    name: 'Dead Space Remake',
    tags: [
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '4',
    name: 'Pantufa Garfield',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'conforto', name: 'Conforto' }
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
      { id: 'playstation-5', name: 'PlayStation 5' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '6',
    name: 'The Last of Us Part II',
    tags: [
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'naughty-dog', name: 'Naughty Dog' }
    ],
    product_type: 'simple',
    is_active: true
  },
  {
    id: '7',
    name: 'Mouse Gamer RGB',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'gaming', name: 'Gaming' }
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
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true
  }
];

// Simular o algoritmo atual
function getRelatedProducts(currentProduct, allProducts, maxResults = 8) {
  console.log('=== TESTE DO ALGORITMO ATUAL ===');
  console.log('Produto atual:', currentProduct.name);
  console.log('Tags do produto atual:', currentProduct.tags.map(t => t.name));
  
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  console.log('Produtos válidos para análise:', validProducts.length);
  
  if (!currentProduct.tags || currentProduct.tags.length === 0) {
    console.log('Produto sem tags - usando fallback');
    return { products: validProducts.slice(0, maxResults), algorithm: 'fallback' };
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
  
  console.log('\nProdutos com matches:');
  productsWithMatches.forEach(item => {
    console.log(`- ${item.product.name}: ${item.matches} tags em comum`);
    const productTags = item.product.tags.map(t => t.name);
    const commonTags = currentProduct.tags
      .filter(currentTag => item.product.tags.some(productTag => productTag.id === currentTag.id))
      .map(t => t.name);
    console.log(`  Tags em comum: ${commonTags.join(', ')}`);
  });
  
  // Ordenar por matches
  productsWithMatches.sort((a, b) => {
    if (a.matches !== b.matches) {
      return b.matches - a.matches;
    }
    return Math.random() - 0.5;
  });
  
  const relatedProducts = productsWithMatches.map(item => item.product);
  
  // Completar com produtos aleatórios se necessário
  let finalProducts = relatedProducts.slice(0, maxResults);
  
  if (finalProducts.length < maxResults) {
    const usedIds = new Set([
      currentProduct.id,
      ...finalProducts.map(p => p.id)
    ]);
    
    const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
    const additionalProducts = remainingProducts.slice(0, maxResults - finalProducts.length);
    
    finalProducts = [...finalProducts, ...additionalProducts];
    
    console.log(`\nCompletado com ${additionalProducts.length} produtos aleatórios:`);
    additionalProducts.forEach(product => {
      console.log(`- ${product.name} (sem tags em comum)`);
    });
  }
  
  console.log('\nProdutos relacionados finais:');
  finalProducts.forEach((product, index) => {
    const matches = productsWithMatches.find(p => p.product.id === product.id)?.matches || 0;
    console.log(`${index + 1}. ${product.name} (${matches} matches)`);
  });
  
  return { products: finalProducts, algorithm: 'tags' };
}

// Testar com diferentes produtos
console.log('🎮 TESTE 1: Resident Evil 4 Remake PS5');
console.log('=====================================');
const result1 = getRelatedProducts(products[0], products);

console.log('\n\n🧸 TESTE 2: Pantufa Garfield');
console.log('============================');
const result2 = getRelatedProducts(products[3], products);

console.log('\n\n⚽ TESTE 3: FIFA 24 PS5');
console.log('=======================');
const result3 = getRelatedProducts(products[4], products);
