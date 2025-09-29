import Fuse from 'fuse.js';
import { normalizeText } from './smartSearch';

export interface TagMatch {
  product: any;
  matchedTags: string[];
  matchScore: number;
  totalTagsMatched: number;
  totalWeightedScore?: number;
}

export interface MultiTagSearchResult {
  exactMatches: any[];
  relatedProducts: any[];
  tagSuggestions: string[];
}

// Tokeniza a query em palavras individuais para busca por tags múltiplas
export const tokenizeQuery = (query: string): string[] => {
  return normalizeText(query)
    .split(/\s+/)
    .filter(token => token.length >= 2); // Só considera tokens com 2+ caracteres
};

// Helpers
const getTagWeight = (tag: any): number => {
  // Usar o peso diretamente da tag (vem do banco agora)
  return typeof tag.weight === 'number' ? tag.weight : 1;
};

const includesLoosely = (hay: string, needle: string) => {
  const a = hay.replace(/\s+/g, '');
  const b = needle.replace(/\s+/g, '');
  return hay.includes(needle) || a.includes(b);
};

// Cache para otimização de performance (TEMPORARIAMENTE DESABILITADO PARA DEBUG)
const searchCache = new Map<string, MultiTagSearchResult>();
const CACHE_SIZE_LIMIT = 0; // DESABILITAR CACHE PARA DEBUG

// Busca produtos que correspondem a múltiplas tags (otimizada)
export const searchProductsByMultipleTags = (products: any[], query: string): MultiTagSearchResult => {
  // Cache para queries repetidas
  const cacheKey = `${query.trim().toLowerCase()}_${products.length}`;
  if (searchCache.has(cacheKey)) {
    console.log('🚀 Cache hit para query:', query);
    return searchCache.get(cacheKey)!;
  }

  if (!query.trim()) {
    const filteredProducts = products.filter(product => product.product_type !== 'master');
    return { exactMatches: filteredProducts.slice(0, 50), relatedProducts: [], tagSuggestions: [] };
  }

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return { exactMatches: [], relatedProducts: [], tagSuggestions: [] };
  }

  console.log('🔍 MultiTag Search - Query tokens:', tokens);

  // Filtrar produtos master
  const validProducts = products.filter(product => product.product_type !== 'master');
  
  // Array para armazenar correspondências de tags
  const tagMatches: TagMatch[] = [];
  
// Set para coletar sugestões de tags
const allTags = new Set<string>();
// Índice global de tags por nome normalizado (para casar com o nome do produto)
// Coletar todas as tags existentes somente a partir das tags associadas aos produtos (sem índice global)
validProducts.forEach(p => {
  if (!p.tags || !Array.isArray(p.tags)) return;
  p.tags.forEach((t: any) => {
    const original = t?.name || t;
    const normalized = normalizeText(original);
    allTags.add(normalized);
  });
});
  // Para cada produto, verificar quantas tags correspondem
  validProducts.forEach(product => {
    if (!product.tags || !Array.isArray(product.tags)) return;
    
    // Normalizar tags mas manter referência para o objeto original (com peso)
    let productTagsNormalized = product.tags.map((tag: any) => ({
      normalized: normalizeText(tag.name || tag),
      original: tag.name || tag,
      weight: Number(tag.weight) || 1 // Peso da tag
    }));
    
// Não incluir tags inferidas por nome/categoria; usar apenas as tags associadas ao produto
    
    productTagsNormalized.forEach(tag => allTags.add(tag.normalized));
    
    const matchedTagsWithWeights: Array<{name: string, weight: number}> = [];
    let exactMatches = 0;
    let partialMatches = 0;
    let totalWeightedScore = 0;

    // Para cada token da busca, encontrar TODAS as tags que batem
    tokens.forEach(token => {
      const matchingTags: Array<{tag: any, type: 'exact' | 'partial', similarity: number}> = [];

      productTagsNormalized.forEach(tagObj => {
        const tag = tagObj.normalized;
        
        // Match exato
        if (tag === token) {
          matchingTags.push({tag: tagObj, type: 'exact', similarity: 1.0});
        }
        // Match por inclusão (tag contém token ou vice-versa)
        else if (tag.includes(token) || token.includes(tag)) {
          const similarity = Math.min(token.length, tag.length) / Math.max(token.length, tag.length);
          matchingTags.push({tag: tagObj, type: 'exact', similarity});
        }
        // Match fuzzy
        else {
          const similarity = calculateTagSimilarity(token, tag);
          if (similarity > 0.7) {
            matchingTags.push({tag: tagObj, type: 'partial', similarity});
          }
        }
      });

      // Ordenar matches por similaridade (melhor primeiro)
      matchingTags.sort((a, b) => b.similarity - a.similarity);

      // Adicionar todos os matches encontrados (não só o primeiro)
      matchingTags.forEach(match => {
        const tagName = match.tag.original;
        const tagWeight = match.tag.weight;
        
        // Evitar duplicatas
        if (!matchedTagsWithWeights.some(t => t.name === tagName)) {
          matchedTagsWithWeights.push({name: tagName, weight: tagWeight});
          
          if (match.type === 'exact') {
            exactMatches++;
          } else {
            partialMatches++;
          }
          // Cada tag contribui 10x(peso da tag)
          totalWeightedScore += 10 * tagWeight;
        }
      });
    });

    // Calcular score baseado em correspondências E pesos
    const totalMatches = exactMatches + (partialMatches * 0.5);
    if (totalMatches > 0) {
      const matchScore = totalWeightedScore / Math.max(tokens.length, 1);
      
      tagMatches.push({
        product,
        matchedTags: matchedTagsWithWeights.map(t => t.name),
        matchScore,
        totalTagsMatched: exactMatches + partialMatches,
        totalWeightedScore // Adicionar para debug
      });
    }
  });

  // Ordenar por relevância (mais tags correspondentes = maior relevância)
  tagMatches.sort((a, b) => {
    // Primeiro por número de matches exatos, depois por score total
    if (b.totalTagsMatched !== a.totalTagsMatched) {
      return b.totalTagsMatched - a.totalTagsMatched;
    }
    return b.matchScore - a.matchScore;
  });

  console.log('🎯 MultiTag Search - Tag matches found:', tagMatches.length);

  // Separar em correspondências exatas e relacionadas (enriquecendo com debug)
  const exactMatches: any[] = [];
  const relatedProducts: any[] = [];

  tagMatches.forEach(match => {
    const product = match.product;

    // Calcular debug/score adicional com base em nome e categoria
    const normName = normalizeText(product.name || '');
    const normCategory = normalizeText(product.category || '');

    const nameTokenHits = tokens.filter(t => normName.includes(t)).length;
    const categoryHits = tokens.filter(t => normCategory.includes(t)).length;
    const normQuery = normalizeText(query);
    const exactQueryInName = normQuery.length > 0 && (
      includesLoosely(normName, normQuery) || 
      includesLoosely(normCategory, normQuery)
    );

    const nameScore = nameTokenHits * 15; // peso nome
    const tagScore = match.totalWeightedScore || (match.totalTagsMatched * 10); // usar score ponderado das tags
    const categoryBonus = categoryHits * 5;
    const exactBonus = exactQueryInName ? 25 : 0;
    const totalScore = nameScore + tagScore + categoryBonus + exactBonus;

    // Mapear matched_tags preservando nomes originais detectados
    const originalMatchedTags: string[] = match.matchedTags;

    console.log(`🎯 Main Search Product: ${product.name}`, {
      nameScore,
      tagScore,
      categoryBonus,
      exactBonus,
      totalScore,
      matchedTags: originalMatchedTags,
      totalTagsMatched: match.totalTagsMatched,
      totalWeightedScore: match.totalWeightedScore
    });

    const enriched = {
      ...product,
      relevance_score: Number(totalScore),
      matched_tags: originalMatchedTags,
      debug_info: {
        nameMatch: nameTokenHits > 0,
        tagMatches: originalMatchedTags.length,
        exactMatch: exactQueryInName,
        partialMatch: !exactQueryInName && (nameTokenHits > 0 || originalMatchedTags.length > 0),
        categoryWeight: categoryHits > 0 ? categoryBonus : 0,
        scoreBreakdown: {
          nameScore,
          tagScore,
          categoryBonus,
          exactBonus,
          totalScore,
          tagDetails: originalMatchedTags.map(tagName => {
            // Encontrar tag completa com peso e categoria
            const tagData = product.tags?.find((t: any) => t.name === tagName);
            const weight = getTagWeight(tagData);
            const contribution = 10 * weight;
            return { 
              name: tagName, 
              category: tagData?.category || 'generic',
              weight, 
              contribution,
              description: `"${tagName}" (categoria: ${tagData?.category || 'generic'}, peso: ${weight}): ${weight} × 10 = ${contribution} pontos`
            };
          })
        }
      }
    };

    // Se corresponde a pelo menos metade das tags buscadas, considera exato
    if (match.totalTagsMatched >= Math.ceil(tokens.length / 2)) {
      exactMatches.push(enriched);
    } else if (match.totalTagsMatched > 0) {
      relatedProducts.push(enriched);
    }
  });

  // Ordenar por relevance_score (maior para menor)
  exactMatches.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
  relatedProducts.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  // Gerar sugestões de tags baseadas nos tokens que não deram match
  const tagSuggestions = generateTagSuggestions(Array.from(allTags), tokens);

  console.log('✅ MultiTag Search Results:', {
    exactMatches: exactMatches.length,
    relatedProducts: relatedProducts.length,
    tagSuggestions: tagSuggestions.length
  });

  const result = { exactMatches, relatedProducts, tagSuggestions };
  
  // Adicionar ao cache (limitando o tamanho)
  if (searchCache.size >= CACHE_SIZE_LIMIT) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  searchCache.set(cacheKey, result);

  return result;
};

// Calcula similaridade entre duas strings para matching fuzzy de tags
const calculateTagSimilarity = (str1: string, str2: string): number => {
  const norm1 = normalizeText(str1);
  const norm2 = normalizeText(str2);
  
  // Verifica inclusão
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return 0.9;
  }
  
  // Levenshtein simplificado
  const len1 = norm1.length;
  const len2 = norm2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1;
  
  let distance = 0;
  const minLen = Math.min(len1, len2);
  
  for (let i = 0; i < minLen; i++) {
    if (norm1[i] !== norm2[i]) distance++;
  }
  
  distance += Math.abs(len1 - len2);
  return Math.max(0, 1 - distance / maxLen);
};

// Gera sugestões de tags baseadas nos tokens de busca
const generateTagSuggestions = (allTags: string[], searchTokens: string[]): string[] => {
  const suggestions: string[] = [];
  
  searchTokens.forEach(token => {
    // Buscar tags similares que não foram encontradas exatamente
    const similarTags = allTags.filter(tag => {
      const similarity = calculateTagSimilarity(token, tag);
      return similarity > 0.5 && similarity < 0.9; // Similar mas não exata
    });
    
    suggestions.push(...similarTags.slice(0, 3)); // Máximo 3 sugestões por token
  });
  
  return [...new Set(suggestions)]; // Remove duplicatas
};

// Importar o novo sistema
import { searchProductsByTokenCompatibility } from './tokenCompatibilitySearch';

// Flag para alternar entre sistemas (para testes)
const USE_NEW_TOKEN_SYSTEM = true;

// Função híbrida que combina busca por tags múltiplas com busca tradicional
export const enhancedSmartSearch = (products: any[], query: string): MultiTagSearchResult => {
  // NOVO: Usar sistema de compatibilidade de tokens se habilitado
  if (USE_NEW_TOKEN_SYSTEM) {
    console.log('🚀 Usando NOVO sistema de compatibilidade de tokens');
    const newResults = searchProductsByTokenCompatibility(products, query);
    
    // Converter para o formato esperado
    return {
      exactMatches: newResults.exactMatches,
      relatedProducts: newResults.relatedProducts,
      tagSuggestions: newResults.tagSuggestions
    };
  }
  
  // Sistema original (mantido como fallback)
  console.log('🔧 Usando sistema ORIGINAL de busca');
  
  // Primeiro tentar busca por tags múltiplas
  const multiTagResults = searchProductsByMultipleTags(products, query);
  
  // Se encontrou resultados suficientes por tags, retornar com ordenação
  if (multiTagResults.exactMatches.length > 0) {
    // Ordenar por relevance_score (maior para menor)
    multiTagResults.exactMatches.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    multiTagResults.relatedProducts.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    return multiTagResults;
  }
  
  // Caso contrário, fazer busca tradicional como fallback
  const fuseOptions = {
    keys: [
      { name: 'name', weight: 2.0 },
      { name: 'description', weight: 0.5 },
      { name: 'platform', weight: 1.5 },
      { name: 'category', weight: 1.5 },
      { name: 'tags.name', weight: 3.0 },
    ],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    findAllMatches: true,
  };

  const validProducts = products.filter(p => p.product_type !== 'master');
  
// Removido índice global de tags no fallback; usaremos apenas tags associadas ao produto

  const fuse = new Fuse(validProducts, fuseOptions);
  const fuseResults = fuse.search(query);

  const tokens = tokenizeQuery(query);
  const fallbackExact: any[] = [];
  const fallbackRelated: any[] = [];

  console.log('🔧 Fallback Search - Tokens:', tokens);

  fuseResults.forEach(result => {
    const score = result.score ?? 1; // 0 é melhor (mais relevante)
    const product = result.item;

    const normName = normalizeText(product.name || '');
    const normCategory = normalizeText(product.category || '');
    const normQuery = normalizeText(query);
    const exactQueryInName = normQuery.length > 0 && (
      includesLoosely(normName, normQuery) || 
      includesLoosely(normCategory, normQuery)
    );

    const nameTokenHits = tokens.filter(t => normName.includes(t)).length;
    const categoryHits = tokens.filter(t => normCategory.includes(t)).length;

    // Score base do Fuse
    const fuseBase = Math.max(0, 1 - score) * 40;
    const nameScore = nameTokenHits * 15;
    const categoryBonus = categoryHits * 5;
    const exactBonus = exactQueryInName ? 25 : 0;

    // Tags do produto com pesos (igual ao main search)
    let productTagsNormalized = Array.isArray(product.tags) 
      ? product.tags.map((tag: any) => ({
          normalized: normalizeText(tag.name || tag),
          original: tag.name || tag,
          weight: getTagWeight(tag)
        }))
      : [];

// Não incluir tags inferidas por nome/categoria no fallback; considerar somente tags associadas ao produto

    // Calcular tagScore com pesos reais (10 × peso da tag)
    const matchedTagsWithWeights: Array<{name: string, weight: number}> = [];
    let totalWeightedTagScore = 0;

    tokens.forEach(token => {
      productTagsNormalized.forEach(tagObj => {
        const tag = tagObj.normalized;
        let similarity = 0;
        
        if (tag === token) {
          similarity = 1.0;
        } else if (includesLoosely(tag, token) || includesLoosely(token, tag)) {
          similarity = Math.min(token.length, tag.length) / Math.max(token.length, tag.length);
        } else {
          similarity = calculateTagSimilarity(token, tag);
        }

        if (similarity > 0.7) {
          const tagName = tagObj.original;
          const tagWeight = tagObj.weight;
          
          // Evitar duplicatas
          if (!matchedTagsWithWeights.some(t => t.name === tagName)) {
            matchedTagsWithWeights.push({name: tagName, weight: tagWeight});
            totalWeightedTagScore += 10 * tagWeight; // 10 × peso da tag
          }
        }
      });
    });

    const tagScore = totalWeightedTagScore;
    const totalScore = fuseBase + nameScore + tagScore + categoryBonus + exactBonus;

    console.log(`🎯 Fallback Product: ${product.name}`, {
      fuseBase,
      nameScore,
      tagScore,
      categoryBonus,
      exactBonus,
      totalScore,
      matchedTags: matchedTagsWithWeights.map(t => `${t.name}(${t.weight})`)
    });

    const enriched = {
      ...product,
      relevance_score: Number(totalScore),
      matched_tags: matchedTagsWithWeights.map(t => t.name),
      debug_info: {
        nameMatch: nameTokenHits > 0,
        tagMatches: matchedTagsWithWeights.length,
        exactMatch: exactQueryInName,
        partialMatch: !exactQueryInName && (nameTokenHits > 0 || matchedTagsWithWeights.length > 0),
        categoryWeight: categoryHits > 0 ? categoryBonus : 0,
        scoreBreakdown: {
          fuseBase,
          nameScore,
          tagScore,
          categoryBonus,
          exactBonus,
          totalScore,
          tagDetails: matchedTagsWithWeights.map(t => ({ name: t.name, weight: t.weight, contribution: 10 * t.weight }))
        }
      }
    };

    if (score < 0.2) {
      fallbackExact.push(enriched);
    } else if (score < 0.4) {
      fallbackRelated.push(enriched);
    }
  });

  // Ordenar por relevance_score
  fallbackExact.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
  fallbackRelated.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  const combinedRelated = [...multiTagResults.relatedProducts, ...fallbackRelated];
  combinedRelated.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  return {
    exactMatches: fallbackExact,
    relatedProducts: combinedRelated,
    tagSuggestions: multiTagResults.tagSuggestions
  };
};