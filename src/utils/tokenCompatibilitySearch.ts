import { normalizeText } from './smartSearch';
import { DESCRIPTIVE_BRASILEIRO } from './tokenClassification';

// Tags relacionadas a consoles (para regra especial de priorização)
const CONSOLE_TAGS = [
  // PlayStation
  'playstation', 'ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'psx', 'psone', 'playstation1', 'playstation2', 
  'playstation3', 'playstation4', 'playstation5', 'sony', 'psvr', 'psp', 'psvita', 'vita',
  
  // Xbox
  'xbox', 'xbox360', 'xboxone', 'xboxseriesx', 'xboxseriess', 'x360', 'xone', 'xbox360', 
  'xsx', 'xss', 'microsoft', 'gamepass',
  
  // Nintendo
  'nintendo', 'switch', 'nintendoswitch', 'wii', 'wiiu', 'gamecube', 'n64', 'snes', 'nes',
  'gameboy', 'gba', '3ds', 'ds', 'nds',
  
  // PC/Steam
  'pc', 'steam', 'epic', 'origin', 'uplay', 'gog', 'windows',
  
  // Retro/Outros
  'sega', 'dreamcast', 'saturn', 'genesis', 'megadrive', 'atari'
];

// Normalizar tags de console para comparação
const NORMALIZED_CONSOLE_TAGS = CONSOLE_TAGS.map(tag => 
  tag.toLowerCase().replace(/[áàâãä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
     .replace(/[óòôõö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ç/g, 'c').trim()
);

// Tipos para o novo sistema
export interface TokenMatch {
  queryToken: string;
  tagToken: string;
  matchType: 'exact' | 'partial' | 'numeric' | 'roman_numeral';
  similarity: number;
}

export interface TokenAnalysis {
  token: string;
  type: 'MAIN' | 'DESCRIPTIVE' | 'NUMERIC' | 'ROMAN';
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

// Detectar tipo de token - usando lista unificada do tokenClassification
const detectTokenType = (token: string): TokenAnalysis['type'] => {
  const normalized = token.toLowerCase()
    .replace(/[áàâãä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .trim();
  
  // Números
  if (/^\d+$/.test(normalized)) {
    return 'NUMERIC';
  }
  
  // Números romanos
  if (ROMAN_TO_ARABIC[normalized]) {
    return 'ROMAN';
  }
  
  // Usar a lista completa de palavras descritivas
  if (DESCRIPTIVE_BRASILEIRO.includes(normalized)) {
    return 'DESCRIPTIVE';
  }
  
  return 'MAIN';
};

// Calcular peso do token baseado no tipo
const getTokenWeight = (type: TokenAnalysis['type']): number => {
  switch (type) {
    case 'MAIN': return 1.0;
    case 'NUMERIC': return 1.5;  // Números são mais importantes
    case 'ROMAN': return 1.5;    // Números romanos também
    case 'DESCRIPTIVE': return 0.3; // Palavras descritivas menos importantes
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
    const isEssential = type === 'MAIN' || type === 'NUMERIC' || type === 'ROMAN';
    
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
    if (queryToken.type === 'NUMERIC' && tagToken.type === 'NUMERIC') {
      return 'numeric';
    }
    if (queryToken.type === 'ROMAN' || tagToken.type === 'ROMAN') {
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
  const queryNumbers = queryAnalysis.filter(t => t.type === 'NUMERIC' || t.type === 'ROMAN');
  const tagNumbers = tagAnalysis.filter(t => t.type === 'NUMERIC' || t.type === 'ROMAN');
  
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
  const descriptiveTokens = queryAnalysis.filter(t => t.type === 'DESCRIPTIVE');
  const descriptiveMatches = matches.filter(m => {
    const queryToken = queryAnalysis.find(t => t.token === m.queryToken);
    return queryToken?.type === 'DESCRIPTIVE';
  });
  
  if (descriptiveTokens.length > 0) {
    const descriptiveMissed = descriptiveTokens.length - descriptiveMatches.length;
    bonus -= descriptiveMissed * 2; // Penalidade leve
  }
  
  return bonus;
};

// Função para verificar se um produto É UM CONSOLE (não apenas tem tags de console)
const isConsoleProduct = (product: any): boolean => {
  if (!product) return false;

  const category = String(product.category || '').toLowerCase();
  const productType = String(product.product_type || '').toLowerCase();
  const nameRaw = String(product.name || '');
  const name = nameRaw.toLowerCase();

  // 1) Blacklist explícito: qualquer coisa classificada como jogo NÃO é console
  const gameCategories = ['jogo', 'jogos', 'game', 'games', 'software'];
  if (gameCategories.some(cat => category.includes(cat))) return false;
  if (productType.includes('game') || productType.includes('jogo')) return false;

  // 2) Whitelist por categoria/tipo
  const consoleCategories = ['console', 'consoles', 'videogame', 'video game', 'hardware', 'plataforma'];
  if (consoleCategories.some(cat => category.includes(cat))) return true;
  if (productType.includes('console') || productType.includes('hardware')) return true;

  // 3) Heurística por nome: exigir padrões de console, evitando títulos de jogos
  const hasConsoleWord = /\bconsole\b/.test(name);
  if (hasConsoleWord) return true;

  const stripped = name.replace(/[:\-–|]/g, ' ').replace(/\s+/g, ' ').trim();
  const consolePatterns: RegExp[] = [
    /^playstation\s*5(\s+(console|digital|slim|standard|disc|1tb|2tb))?$/i,
    /^playstation\s*4(\s+(console|slim|pro))?$/i,
    /^ps5(\s+(console|digital|slim|standard|disc|1tb|2tb))?$/i,
    /^ps4(\s+(console|slim|pro))?$/i,
    /^xbox\s*series\s*x(\s+(console|1tb|2tb))?$/i,
    /^xbox\s*series\s*s(\s+(console|512gb|1tb))?$/i,
    /^xbox\s*one(\s+(console|s|x))?$/i,
    /^xbox\s*360(\s+(console))?$/i,
    /^nintendo\s*switch(\s+(console|oled|lite))?$/i,
  ];

  return consolePatterns.some(re => re.test(stripped));
};

// Função para verificar se um produto tem tags relacionadas a consoles (MANTIDA PARA REFERÊNCIA)
const hasConsoleTags = (product: any): boolean => {
  if (!product.tags || !Array.isArray(product.tags)) return false;
  
  return product.tags.some((tag: any) => {
    const tagName = (tag.name || tag).toLowerCase()
      .replace(/[áàâãä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ç/g, 'c').trim();
    
    return NORMALIZED_CONSOLE_TAGS.includes(tagName);
  });
};

// Função para verificar se a query contém apenas tokens DESCRIPTIVE
const isOnlyDescriptiveQuery = (query: string): boolean => {
  const tokens = query.toLowerCase().split(/\s+/).filter(token => token.length >= 2);
  
  if (tokens.length === 0) return false;
  
  return tokens.every(token => {
    const normalizedToken = token.replace(/[áàâãä]/g, 'a').replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i').replace(/[óòôõö]/g, 'o').replace(/[úùûü]/g, 'u')
      .replace(/ç/g, 'c').trim();
    
    return DESCRIPTIVE_BRASILEIRO.includes(normalizedToken);
  });
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
  let compatibilityRatio = foundTokens / maxTokens;
  
  // REGRA ESPECIAL: Tags só com tokens DESCRIPTIVE sempre têm compatibilityRatio = 1.0
  console.log(`🔍 [TOKEN-COMPAT] Tag: "${tagName}"`);
  console.log(`🔍 [TOKEN-COMPAT] Análise tokens:`, tagAnalysis.map(t => `${t.token}(${t.type})`));
  
  const tagOnlyHasDescriptive = tagAnalysis.length > 0 && tagAnalysis.every(t => t.type === 'DESCRIPTIVE');
  console.log(`🔍 [TOKEN-COMPAT] tagOnlyHasDescriptive: ${tagOnlyHasDescriptive}, foundTokens: ${foundTokens}`);
  
  // APLICAR REGRA ESPECIAL: Se tag só tem DESCRIPTIVE e há matches, forçar 100% compatibilidade
  if (tagOnlyHasDescriptive && foundTokens > 0) {
    compatibilityRatio = 1.0;
    console.log(`🚀 [TOKEN-COMPAT] REGRA ESPECIAL APLICADA: Tag "${tagName}" só tem DESCRIPTIVE + tem matches → compatibilityRatio = 1.0`);
  }
  
  // Score base proporcional: 10 × peso × (tokens compatíveis / tokens totais)
  const rawScore = 10 * tagWeight * compatibilityRatio;
  
  // Aplicar bônus e penalidades especiais
  const specialBonuses = calculateSpecialBonuses(matches, queryAnalysis, tagAnalysis);
  
  // Boost adicional para tags DESCRIPTIVE (além do compatibilityRatio = 1.0)
  let descriptiveBoost = 0;
  if (tagOnlyHasDescriptive && foundTokens > 0) {
    descriptiveBoost = 20; // Boost adicional para garantir alta pontuação
    console.log(`🚀 [TOKEN-COMPAT] BOOST ADICIONAL: +${descriptiveBoost} pontos para tag DESCRIPTIVE "${tagName}"`);
  }
  
  // REGRA ANTI-FALSO-POSITIVO: Rejeitar se a única compatibilidade for por tokens numéricos
  let rejectedByNumericOnlyRule = false;
  if (matches.length > 0) {
    // Verificar se todos os matches são apenas numéricos/romanos
    const allMatchesAreNumeric = matches.every(match => {
      const queryToken = queryAnalysis.find(t => t.token === match.queryToken);
      const tagToken = tagAnalysis.find(t => t.token === match.tagToken);
      
      return (queryToken?.type === 'NUMERIC' || queryToken?.type === 'ROMAN') &&
             (tagToken?.type === 'NUMERIC' || tagToken?.type === 'ROMAN');
    });
    
    // Se todos os matches são numéricos E existem tokens não-numéricos na query que não foram encontrados
    const hasNonNumericQueryTokens = queryAnalysis.some(t => t.type !== 'NUMERIC' && t.type !== 'ROMAN');
    
    if (allMatchesAreNumeric && hasNonNumericQueryTokens) {
      rejectedByNumericOnlyRule = true;
    }
  }
  
  // Score final
  const finalScore = rejectedByNumericOnlyRule ? 0 : Math.max(0, rawScore + specialBonuses + descriptiveBoost);
  
  console.log(`🎯 [TOKEN-COMPAT] RESULTADO FINAL Tag "${tagName}":`, {
    compatibilityRatio: compatibilityRatio,
    rawScore: rawScore,
    specialBonuses: specialBonuses,
    descriptiveBoost: descriptiveBoost,
    finalScore: finalScore,
    tagOnlyHasDescriptive: tagOnlyHasDescriptive,
    foundTokens: foundTokens
  });
  
  return {
    queryTokens: queryAnalysis.map(t => t.token),
    tagTokens: tagAnalysis.map(t => t.token),
    matches,
    compatibilityRatio, // Este agora reflete a modificação da regra especial
    rawScore, // Score base com compatibilityRatio correto
    finalScore, // Score final com todos os ajustes
    rejectedByNumericOnlyRule,
    debug: {
      foundTokens,
      totalQueryTokens,
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
  
  // 🎮 REGRA ESPECIAL: Query só tem DESCRIPTIVE? Priorizar consoles!
  const isDescriptiveOnlyQuery = isOnlyDescriptiveQuery(query);
  if (isDescriptiveOnlyQuery) {
    console.log(`🎮 REGRA ESPECIAL ATIVADA: Query "${query}" contém apenas tokens DESCRIPTIVE - priorizando CONSOLES!`);
  }
  
  const results: Array<{
    product: any;
    totalScore: number;
    tagScores: Array<{
      tagName: string;
      tagWeight: number;
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
    let totalScore = totalTagScore + nameScore + categoryScore + exactBonus;
    
    // 🎮 REGRA ESPECIAL: Se query só tem DESCRIPTIVE E produto É UM CONSOLE, dar BOOST!
    let consoleBoost = 0;
    const hasTokenCompatibility = totalTagScore > 0; // só consoles com compatibilidade recebem boost
    if (isDescriptiveOnlyQuery && isConsoleProduct(product) && hasTokenCompatibility) {
      consoleBoost = 500; // Boost MASSIVO apenas para CONSOLES com match
      totalScore += consoleBoost;
      console.log(`🎮 CONSOLE BOOST APLICADO! +${consoleBoost} | Produto: "${product.name}" | categoria: ${product.category} | compat: ${hasTokenCompatibility}`);
    }
    
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
