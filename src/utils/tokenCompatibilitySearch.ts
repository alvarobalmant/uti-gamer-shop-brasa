import { normalizeText } from './smartSearch';

// Tipos para o novo sistema
export interface TokenMatch {
  queryToken: string;
  tagToken: string;
  matchType: 'exact' | 'partial' | 'numeric' | 'roman_numeral';
  similarity: number;
}

export interface TokenAnalysis {
  token: string;
  type: 'main' | 'descriptive' | 'numeric' | 'roman';
  weight: number;
  isEssential: boolean;
}

export interface CompatibilityResult {
  queryTokens: string[];
  tagTokens: string[];
  matches: TokenMatch[];
  compatibilityRatio: number;
  rawScore: number;
  finalScore: number;
  rejectedByNumericOnlyRule?: boolean; // Flag para indicar rejeição pela regra
  debug: {
    foundTokens: number;
    totalQueryTokens: number;
    specialBonuses: number;
    penalties: number;
  };
}

// Dicionário de sinônimos para melhorar matches
const SYNONYMS: Record<string, string[]> = {
  'cod': ['call', 'of', 'duty'],
  'gta': ['grand', 'theft', 'auto'],
  'mw': ['modern', 'warfare'],
  'bo': ['black', 'ops'],
  'bf': ['battlefield'],
  'ps': ['playstation'],
  'xbox': ['xbox'],
  'nintendo': ['nintendo'],
  'pc': ['computer', 'pc']
};

// Mapeamento de números romanos para árabes
const ROMAN_TO_ARABIC: Record<string, string> = {
  'i': '1',
  'ii': '2', 
  'iii': '3',
  'iv': '4',
  'v': '5',
  'vi': '6',
  'vii': '7',
  'viii': '8',
  'ix': '9',
  'x': '10',
  'xi': '11',
  'xii': '12'
};

// Detectar tipo de token
const detectTokenType = (token: string): TokenAnalysis['type'] => {
  const normalized = token.toLowerCase();
  
  // Números
  if (/^\d+$/.test(normalized)) {
    return 'numeric';
  }
  
  // Números romanos
  if (ROMAN_TO_ARABIC[normalized]) {
    return 'roman';
  }
  
  // Palavras descritivas comuns
  const descriptiveWords = [
    'ultimate', 'edition', 'deluxe', 'gold', 'premium', 'special',
    'complete', 'definitive', 'enhanced', 'remastered', 'collection',
    'bundle', 'pack', 'set', 'version', 'release'
  ];
  
  if (descriptiveWords.includes(normalized)) {
    return 'descriptive';
  }
  
  return 'main';
};

// Calcular peso do token baseado no tipo
const getTokenWeight = (type: TokenAnalysis['type']): number => {
  switch (type) {
    case 'main': return 1.0;
    case 'numeric': return 1.5;  // Números são mais importantes
    case 'roman': return 1.5;    // Números romanos também
    case 'descriptive': return 0.3; // Palavras descritivas menos importantes
    default: return 1.0;
  }
};

// Analisar tokens de uma string
const analyzeTokens = (text: string): TokenAnalysis[] => {
  const tokens = normalizeText(text)
    .split(/\s+/)
    .filter(token => token.length >= 1); // Aceitar tokens de 1+ caracteres (para números)
  
  return tokens.map(token => {
    const type = detectTokenType(token);
    const weight = getTokenWeight(type);
    const isEssential = type === 'main' || type === 'numeric' || type === 'roman';
    
    return { token, type, weight, isEssential };
  });
};

// Normalizar números romanos para árabes
const normalizeRomanNumerals = (token: string): string => {
  const normalized = token.toLowerCase();
  return ROMAN_TO_ARABIC[normalized] || token;
};

// Expandir sinônimos
const expandWithSynonyms = (token: string): string[] => {
  const normalized = token.toLowerCase();
  const synonyms = SYNONYMS[normalized];
  return synonyms ? [token, ...synonyms] : [token];
};

// Calcular similaridade entre dois tokens
const calculateTokenSimilarity = (token1: string, token2: string): number => {
  const norm1 = normalizeText(token1);
  const norm2 = normalizeText(token2);
  
  // Match exato
  if (norm1 === norm2) {
    return 1.0;
  }
  
  // Números romanos vs árabes
  const roman1 = normalizeRomanNumerals(norm1);
  const roman2 = normalizeRomanNumerals(norm2);
  if (roman1 === roman2) {
    return 1.0;
  }
  
  // Inclusão (um contém o outro)
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length);
  }
  
  // Sinônimos
  const synonyms1 = expandWithSynonyms(norm1);
  const synonyms2 = expandWithSynonyms(norm2);
  
  for (const syn1 of synonyms1) {
    for (const syn2 of synonyms2) {
      if (syn1 === syn2) {
        return 0.9; // Alta similaridade para sinônimos
      }
    }
  }
  
  // Levenshtein simplificado para casos fuzzy
  const maxLen = Math.max(norm1.length, norm2.length);
  if (maxLen === 0) return 1.0;
  
  let distance = 0;
  const minLen = Math.min(norm1.length, norm2.length);
  
  for (let i = 0; i < minLen; i++) {
    if (norm1[i] !== norm2[i]) distance++;
  }
  
  distance += Math.abs(norm1.length - norm2.length);
  const similarity = Math.max(0, 1 - distance / maxLen);
  
  // Só considerar se similaridade for alta o suficiente
  return similarity > 0.7 ? similarity : 0;
};

// Encontrar o melhor match para um token da query
const findBestTokenMatch = (queryToken: TokenAnalysis, tagTokens: TokenAnalysis[]): TokenMatch | null => {
  let bestMatch: TokenMatch | null = null;
  let bestSimilarity = 0;
  
  for (const tagToken of tagTokens) {
    const similarity = calculateTokenSimilarity(queryToken.token, tagToken.token);
    
    if (similarity > bestSimilarity && similarity >= 0.8) {
      const matchType = getMatchType(queryToken, tagToken, similarity);
      
      bestMatch = {
        queryToken: queryToken.token,
        tagToken: tagToken.token,
        matchType,
        similarity
      };
      bestSimilarity = similarity;
    }
  }
  
  return bestMatch;
};

// Determinar tipo de match
const getMatchType = (queryToken: TokenAnalysis, tagToken: TokenAnalysis, similarity: number): TokenMatch['matchType'] => {
  if (similarity === 1.0) {
    if (queryToken.type === 'numeric' && tagToken.type === 'numeric') {
      return 'numeric';
    }
    if (queryToken.type === 'roman' || tagToken.type === 'roman') {
      return 'roman_numeral';
    }
    return 'exact';
  }
  
  return 'partial';
};

// Calcular bônus e penalidades especiais
const calculateSpecialBonuses = (
  matches: TokenMatch[], 
  queryAnalysis: TokenAnalysis[], 
  tagAnalysis: TokenAnalysis[]
): number => {
  let bonus = 0;
  
  // 1. Bônus para match perfeito (todos os tokens da query encontrados com similaridade 1.0)
  if (matches.length === queryAnalysis.length && 
      matches.every(m => m.similarity === 1.0)) {
    bonus += 15;
  }
  
  // 2. Tratamento especial para números
  const queryNumbers = queryAnalysis.filter(t => t.type === 'numeric' || t.type === 'roman');
  const tagNumbers = tagAnalysis.filter(t => t.type === 'numeric' || t.type === 'roman');
  
  if (queryNumbers.length > 0) {
    const numericMatches = matches.filter(m => 
      (m.matchType === 'numeric' || m.matchType === 'roman_numeral') && 
      m.similarity === 1.0
    );
    
    if (tagNumbers.length > 0) {
      // Se a tag tem números mas não batem com a query
      if (numericMatches.length === 0) {
        bonus -= 50; // Penalidade severa para números completamente diferentes
      } else if (numericMatches.length < queryNumbers.length) {
        bonus -= 25; // Penalidade menor para alguns números diferentes
      } else {
        bonus += 20; // Bônus para números corretos
      }
    }
    // Se a query tem números mas a tag não tem, não penalizar tanto
    // (permite que tags gerais ainda sejam relevantes)
  }
  
  // 3. Bônus para tokens essenciais
  const essentialMatches = matches.filter(m => {
    const queryToken = queryAnalysis.find(t => t.token === m.queryToken);
    return queryToken?.isEssential;
  });
  bonus += essentialMatches.length * 3;
  
  // 4. Penalidade leve para muitos tokens descritivos não encontrados
  const descriptiveTokens = queryAnalysis.filter(t => t.type === 'descriptive');
  const descriptiveMatches = matches.filter(m => {
    const queryToken = queryAnalysis.find(t => t.token === m.queryToken);
    return queryToken?.type === 'descriptive';
  });
  
  if (descriptiveTokens.length > 0) {
    const descriptiveMissed = descriptiveTokens.length - descriptiveMatches.length;
    bonus -= descriptiveMissed * 2; // Penalidade leve
  }
  
  return bonus;
};

// Função principal: calcular compatibilidade entre query e tag
export const calculateTokenCompatibility = (
  query: string, 
  tagName: string, 
  tagWeight: number
): CompatibilityResult => {
  const queryAnalysis = analyzeTokens(query);
  const tagAnalysis = analyzeTokens(tagName);
  
  // Encontrar matches para cada token da query
  const matches: TokenMatch[] = [];
  
  for (const queryToken of queryAnalysis) {
    const match = findBestTokenMatch(queryToken, tagAnalysis);
    if (match) {
      matches.push(match);
    }
  }
  
  // CORREÇÃO: Calcular compatibilidade baseada no MAIOR número de tokens
  const foundTokens = matches.length;
  const totalQueryTokens = queryAnalysis.length;
  const totalTagTokens = tagAnalysis.length;
  const maxTokens = Math.max(totalQueryTokens, totalTagTokens);
  const compatibilityRatio = foundTokens / maxTokens;
  
  // Score base proporcional: 10 × peso × (tokens compatíveis / tokens totais)
  const rawScore = 10 * tagWeight * compatibilityRatio;
  
  // Aplicar bônus e penalidades especiais
  const specialBonuses = calculateSpecialBonuses(matches, queryAnalysis, tagAnalysis);
  
  // REGRA ANTI-FALSO-POSITIVO: Rejeitar se a única compatibilidade for por tokens numéricos
  let rejectedByNumericOnlyRule = false;
  if (matches.length > 0) {
    // Verificar se todos os matches são apenas numéricos/romanos
    const allMatchesAreNumeric = matches.every(match => {
      const queryToken = queryAnalysis.find(t => t.token === match.queryToken);
      const tagToken = tagAnalysis.find(t => t.token === match.tagToken);
      
      return (queryToken?.type === 'numeric' || queryToken?.type === 'roman') &&
             (tagToken?.type === 'numeric' || tagToken?.type === 'roman');
    });
    
    // Se todos os matches são numéricos E existem tokens não-numéricos na query que não foram encontrados
    const hasNonNumericQueryTokens = queryAnalysis.some(t => t.type !== 'numeric' && t.type !== 'roman');
    
    if (allMatchesAreNumeric && hasNonNumericQueryTokens) {
      rejectedByNumericOnlyRule = true;
    }
  }
  
  // Score final (mínimo 0, ou 0 se rejeitado pela regra)
  const finalScore = rejectedByNumericOnlyRule ? 0 : Math.max(0, rawScore + specialBonuses);
  
  return {
    queryTokens: queryAnalysis.map(t => t.token),
    tagTokens: tagAnalysis.map(t => t.token),
    matches,
    compatibilityRatio,
    rawScore,
    finalScore,
    rejectedByNumericOnlyRule, // Adicionar flag para debug
    debug: {
      foundTokens,
      totalQueryTokens,
      totalTagTokens,
      maxTokens,
      specialBonuses,
      penalties: specialBonuses < 0 ? Math.abs(specialBonuses) : 0
    }
  };
};

// Função para buscar produtos usando o novo sistema
export const searchProductsByTokenCompatibility = (products: any[], query: string) => {
  if (!query.trim()) {
    const filteredProducts = products.filter(product => product.product_type !== 'master');
    return { exactMatches: filteredProducts.slice(0, 50), relatedProducts: [], tagSuggestions: [] };
  }
  
  const results: Array<{
    product: any;
    totalScore: number;
    tagScores: Array<{
      tagName: string;
      compatibility: CompatibilityResult;
    }>;
    nameScore: number;
    categoryScore: number;
    exactBonus: number;
  }> = [];
  
  const validProducts = products.filter(product => product.product_type !== 'master');
  
  validProducts.forEach(product => {
    // 1. Calcular score das tags usando novo sistema
    let totalTagScore = 0;
    const tagScores: Array<{ tagName: string; tagWeight: number; compatibility: CompatibilityResult }> = [];
    
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach((tag: any) => {
        const tagName = tag.name || tag;
        const tagWeight = Number(tag.weight) || 1;
        
        const compatibility = calculateTokenCompatibility(query, tagName, tagWeight);
        
        if (compatibility.finalScore > 0) {
          totalTagScore += compatibility.finalScore;
          tagScores.push({ tagName, tagWeight, compatibility });
        }
      });
    }
    
    // 2. Score do nome (manter sistema atual)
    const queryTokens = analyzeTokens(query).map(t => t.token);
    const normName = normalizeText(product.name || '');
    const nameTokenHits = queryTokens.filter(t => normName.includes(t)).length;
    const nameScore = nameTokenHits * 15;
    
    // 3. Score da categoria (manter sistema atual)
    const normCategory = normalizeText(product.category || '');
    const categoryHits = queryTokens.filter(t => normCategory.includes(t)).length;
    const categoryScore = categoryHits * 5;
    
    // 4. Bônus exato (manter sistema atual)
    const normQuery = normalizeText(query);
    const exactQueryInName = normQuery.length > 0 && (
      normName.includes(normQuery) || 
      normCategory.includes(normQuery)
    );
    const exactBonus = exactQueryInName ? 25 : 0;
    
    // Score total
    const totalScore = totalTagScore + nameScore + categoryScore + exactBonus;
    
    if (totalScore > 0) {
      results.push({
        product,
        totalScore,
        tagScores,
        nameScore,
        categoryScore,
        exactBonus
      });
    }
  });
  
  // Ordenar por score total
  results.sort((a, b) => b.totalScore - a.totalScore);
  
  // Enriquecer produtos com informações de debug
  const enrichedResults = results.map(result => ({
    ...result.product,
    relevance_score: result.totalScore,
    matched_tags: result.tagScores.map(ts => ts.tagName),
    debug_info: {
      nameMatch: result.nameScore > 0,
      tagMatches: result.tagScores.length,
      exactMatch: result.exactBonus > 0,
      partialMatch: result.totalScore > 0 && result.exactBonus === 0,
      scoreBreakdown: {
        nameScore: result.nameScore,
        tagScore: result.totalScore - result.nameScore - result.categoryScore - result.exactBonus,
        categoryScore: result.categoryScore,
        exactBonus: result.exactBonus,
        totalScore: result.totalScore,
        tagDetails: result.tagScores.map(ts => ({
          name: ts.tagName,
          weight: ts.tagWeight,
          compatibilityRatio: ts.compatibility.compatibilityRatio,
          rawScore: ts.compatibility.rawScore,
          finalScore: ts.compatibility.finalScore,
          matches: ts.compatibility.matches,
          debug: ts.compatibility.debug
        }))
      }
    }
  }));
  
  // Separar em exatos e relacionados
  const exactMatches = enrichedResults.filter(r => r.relevance_score >= 20);
  const relatedProducts = enrichedResults.filter(r => r.relevance_score > 0 && r.relevance_score < 20);
  
  return {
    exactMatches,
    relatedProducts,
    tagSuggestions: [] // TODO: implementar sugestões baseadas no novo sistema
  };
};
