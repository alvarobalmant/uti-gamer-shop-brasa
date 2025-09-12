import Fuse from 'fuse.js';

// Algoritmo de busca inteligente que separa resultados exatos de produtos relacionados
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
};

export const smartSearchProducts = (products: any[], query: string) => {
  if (!query.trim()) {
    // Filtrar produtos master mesmo quando não há query
    const filteredProducts = products.filter(product => product.product_type !== 'master');
    return { exactMatches: filteredProducts, relatedProducts: [] };
  }

  const normalizedQuery = normalizeText(query);

  // Configuração do Fuse.js
  const fuseOptions = {
    keys: [
      { name: 'name', weight: 2.0 }, // Nome do produto tem maior peso
      { name: 'description', weight: 0.5 },
      { name: 'platform', weight: 1.5 },
      { name: 'category', weight: 1.5 },
      { name: 'tags.name', weight: 3.0 }, // Tags têm o maior peso
    ],
    includeScore: true, // Incluir a pontuação de relevância
    threshold: 0.4, // Ajustar a sensibilidade da busca fuzzy (0.0 = correspondência exata, 1.0 = correspondência total)
    ignoreLocation: true, // Não considerar a posição da correspondência
    findAllMatches: true, // Encontrar todas as correspondências
  };

  const fuse = new Fuse(products.filter(p => p.product_type !== 'master'), fuseOptions);
  const fuseResults = fuse.search(normalizedQuery);

  const exactMatches: any[] = [];
  const relatedProducts: any[] = [];

  // Processar os resultados do Fuse.js
  fuseResults.forEach(result => {
    const product = result.item;
    const score = result.score || 0; // Score do Fuse.js (0 é correspondência perfeita, 1 é sem correspondência)

    // Quanto menor o score, mais exata a correspondência
    // Definir um limite para considerar como correspondência exata ou relacionada
    if (score < 0.2) { // Score baixo indica alta relevância
      exactMatches.push(product);
    } else if (score < 0.4) { // Score um pouco maior para relacionados
      relatedProducts.push(product);
    }
  });

  // Para garantir que a busca por tags seja priorizada, os pesos no fuseOptions já fazem isso.
  // Não há necessidade de preencher com produtos aleatórios, conforme solicitado.

  return { exactMatches, relatedProducts };
};

// Função para compatibilidade com o código existente
export const searchProducts = (products: any[], query: string) => {
  const { exactMatches } = smartSearchProducts(products, query);
  return exactMatches;
};

