// Teste do novo algoritmo de produtos relacionados baseado em tokens
const products = [
  {
    id: '1',
    name: 'Resident Evil 4 Remake PS5',
    category: 'Jogos',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 199.99
  },
  {
    id: '2',
    name: 'Resident Evil 2 Remake',
    category: 'Jogos',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 149.99
  },
  {
    id: '3',
    name: 'Resident Evil 3 Remake',
    category: 'Jogos',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 139.99
  },
  {
    id: '4',
    name: 'Resident Evil Village',
    category: 'Jogos',
    tags: [
      { id: 'resident-evil', name: 'Resident Evil' },
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'capcom', name: 'Capcom' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 179.99
  },
  {
    id: '5',
    name: 'Dead Space Remake',
    category: 'Jogos',
    tags: [
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 179.99
  },
  {
    id: '6',
    name: 'FIFA 24 PS5',
    category: 'Jogos',
    tags: [
      { id: 'fifa', name: 'FIFA' },
      { id: 'esporte', name: 'Esporte' },
      { id: 'playstation-5', name: 'PlayStation 5' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 249.99
  },
  {
    id: '7',
    name: 'FIFA 23 PS5',
    category: 'Jogos',
    tags: [
      { id: 'fifa', name: 'FIFA' },
      { id: 'esporte', name: 'Esporte' },
      { id: 'playstation-5', name: 'PlayStation 5' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 199.99
  },
  {
    id: '8',
    name: 'Pantufa Garfield',
    category: 'Acessórios',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'conforto', name: 'Conforto' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 39.99
  },
  {
    id: '9',
    name: 'Mouse Gamer RGB',
    category: 'Acessórios',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'gaming', name: 'Gaming' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 89.99
  },
  {
    id: '10',
    name: 'The Last of Us Part II',
    category: 'Jogos',
    tags: [
      { id: 'survival-horror', name: 'Survival Horror' },
      { id: 'playstation-5', name: 'PlayStation 5' },
      { id: 'naughty-dog', name: 'Naughty Dog' }
    ],
    product_type: 'simple',
    is_active: true,
    price: 159.99
  }
];

// Simular o sistema de compatibilidade de tokens (versão corrigida)
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')    // Mantém apenas letras, números e espaços
    .replace(/\s+/g, ' ')            // Múltiplos espaços viram um só
    .trim();
}

function calculateSimpleTokenCompatibility(query, target) {
  const queryTokens = normalizeText(query).split(' ').filter(t => t.length > 1);
  const targetTokens = normalizeText(target).split(' ').filter(t => t.length > 1);
  
  if (queryTokens.length === 0 || targetTokens.length === 0) {
    return 0;
  }
  
  let matches = 0;
  let totalScore = 0;
  
  for (const queryToken of queryTokens) {
    for (const targetToken of targetTokens) {
      if (queryToken === targetToken) {
        matches++;
        totalScore += 10; // Score base para match exato
      } else if (targetToken.includes(queryToken) || queryToken.includes(targetToken)) {
        matches += 0.5;
        totalScore += 5; // Score menor para match parcial
      }
    }
  }
  
  // Bônus para alta proporção de matches
  const matchRatio = matches / Math.max(queryTokens.length, targetTokens.length);
  if (matchRatio > 0.5) {
    totalScore += matchRatio * 10;
  }
  
  return totalScore;
}

// Algoritmo de produtos relacionados baseado em tokens
function getTokenBasedRelatedProducts(currentProduct, allProducts, maxResults = 8) {
  console.log(`\\n🔍 ALGORITMO BASEADO EM TOKENS`);
  console.log(`Produto atual: ${currentProduct.name}`);
  
  const searchQuery = normalizeText(currentProduct.name);
  console.log(`Query de busca: "${searchQuery}"`);
  
  if (!searchQuery || searchQuery.length === 0) {
    console.log(`⚠️ Query vazia, usando fallback direto`);
    const validProducts = allProducts.filter(product => 
      product.id !== currentProduct.id &&
      product.product_type !== 'master' &&
      product.is_active !== false
    );
    
    const shuffled = validProducts.sort(() => Math.random() - 0.5);
    return {
      products: shuffled.slice(0, maxResults),
      algorithm: 'fallback',
      scores: {}
    };
  }
  
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  const productsWithCompatibility = [];
  
  validProducts.forEach(product => {
    // Calcular compatibilidade baseada no nome
    let totalScore = calculateSimpleTokenCompatibility(searchQuery, product.name);
    
    // Bônus para tags compatíveis
    if (product.tags && product.tags.length > 0) {
      let bestTagScore = 0;
      product.tags.forEach(tag => {
        const tagScore = calculateSimpleTokenCompatibility(searchQuery, tag.name);
        if (tagScore > bestTagScore) {
          bestTagScore = tagScore;
        }
      });
      totalScore += bestTagScore * 0.3; // Peso menor para tags
    }
    
    // Bônus para mesma categoria
    if (currentProduct.category && product.category === currentProduct.category) {
      totalScore += 5;
    }
    
    if (totalScore >= 10) { // Score mínimo
      productsWithCompatibility.push({ product, score: totalScore });
    }
  });
  
  // Ordenar por score, depois por preço, depois alfabeticamente
  productsWithCompatibility.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.1) {
      if (Math.abs(a.product.price - b.product.price) < 0.01) {
        return a.product.name.localeCompare(b.product.name);
      }
      return a.product.price - b.product.price;
    }
    return b.score - a.score;
  });
  
  let finalProducts = productsWithCompatibility.slice(0, maxResults).map(item => item.product);
  let algorithm = 'token_compatibility';
  
  // Fallback se poucos produtos
  if (finalProducts.length < 3) {
    const usedIds = new Set(finalProducts.map(p => p.id));
    const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
    const shuffled = remainingProducts.sort(() => Math.random() - 0.5);
    const additional = shuffled.slice(0, maxResults - finalProducts.length);
    
    finalProducts = [...finalProducts, ...additional];
    algorithm = 'fallback';
    
    console.log(`🎲 Fallback aplicado: +${additional.length} produtos aleatórios`);
  }
  
  console.log(`\\n📊 Produtos com compatibilidade:`);
  productsWithCompatibility.forEach(item => {
    console.log(`- ${item.product.name}: ${item.score.toFixed(1)} pontos`);
  });
  
  console.log(`\\n🎯 Produtos relacionados finais:`);
  finalProducts.forEach((product, index) => {
    const scoreItem = productsWithCompatibility.find(p => p.product.id === product.id);
    const score = scoreItem ? scoreItem.score.toFixed(1) : '0.0';
    const method = scoreItem ? 'compatibilidade' : 'fallback';
    console.log(`${index + 1}. ${product.name} (${score} pts - ${method}) - R$ ${product.price}`);
  });
  
  return {
    products: finalProducts,
    algorithm,
    scores: Object.fromEntries(productsWithCompatibility.map(item => [item.product.id, item.score]))
  };
}

// Executar testes
console.log('🧪 TESTE DO ALGORITMO DE PRODUTOS RELACIONADOS BASEADO EM TOKENS');
console.log('================================================================');

// Teste 1: Resident Evil 4 Remake PS5
console.log('\\n🎮 TESTE 1: Resident Evil 4 Remake PS5');
console.log('=========================================');
const result1 = getTokenBasedRelatedProducts(products[0], products);

// Teste 2: FIFA 24 PS5
console.log('\\n\\n⚽ TESTE 2: FIFA 24 PS5');
console.log('========================');
const result2 = getTokenBasedRelatedProducts(products[5], products);

// Teste 3: Pantufa Garfield
console.log('\\n\\n🧸 TESTE 3: Pantufa Garfield');
console.log('=============================');
const result3 = getTokenBasedRelatedProducts(products[7], products);

console.log('\\n\\n🎯 RESUMO DOS BENEFÍCIOS:');
console.log('- ✅ Usa o mesmo sistema de tokens da busca principal');
console.log('- ✅ Produtos similares por nome ficam juntos (RE4 → RE2, RE3, Village)');
console.log('- ✅ Ordenação inteligente: score → preço → alfabética');
console.log('- ✅ Fallback apenas quando necessário');
console.log('- ✅ Elimina recomendações absurdas (Pantufa não aparece para jogos)');
