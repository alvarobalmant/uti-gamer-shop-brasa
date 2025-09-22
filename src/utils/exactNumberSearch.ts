// Utilitário para busca com correspondência EXATA de números
// Soluciona o problema de números arábicos e romanos serem tratados como similares

/**
 * Extrai números arábicos de um texto
 */
export const extractArabicNumbers = (text: string): string[] => {
  const matches = text.match(/\b\d+\b/g);
  return matches || [];
};

/**
 * Extrai números romanos de um texto
 */
export const extractRomanNumbers = (text: string): string[] => {
  const matches = text.match(/\b(I{1,3}|IV|V|VI{0,3}|IX|X{1,3}|XL|L|LX{0,3}|XC|C{1,3}|CD|D|DC{0,3}|CM|M{1,3})\b/gi);
  return matches ? matches.map(m => m.toUpperCase()) : [];
};

/**
 * Verifica se dois arrays de números são idênticos
 */
export const arraysAreEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((item, index) => item === sorted2[index]);
};

/**
 * Calcula pontuação de relevância com correspondência EXATA de números
 */
export const calculateRelevanceWithExactNumbers = (
  searchQuery: string,
  productName: string,
  tags: Array<{ name: string }> = []
): number => {
  // Extrair números da busca
  const searchArabicNumbers = extractArabicNumbers(searchQuery);
  const searchRomanNumbers = extractRomanNumbers(searchQuery);
  
  // Criar texto combinado do produto (nome + tags)
  const productText = [productName, ...tags.map(tag => tag.name)].join(' ');
  
  // Extrair números do produto
  const productArabicNumbers = extractArabicNumbers(productText);
  const productRomanNumbers = extractRomanNumbers(productText);
  
  console.log('[ExactNumberSearch] Análise:', {
    query: searchQuery,
    product: productName,
    searchArabic: searchArabicNumbers,
    searchRoman: searchRomanNumbers,
    productArabic: productArabicNumbers,
    productRoman: productRomanNumbers
  });
  
  // Se a busca tem números, eles DEVEM corresponder EXATAMENTE
  if (searchArabicNumbers.length > 0 || searchRomanNumbers.length > 0) {
    const arabicMatch = arraysAreEqual(searchArabicNumbers, productArabicNumbers);
    const romanMatch = arraysAreEqual(searchRomanNumbers, productRomanNumbers);
    
    // Se há números na busca mas não há correspondência exata, pontuação muito baixa
    if (searchArabicNumbers.length > 0 && !arabicMatch) {
      console.log('[ExactNumberSearch] ❌ Números arábicos não correspondem');
      return 0.1; // Pontuação muito baixa
    }
    
    if (searchRomanNumbers.length > 0 && !romanMatch) {
      console.log('[ExactNumberSearch] ❌ Números romanos não correspondem');
      return 0.1; // Pontuação muito baixa
    }
    
    // Se os números correspondem exatamente, dar boost alto
    if (arabicMatch || romanMatch) {
      console.log('[ExactNumberSearch] ✅ Match exato de números - boost aplicado');
      return 100; // Pontuação alta para match exato
    }
  }
  
  // Se não há números ou todos correspondem, calcular pontuação normal baseada em texto
  const normalizedQuery = searchQuery.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizedProduct = productText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Pontuação baseada em inclusão de termos
  const queryTerms = normalizedQuery.split(' ').filter(term => term.length >= 2);
  let matchCount = 0;
  
  for (const term of queryTerms) {
    if (normalizedProduct.includes(term)) {
      matchCount++;
    }
  }
  
  const textScore = queryTerms.length > 0 ? (matchCount / queryTerms.length) * 50 : 0;
  
  console.log('[ExactNumberSearch] Pontuação final:', {
    product: productName,
    textScore,
    totalScore: textScore
  });
  
  return textScore;
};

/**
 * Filtra produtos baseado em correspondência EXATA de números
 */
export const filterProductsByExactNumbers = (
  searchQuery: string,
  products: Array<{ name: string; tags?: Array<{ name: string }> }>
): Array<{ product: any; score: number }> => {
  return products
    .map(product => ({
      product,
      score: calculateRelevanceWithExactNumbers(searchQuery, product.name, product.tags)
    }))
    .filter(item => item.score > 0.5) // Filtrar pontuações muito baixas
    .sort((a, b) => b.score - a.score); // Ordenar por relevância
};

/**
 * Preprocessa termos de busca preservando números EXATOS
 */
export const preprocessSearchTerms = (query: string): string[] => {
  const normalizedQuery = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Substitui pontuação por espaços
    .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
    .trim();
  
  const terms = normalizedQuery.split(' ').filter(term => term.length >= 1);
  
  // Preservar números exatamente como aparecem
  return terms.map(term => {
    // Se é número arábico, preservar
    if (/^\d+$/.test(term)) {
      return term;
    }
    // Se é número romano, preservar em maiúsculo
    if (/^(I{1,3}|IV|V|VI{0,3}|IX|X{1,3}|XL|L|LX{0,3}|XC|C{1,3}|CD|D|DC{0,3}|CM|M{1,3})$/i.test(term)) {
      return term.toUpperCase();
    }
    // Para texto normal, aplicar processamento padrão (mínimo 2 caracteres)
    return term.length >= 2 ? term : null;
  }).filter(Boolean) as string[];
};