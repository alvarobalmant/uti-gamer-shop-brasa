import { normalizeText } from './smartSearch';

// Tipos de tokens identificados
export type TokenType = 'NUMERIC' | 'ROMAN' | 'MAIN' | 'DESCRIPTIVE' | 'CONNECTOR';

// Padrões de tags identificados
export type TagPattern = 'MAIN_NUMERIC' | 'MAIN_ROMAN' | 'MULTI_MAIN' | 'DESCRIPTIVE_HEAVY' | 'SIMPLE';

// Informação detalhada de cada token
export interface TokenInfo {
  token: string;           // Token original
  normalized: string;      // Token normalizado
  type: TokenType;         // Classificação do token
  position: number;        // Posição na tag (0-based)
  importance: number;      // Peso de importância (0-1)
  confidence: number;      // Confiança da classificação (0-1)
}

// Análise completa da tag
export interface TagAnalysis {
  originalTag: string;     // Tag original
  tokens: TokenInfo[];     // Array de tokens analisados
  pattern: TagPattern;     // Padrão identificado
  indicators: string[];    // Indicadores visuais
  summary: {
    hasNumbers: boolean;
    hasRomans: boolean;
    hasMainWords: boolean;
    hasDescriptive: boolean;
    dominantType: TokenType;
    complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
  };
}

// Dicionários de referência
const ROMAN_NUMERALS: Record<string, number> = {
  'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
  'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10,
  'xi': 11, 'xii': 12, 'xiii': 13, 'xiv': 14, 'xv': 15,
  'xvi': 16, 'xvii': 17, 'xviii': 18, 'xix': 19, 'xx': 20
};

const CONNECTOR_BRASILEIRO = [
  // Preposições essenciais
  'a', 'ante', 'apos', 'ate', 'com', 'contra', 'de', 'desde', 
  'em', 'entre', 'para', 'per', 'perante', 'por', 'sem', 
  'sob', 'sobre', 'tras',
  
  // Preposições acidentais
  'afora', 'como', 'conforme', 'consoante', 'durante', 'exceto', 
  'mediante', 'menos', 'salvo', 'segundo', 'visto',
  
  // Artigos
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  
  // Contrações e combinações
  'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  'ao', 'aos', 'dum', 'duma', 'num', 'numa', 'dele', 'dela',
  'nele', 'nela', 'deste', 'desta', 'neste', 'nesta',
  'pra', 'pro', 'pras', 'pros',
  
  // Conjunções básicas
  'e', 'nem', 'mas', 'ou', 'que', 'se', 'quando', 'onde',
  
  // Inglês (para jogos não traduzidos)
  'of', 'the', 'and', 'in', 'on', 'at', 'with', 'for',
  'to', 'from', 'by', '&'
];

const DESCRIPTIVE_BRASILEIRO = [
  // Edições (PT + EN)
  'ultimate', 'deluxe', 'gold', 'premium', 'especial', 'limitada',
  'colecionador', 'colecionadores', 'aniversario', 'lendaria',
  'special', 'limited', 'collector', 'collectors', 'anniversary', 'legendary',
  
  // Versões (PT + EN)
  'completa', 'definitiva', 'melhorada', 'remasterizada',
  'complete', 'definitive', 'enhanced', 'remastered', 'remake',
  'redux', 'directors', 'extended', 'goty',
  
  // Coleções (PT + EN)
  'colecao', 'pacote', 'conjunto', 'compilacao', 'trilogia',
  'collection', 'bundle', 'pack', 'set', 'compilation', 'trilogy',
  
  // Qualificadores (PT + EN)
  'edicao', 'versao', 'lancamento', 'corte',
  'edition', 'version', 'release', 'cut', 'mix',
  
  // Plataformas
  'playstation', 'ps1', 'ps2', 'ps3', 'ps4', 'ps5',
  'xbox', 'x360', 'xone', 'nintendo', 'switch', 'pc', 'steam',
  
  // Gêneros
  'acao', 'aventura', 'tiro', 'luta', 'corrida', 'esporte',
  'action', 'adventure', 'shooter', 'fighting', 'racing', 'sports',
  
  // Qualificadores gerais
  'jogo', 'game', 'titulo', 'demo', 'beta', 'alpha',
  'nova', 'novo', 'next', 'gen', 'geracao', 'generation'
];

// Função para normalizar texto removendo acentos
function normalizeForClassification(text: string): string {
  return text.toLowerCase()
    .replace(/[áàâãä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .trim();
}

// Classificar um token individual
export function classifyToken(token: string, position: number, totalTokens: number): TokenInfo {
  const normalized = normalizeForClassification(token);
  
  // 1. NUMERIC: Números arábicos
  if (/^\d+$/.test(normalized)) {
    return {
      token,
      normalized,
      type: 'NUMERIC',
      position,
      importance: 0.9, // Alta importância
      confidence: 1.0
    };
  }
  
  // 2. ROMAN: Números romanos
  if (ROMAN_NUMERALS[normalized]) {
    return {
      token,
      normalized,
      type: 'ROMAN',
      position,
      importance: 0.9, // Alta importância
      confidence: 1.0
    };
  }
  
  // 3. CONNECTOR: Palavras de ligação
  if (CONNECTOR_BRASILEIRO.includes(normalized)) {
    return {
      token,
      normalized,
      type: 'CONNECTOR',
      position,
      importance: 0.1, // Baixíssima importância
      confidence: 1.0
    };
  }
  
  // 4. DESCRIPTIVE: Palavras descritivas
  if (DESCRIPTIVE_BRASILEIRO.includes(normalized)) {
    return {
      token,
      normalized,
      type: 'DESCRIPTIVE',
      position,
      importance: 0.3, // Baixa importância
      confidence: 0.9
    };
  }
  
  // 5. MAIN: Palavra principal (default)
  return {
    token,
    normalized,
    type: 'MAIN',
    position,
    importance: 1.0, // Máxima importância
    confidence: 0.8 // Confiança moderada
  };
}

// Identificar padrão da tag
function identifyPattern(tokens: TokenInfo[]): TagPattern {
  const types = tokens.map(t => t.type);
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<TokenType, number>);
  
  // MAIN_NUMERIC: Tem palavras principais + números
  if (typeCounts.MAIN && typeCounts.NUMERIC) {
    return 'MAIN_NUMERIC';
  }
  
  // MAIN_ROMAN: Tem palavras principais + números romanos
  if (typeCounts.MAIN && typeCounts.ROMAN) {
    return 'MAIN_ROMAN';
  }
  
  // MULTI_MAIN: Múltiplas palavras principais
  if ((typeCounts.MAIN || 0) >= 2) {
    return 'MULTI_MAIN';
  }
  
  // DESCRIPTIVE_HEAVY: Muitas palavras descritivas
  if ((typeCounts.DESCRIPTIVE || 0) >= 2) {
    return 'DESCRIPTIVE_HEAVY';
  }
  
  return 'SIMPLE';
}

// Gerar indicadores visuais
function generateIndicators(analysis: TagAnalysis): string[] {
  const indicators: string[] = [];
  const { tokens, summary } = analysis;
  
  // Indicador principal de composição
  const types = tokens.map(t => getTypeIcon(t.type)).join(' + ');
  indicators.push(`🏷️ ${types}`);
  
  // Indicador de padrão
  indicators.push(`📋 Padrão: ${analysis.pattern}`);
  
  // Indicadores específicos por tipo
  if (summary.hasNumbers) {
    const numbers = tokens.filter(t => t.type === 'NUMERIC').map(t => t.token);
    indicators.push(`🔢 Números: [${numbers.join(', ')}]`);
  }
  
  if (summary.hasRomans) {
    const romans = tokens.filter(t => t.type === 'ROMAN').map(t => t.token);
    indicators.push(`🏛️ Romanos: [${romans.join(', ')}]`);
  }
  
  if (summary.hasMainWords) {
    const mains = tokens.filter(t => t.type === 'MAIN').map(t => t.token);
    indicators.push(`🎯 Principais: [${mains.join(', ')}]`);
  }
  
  if (summary.hasDescriptive) {
    const descriptives = tokens.filter(t => t.type === 'DESCRIPTIVE').map(t => t.token);
    indicators.push(`✨ Descritivos: [${descriptives.join(', ')}]`);
  }
  
  // Indicador de complexidade
  indicators.push(`⚡ Complexidade: ${summary.complexity}`);
  
  return indicators;
}

// Obter ícone do tipo de token
export function getTypeIcon(type: TokenType): string {
  switch (type) {
    case 'NUMERIC': return '🔢';
    case 'ROMAN': return '🏛️';
    case 'MAIN': return '🎯';
    case 'DESCRIPTIVE': return '✨';
    case 'CONNECTOR': return '🔗';
    default: return '❓';
  }
}

// Obter cor CSS para o tipo de token
export function getTokenColor(type: TokenType): string {
  switch (type) {
    case 'NUMERIC': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ROMAN': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'MAIN': return 'bg-green-100 text-green-800 border-green-200';
    case 'DESCRIPTIVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CONNECTOR': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Função principal para analisar uma tag
export function analyzeTag(tagName: string): TagAnalysis {
  // Tokenizar
  const rawTokens = normalizeText(tagName)
    .split(/\s+/)
    .filter(token => token.length >= 1);
  
  // Classificar cada token
  const tokens = rawTokens.map((token, index) => 
    classifyToken(token, index, rawTokens.length)
  );
  
  // Identificar padrão
  const pattern = identifyPattern(tokens);
  
  // Criar resumo
  const summary = {
    hasNumbers: tokens.some(t => t.type === 'NUMERIC'),
    hasRomans: tokens.some(t => t.type === 'ROMAN'),
    hasMainWords: tokens.some(t => t.type === 'MAIN'),
    hasDescriptive: tokens.some(t => t.type === 'DESCRIPTIVE'),
    dominantType: getDominantType(tokens),
    complexity: getComplexity(tokens)
  };
  
  // Criar análise completa
  const analysis: TagAnalysis = {
    originalTag: tagName,
    tokens,
    pattern,
    indicators: [],
    summary
  };
  
  // Gerar indicadores
  analysis.indicators = generateIndicators(analysis);
  
  return analysis;
}

// Obter tipo dominante
function getDominantType(tokens: TokenInfo[]): TokenType {
  const typeCounts = tokens.reduce((acc, token) => {
    acc[token.type] = (acc[token.type] || 0) + 1;
    return acc;
  }, {} as Record<TokenType, number>);
  
  let maxCount = 0;
  let dominantType: TokenType = 'MAIN';
  
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantType = type as TokenType;
    }
  }
  
  return dominantType;
}

// Calcular complexidade
function getComplexity(tokens: TokenInfo[]): 'SIMPLE' | 'MODERATE' | 'COMPLEX' {
  const uniqueTypes = new Set(tokens.map(t => t.type)).size;
  const totalTokens = tokens.length;
  
  if (totalTokens <= 2 && uniqueTypes <= 2) {
    return 'SIMPLE';
  } else if (totalTokens <= 4 && uniqueTypes <= 3) {
    return 'MODERATE';
  } else {
    return 'COMPLEX';
  }
}
