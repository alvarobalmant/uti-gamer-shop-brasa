import { KnownProductData } from './types';
import { knownProductsDatabase } from './knownProductsDatabase';

export interface ClassificationGuide {
  type: 'known' | 'uti_original' | 'doubtful';
  title: string;
  description: string;
  criteria: string[];
  examples: string[];
  warningFlags: string[];
  bestPractices: string[];
}

export const classificationGuides: ClassificationGuide[] = [
  {
    type: 'known',
    title: 'Produtos Conhecidos (Known Products)',
    description: 'Produtos amplamente reconhecidos no mercado com especificações padronizadas.',
    criteria: [
      'Marca reconhecida mundialmente (Sony, Microsoft, Nintendo, Apple, etc.)',
      'Produto com especificações técnicas bem documentadas',
      'Disponível em múltiplas lojas e plataformas',
      'Possui reviews e avaliações em sites especializados',
      'Tem presença oficial nas redes sociais da marca'
    ],
    examples: [
      'PlayStation 5 - Console Sony com especificações conhecidas',
      'iPhone 15 - Smartphone Apple com documentação oficial',
      'FIFA 24 - Jogo EA Sports disponível em múltiplas plataformas',
      'Logitech G502 - Mouse gaming com especificações padronizadas'
    ],
    warningFlags: [
      'Evite classificar como "conhecido" produtos com nomes muito genéricos',
      'Não confie apenas no nome da marca - verifique se o modelo específico existe',
      'Cuidado com variações regionais que podem ter especificações diferentes'
    ],
    bestPractices: [
      'Consulte o site oficial da marca para confirmar especificações',
      'Verifique se o produto está listado em nosso banco de produtos conhecidos',
      'Use variações e aliases para facilitar a identificação automática',
      'Mantenha especificações técnicas consistentes com padrões da indústria'
    ]
  },
  {
    type: 'uti_original',
    title: 'Produtos UTI Originais',
    description: 'Produtos exclusivos, personalizados ou com diferencial único da UTI DOS GAMES.',
    criteria: [
      'Produtos customizados ou modificados pela UTI DOS GAMES',
      'Bundles e kits exclusivos criados pela loja',
      'Produtos com garantia ou serviços adicionais únicos',
      'Itens vintage ou raros com curadoria especial',
      'Produtos com branding ou personalização da UTI DOS GAMES'
    ],
    examples: [
      'Kit Gamer UTI Pro - Bundle exclusivo com mouse, teclado e headset',
      'PlayStation 4 Restaurado UTI - Console recondicionado com garantia estendida',
      'Coleção Retro Curada - Seleção especial de jogos clássicos',
      'Pacote Streaming UTI - Kit completo para streamers com configuração personalizada'
    ],
    warningFlags: [
      'Não confunda com produtos de terceiros que apenas revendemos',
      'Certifique-se de que há valor agregado real pela UTI DOS GAMES',
      'Evite usar esta categoria para produtos comuns apenas por conveniência'
    ],
    bestPractices: [
      'Documente claramente o diferencial UTI nos campos de descrição',
      'Inclua informações sobre garantias ou serviços adicionais',
      'Use fotos que mostrem o branding ou personalização UTI',
      'Mantenha rastreabilidade dos componentes originais em bundles'
    ]
  },
  {
    type: 'doubtful',
    title: 'Produtos Duvidosos (Doubtful)',
    description: 'Produtos que requerem verificação adicional antes da publicação.',
    criteria: [
      'Informações incompletas ou inconsistentes',
      'Marcas desconhecidas ou não verificadas',
      'Preços muito abaixo ou acima do mercado sem justificativa',
      'Especificações técnicas questionáveis ou impossíveis',
      'Produtos sem documentação adequada do fornecedor'
    ],
    examples: [
      'Console "GenericBox Pro" - Marca não reconhecida com especificações vagas',
      'Mouse Gaming 50000 DPI - Especificação tecnicamente implausível',
      'iPhone 15 por R$ 500 - Preço suspeito para produto novo',
      'Produto sem marca definida ou com nome muito genérico'
    ],
    warningFlags: [
      'NUNCA publique produtos duvidosos sem verificação manual',
      'Produtos com especificações impossíveis são automaticamente duvidosos',
      'Preços muito discrepantes precisam de justificativa clara'
    ],
    bestPractices: [
      'Solicite documentação adicional do fornecedor',
      'Pesquise a marca e modelo em fontes confiáveis',
      'Compare preços com concorrentes para detectar anomalias',
      'Quando em dúvida, sempre classifique como "doubtful" para revisão manual'
    ]
  }
];

export const categorySpecificGuidelines = {
  consoles: {
    title: 'Consoles de Videogame',
    knownIndicators: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Steam Deck'],
    keySpecs: ['Resolução', 'Armazenamento', 'Ray Tracing', 'Retrocompatibilidade'],
    commonVariants: ['Standard', 'Pro', 'Slim', 'Digital Edition', 'OLED']
  },
  games: {
    title: 'Jogos',
    knownIndicators: ['EA Sports', 'Activision', 'Ubisoft', 'CD Projekt Red'],
    keySpecs: ['Gênero', 'Plataformas', 'Classificação Etária', 'Multiplayer'],
    commonVariants: ['Standard', 'Deluxe', 'Ultimate', 'GOTY Edition']
  },
  peripherals: {
    title: 'Periféricos',
    knownIndicators: ['Logitech', 'Razer', 'SteelSeries', 'Corsair'],
    keySpecs: ['DPI', 'Conectividade', 'RGB', 'Tipo de Switch'],
    commonVariants: ['Wireless', 'Wired', 'Pro', 'Lite']
  },
  collectibles: {
    title: 'Colecionáveis',
    knownIndicators: ['Funko Pop', 'Nendoroid', 'figma', 'Hot Toys'],
    keySpecs: ['Tamanho', 'Material', 'Edição Limitada', 'Licença Oficial'],
    commonVariants: ['Regular', 'Chase', 'Exclusive', 'Limited Edition']
  }
};

export function generateClassificationTutorial(): string {
  const tutorial = `
# 📋 TUTORIAL: CLASSIFICAÇÃO MANUAL DE PRODUTOS

## 🎯 VISÃO GERAL
Este tutorial orienta como classificar produtos manualmente no template Excel para importação em lote. A classificação correta é essencial para o processamento automático e qualidade do catálogo.

## 📊 TIPOS DE CLASSIFICAÇÃO

${classificationGuides.map(guide => `
### ${guide.title}
**Descrição:** ${guide.description}

**Critérios de Identificação:**
${guide.criteria.map(criterion => `• ${criterion}`).join('\n')}

**Exemplos Práticos:**
${guide.examples.map(example => `• ${example}`).join('\n')}

**⚠️ Alertas Importantes:**
${guide.warningFlags.map(flag => `• ${flag}`).join('\n')}

**✅ Melhores Práticas:**
${guide.bestPractices.map(practice => `• ${practice}`).join('\n')}
`).join('\n')}

## 🗂️ DIRETRIZES POR CATEGORIA

${Object.entries(categorySpecificGuidelines).map(([key, category]) => `
### ${category.title}
**Marcas Conhecidas:** ${category.knownIndicators.join(', ')}
**Especificações Chave:** ${category.keySpecs.join(', ')}
**Variantes Comuns:** ${category.commonVariants.join(', ')}
`).join('')}

## 📝 COMO PREENCHER NO EXCEL

### Coluna "Tipo de Produto" (Classification Type)
Preencha com um dos valores exatos:
- **known** - Para produtos conhecidos
- **uti_original** - Para produtos UTI originais
- **doubtful** - Para produtos que precisam verificação

### Campos Obrigatórios por Tipo:

**Para produtos "known":**
- Nome completo e preciso do produto
- Marca oficial
- Modelo/versão específica
- Especificações técnicas padronizadas

**Para produtos "uti_original":**
- Descrição clara do diferencial UTI
- Componentes inclusos no bundle/kit
- Informações sobre garantias adicionais
- Fotos mostrando personalização UTI

**Para produtos "doubtful":**
- Máximo de informações disponíveis
- Observações sobre inconsistências encontradas
- Fontes de verificação consultadas

## 🔍 PROCESSO DE VERIFICAÇÃO

### Antes de Classificar:
1. **Pesquise a marca** em sites oficiais
2. **Compare especificações** com fontes confiáveis
3. **Verifique preços** em múltiplas lojas
4. **Confirme disponibilidade** no mercado

### Durante a Classificação:
1. **Seja conservador** - na dúvida, use "doubtful"
2. **Documente fontes** nas observações
3. **Mantenha consistência** com produtos similares
4. **Use nomenclatura oficial** sempre que possível

### Após a Classificação:
1. **Revise produtos duvidosos** antes da importação
2. **Verifique duplicatas** por nome/modelo
3. **Confirme categorização** está adequada
4. **Teste importação** com pequenos lotes primeiro

## 🚨 SINAIS DE ALERTA CRÍTICOS

**Classifique SEMPRE como "doubtful" se:**
- Marca completamente desconhecida
- Especificações tecnicamente impossíveis
- Preços 50%+ abaixo do mercado sem justificativa
- Informações contraditórias entre campos
- Produto sem documentação do fornecedor

## ✅ CHECKLIST FINAL

Antes de importar, verifique:
- [ ] Todos os produtos têm classificação definida
- [ ] Produtos "known" têm especificações completas
- [ ] Produtos "uti_original" têm diferencial documentado
- [ ] Produtos "doubtful" foram revisados manualmente
- [ ] Nomenclatura está consistente e oficial
- [ ] Preços estão dentro da faixa esperada
- [ ] Categorias estão adequadamente atribuídas

## 🔗 PRODUTOS CONHECIDOS EM NOSSA BASE

Atualmente temos ${knownProductsDatabase.length} produtos conhecidos cadastrados:

${knownProductsDatabase.slice(0, 10).map(product => 
  `• **${product.name}** (${product.brand}) - ${product.category}`
).join('\n')}

${knownProductsDatabase.length > 10 ? `\n... e mais ${knownProductsDatabase.length - 10} produtos.` : ''}

---

⚠️ **LEMBRE-SE:** A classificação correta economiza tempo no processamento e garante qualidade no catálogo. Na dúvida, sempre opte por uma verificação manual adicional.
`;

  return tutorial;
}

export function getClassificationRecommendation(productName: string, brand: string): {
  suggestedType: 'known' | 'uti_original' | 'doubtful';
  confidence: number;
  reasoning: string[];
} {
  const name = productName.toLowerCase();
  const brandLower = brand.toLowerCase();

  // Check if it's in our known products database
  const knownProduct = knownProductsDatabase.find(known => 
    known.aliases.some(alias => name.includes(alias.toLowerCase())) ||
    name.includes(known.name.toLowerCase())
  );

  if (knownProduct) {
    return {
      suggestedType: 'known',
      confidence: 0.9,
      reasoning: [
        `Produto encontrado na base de conhecidos: ${knownProduct.name}`,
        `Marca reconhecida: ${knownProduct.brand}`,
        `Categoria: ${knownProduct.category}`
      ]
    };
  }

  // Check for UTI original indicators
  const utiIndicators = ['uti', 'kit', 'bundle', 'personalizado', 'customizado', 'exclusivo'];
  const hasUtiIndicator = utiIndicators.some(indicator => 
    name.includes(indicator) || brandLower.includes(indicator)
  );

  if (hasUtiIndicator) {
    return {
      suggestedType: 'uti_original',
      confidence: 0.7,
      reasoning: [
        'Produto contém indicadores de produto UTI original',
        'Pode ser bundle ou produto personalizado'
      ]
    };
  }

  // Check for known brands
  const knownBrands = ['sony', 'microsoft', 'nintendo', 'apple', 'samsung', 'logitech', 'razer'];
  const hasKnownBrand = knownBrands.some(knownBrand => 
    brandLower.includes(knownBrand)
  );

  if (hasKnownBrand) {
    return {
      suggestedType: 'known',
      confidence: 0.6,
      reasoning: [
        `Marca reconhecida: ${brand}`,
        'Produto provavelmente conhecido, verificar especificações'
      ]
    };
  }

  // Default to doubtful for unknown products
  return {
    suggestedType: 'doubtful',
    confidence: 0.5,
    reasoning: [
      'Produto não encontrado na base de conhecidos',
      'Marca não reconhecida automaticamente',
      'Recomenda-se verificação manual'
    ]
  };
}