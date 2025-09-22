// Teste do algoritmo de produtos relacionados baseado na busca principal
const products = [
  {
    id: '1',
    name: 'The Last of Us Part II Remastered - PS5',
    category: 'Jogos',
    tags: [
      { id: 'the-last-of-us', name: 'The Last of Us', weight: 10 },
      { id: 'playstation-5', name: 'PlayStation 5', weight: 5 },
      { id: 'aventura', name: 'Aventura', weight: 3 },
      { id: 'naughty-dog', name: 'Naughty Dog', weight: 8 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 249.99
  },
  {
    id: '2',
    name: 'The Last of Us Part I - PS5',
    category: 'Jogos',
    tags: [
      { id: 'the-last-of-us', name: 'The Last of Us', weight: 10 },
      { id: 'playstation-5', name: 'PlayStation 5', weight: 5 },
      { id: 'aventura', name: 'Aventura', weight: 3 },
      { id: 'naughty-dog', name: 'Naughty Dog', weight: 8 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 249.99
  },
  {
    id: '3',
    name: 'The Last Of Us 1 - PlayStation 3',
    category: 'Jogos',
    tags: [
      { id: 'the-last-of-us', name: 'The Last of Us', weight: 10 },
      { id: 'playstation-3', name: 'PlayStation 3', weight: 5 },
      { id: 'aventura', name: 'Aventura', weight: 3 },
      { id: 'naughty-dog', name: 'Naughty Dog', weight: 8 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 129.99
  },
  {
    id: '4',
    name: 'The Last Of Us Parte 1 - PlayStation 4',
    category: 'Jogos',
    tags: [
      { id: 'the-last-of-us', name: 'The Last of Us', weight: 10 },
      { id: 'playstation-4', name: 'PlayStation 4', weight: 5 },
      { id: 'aventura', name: 'Aventura', weight: 3 },
      { id: 'naughty-dog', name: 'Naughty Dog', weight: 8 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 189.99
  },
  {
    id: '5',
    name: 'Death Stranding 2: On the Beach - PS5',
    category: 'Jogos',
    tags: [
      { id: 'death-stranding', name: 'Death Stranding', weight: 8 },
      { id: 'playstation-5', name: 'PlayStation 5', weight: 5 },
      { id: 'aventura', name: 'Aventura', weight: 3 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 249.99
  },
  {
    id: '6',
    name: 'Helldivers 2 - PS5',
    category: 'Jogos',
    tags: [
      { id: 'helldivers', name: 'Helldivers', weight: 6 },
      { id: 'playstation-5', name: 'PlayStation 5', weight: 5 },
      { id: 'acao', name: 'Ação', weight: 4 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 249.99
  },
  {
    id: '7',
    name: 'Marvel\'s Spider-Man 2 - PS5',
    category: 'Jogos',
    tags: [
      { id: 'spider-man', name: 'Spider-Man', weight: 8 },
      { id: 'playstation-5', name: 'PlayStation 5', weight: 5 },
      { id: 'acao', name: 'Ação', weight: 4 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 349.99
  },
  {
    id: '8',
    name: 'Star Wars: The Force Unleashed II - PlayStation 3',
    category: 'Jogos',
    tags: [
      { id: 'star-wars', name: 'Star Wars', weight: 7 },
      { id: 'playstation-3', name: 'PlayStation 3', weight: 5 },
      { id: 'acao', name: 'Ação', weight: 4 }
    ],
    product_type: 'simple',
    is_active: true,
    price: 69.99
  }
];

// Simular a função de busca principal (versão simplificada)
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeQuery(query) {
  return normalizeText(query)
    .split(/\s+/)
    .filter(token => token.length >= 2);
}

function calculateTagSimilarity(token, tag) {
  if (token === tag) return 1.0;
  if (tag.includes(token) || token.includes(tag)) {
    return Math.min(token.length, tag.length) / Math.max(token.length, tag.length);
  }
  return 0;
}

function searchProductsByMultipleTags(products, query) {
  if (!query.trim()) {
    return { exactMatches: [], relatedProducts: [], tagSuggestions: [] };
  }

  const tokens = tokenizeQuery(query);
  console.log(`🔍 Tokens da busca: [${tokens.join(', ')}]`);
  
  const tagMatches = [];

  products.forEach(product => {
    if (!product.tags || product.tags.length === 0) return;

    const productTagsNormalized = product.tags.map(tag => ({
      original: tag.name,
      normalized: normalizeText(tag.name),
      weight: tag.weight || 1
    }));

    let exactMatches = 0;
    let partialMatches = 0;
    let totalWeightedScore = 0;
    const matchedTagsWithWeights = [];

    tokens.forEach(token => {
      const matchingTags = [];

      productTagsNormalized.forEach(tagObj => {
        const tag = tagObj.normalized;
        
        if (tag === token) {
          matchingTags.push({tag: tagObj, type: 'exact', similarity: 1.0});
        } else if (tag.includes(token) || token.includes(tag)) {
          const similarity = Math.min(token.length, tag.length) / Math.max(token.length, tag.length);
          matchingTags.push({tag: tagObj, type: 'exact', similarity});
        } else {
          const similarity = calculateTagSimilarity(token, tag);
          if (similarity > 0.7) {
            matchingTags.push({tag: tagObj, type: 'partial', similarity});
          }
        }
      });

      matchingTags.sort((a, b) => b.similarity - a.similarity);

      matchingTags.forEach(match => {
        const tagName = match.tag.original;
        const tagWeight = match.tag.weight;
        
        if (!matchedTagsWithWeights.some(t => t.name === tagName)) {
          matchedTagsWithWeights.push({name: tagName, weight: tagWeight});
          
          if (match.type === 'exact') {
            exactMatches++;
          } else {
            partialMatches++;
          }
          totalWeightedScore += 10 * tagWeight;
        }
      });
    });

    const totalMatches = exactMatches + (partialMatches * 0.5);
    if (totalMatches > 0) {
      const matchScore = totalWeightedScore / Math.max(tokens.length, 1);
      
      tagMatches.push({
        product,
        matchedTags: matchedTagsWithWeights.map(t => t.name),
        matchScore,
        totalTagsMatched: exactMatches + partialMatches,
        totalWeightedScore
      });
    }
  });

  tagMatches.sort((a, b) => {
    if (b.totalTagsMatched !== a.totalTagsMatched) {
      return b.totalTagsMatched - a.totalTagsMatched;
    }
    return b.matchScore - a.matchScore;
  });

  const exactMatches = [];
  const relatedProducts = [];

  tagMatches.forEach(match => {
    const product = match.product;
    const normName = normalizeText(product.name || '');
    const normCategory = normalizeText(product.category || '');
    const normQuery = normalizeText(query);

    const nameTokenHits = tokens.filter(t => normName.includes(t)).length;
    const categoryHits = tokens.filter(t => normCategory.includes(t)).length;
    const exactQueryInName = normQuery.length > 0 && (
      normName.includes(normQuery) || 
      normCategory.includes(normQuery)
    );

    const nameScore = nameTokenHits * 15;
    const tagScore = match.totalWeightedScore || (match.totalTagsMatched * 10);
    const categoryBonus = categoryHits * 5;
    const exactBonus = exactQueryInName ? 25 : 0;
    const totalScore = nameScore + tagScore + categoryBonus + exactBonus;

    const enrichedProduct = {
      ...product,
      relevance_score: totalScore,
      matched_tags: match.matchedTags
    };

    if (totalScore >= 20) {
      exactMatches.push(enrichedProduct);
    } else {
      relatedProducts.push(enrichedProduct);
    }
  });

  return { exactMatches, relatedProducts, tagSuggestions: [] };
}

// Algoritmo de produtos relacionados baseado na busca
function getSearchBasedRelatedProducts(currentProduct, allProducts, maxResults = 8) {
  console.log(`\\n🔍 ALGORITMO BASEADO NA BUSCA PRINCIPAL`);
  console.log(`Produto atual: ${currentProduct.name}`);
  
  const validProducts = allProducts.filter(product => 
    product.id !== currentProduct.id &&
    product.product_type !== 'master' &&
    product.is_active !== false
  );
  
  const searchQuery = currentProduct.name;
  console.log(`Query de busca: "${searchQuery}"`);
  
  // Usar EXATAMENTE a mesma função da busca principal
  const searchResults = searchProductsByMultipleTags(validProducts, searchQuery);
  
  console.log(`\\n📊 Resultados da busca:`);
  console.log(`- Matches exatos: ${searchResults.exactMatches.length}`);
  console.log(`- Produtos relacionados: ${searchResults.relatedProducts.length}`);
  
  // Combinar e ordenar resultados
  const allSearchResults = [
    ...searchResults.exactMatches,
    ...searchResults.relatedProducts
  ];
  
  allSearchResults.sort((a, b) => {
    const scoreA = a.relevance_score || 0;
    const scoreB = b.relevance_score || 0;
    
    if (Math.abs(scoreA - scoreB) > 0.1) {
      return scoreB - scoreA;
    }
    
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    
    if (Math.abs(priceA - priceB) > 0.01) {
      return priceA - priceB;
    }
    
    return a.name.localeCompare(b.name);
  });
  
  let finalProducts = allSearchResults.slice(0, maxResults);
  let algorithm = 'search_based';
  
  // Fallback se necessário
  if (finalProducts.length < 3) {
    const usedIds = new Set(finalProducts.map(p => p.id));
    const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
    const shuffled = remainingProducts.sort(() => Math.random() - 0.5);
    const additional = shuffled.slice(0, maxResults - finalProducts.length);
    
    finalProducts = [...finalProducts, ...additional];
    algorithm = 'fallback';
    
    console.log(`🎲 Fallback aplicado: +${additional.length} produtos aleatórios`);
  }
  
  console.log(`\\n🎯 Produtos relacionados finais:`);
  finalProducts.forEach((product, index) => {
    const score = product.relevance_score || 0;
    const method = score > 0 ? 'busca' : 'fallback';
    console.log(`${index + 1}. ${product.name} (${score.toFixed(1)} pts - ${method}) - R$ ${product.price}`);
  });
  
  return {
    products: finalProducts,
    algorithm,
    scores: Object.fromEntries(allSearchResults.map(p => [p.id, p.relevance_score || 0]))
  };
}

// Executar teste
console.log('🧪 TESTE DO ALGORITMO BASEADO NA BUSCA PRINCIPAL');
console.log('=================================================');

console.log('\\n🎮 TESTE: The Last of Us Part II Remastered - PS5');
console.log('===================================================');
const result = getSearchBasedRelatedProducts(products[0], products);

console.log('\\n\\n🎯 RESULTADO ESPERADO:');
console.log('- Deveria mostrar outros jogos do The Last of Us primeiro');
console.log('- Mesma lógica da busca que já funciona perfeitamente');
console.log('- Ordenação por relevância, depois preço, depois alfabética');
