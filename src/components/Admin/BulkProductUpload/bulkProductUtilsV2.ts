import type { ImportedProduct, ValidationError, ImportResult, ProductTemplate, TemplateColumn } from './types';
import { supabase } from '@/integrations/supabase/client';

// Definição das colunas do template
const TEMPLATE_COLUMNS: TemplateColumn[] = [
  // === INFORMAÇÕES BÁSICAS ===
  {
    key: 'name',
    label: 'Nome do Produto *',
    instructions: 'Nome principal do produto. Campo obrigatório.',
    required: true,
    type: 'text',
    example: 'PlayStation 5 Digital Edition',
    width: 25
  },
  {
    key: 'description',
    label: 'Descrição Básica',
    instructions: 'Descrição curta do produto.',
    type: 'text',
    example: 'Console de videogame da nova geração',
    width: 30
  },
  {
    key: 'price',
    label: 'Preço *',
    instructions: 'Preço principal do produto (apenas números, sem R$)',
    required: true,
    type: 'number',
    example: 3999.99,
    width: 15
  },
  {
    key: 'stock',
    label: 'Estoque',
    instructions: 'Quantidade em estoque',
    type: 'number',
    example: 10,
    width: 10
  },
  {
    key: 'image',
    label: 'Imagem Principal',
    instructions: 'URL da imagem principal',
    type: 'text',
    example: 'https://exemplo.com/ps5.jpg',
    width: 30
  },
  
  // === SISTEMA SKU ===
  {
    key: 'is_master_product',
    label: 'É Produto Mestre?',
    instructions: 'TRUE para produto mestre (com variações), FALSE para produto simples',
    type: 'boolean',
    example: 'FALSE',
    width: 15
  },
  {
    key: 'parent_product_id',
    label: 'ID do Produto Pai',
    instructions: 'ID do produto mestre (apenas para variações). Use o sku_code do produto mestre.',
    type: 'text',
    example: 'PS5-MASTER',
    width: 20
  },
  {
    key: 'sku_code',
    label: 'Código SKU',
    instructions: 'Código único do produto/variação',
    type: 'text',
    example: 'PS5-DIGITAL',
    width: 15
  },
  {
    key: 'variant_attributes',
    label: 'Atributos da Variação',
    instructions: 'JSON com atributos da variação. Ex: {"color":"white","size":"standard","platform":"ps5"}',
    type: 'json',
    example: '{"color":"white","size":"standard"}',
    width: 35
  },
  
  // === PREÇOS ===
  {
    key: 'pro_price',
    label: 'Preço UTI Pro',
    instructions: 'Preço especial para membros UTI Pro',
    type: 'number',
    example: 3599.99,
    width: 15
  },
  {
    key: 'list_price',
    label: 'Preço de Lista',
    instructions: 'Preço original/sugerido (para mostrar desconto)',
    type: 'number',
    example: 4499.99,
    width: 15
  },
  
  // === MÍDIA ===
  {
    key: 'additional_images',
    label: 'Imagens Adicionais',
    instructions: 'URLs separadas por vírgula',
    type: 'array',
    example: 'https://img1.jpg,https://img2.jpg,https://img3.jpg',
    width: 40
  },
  
  // === ESPECIFICAÇÕES ===
  {
    key: 'specifications',
    label: 'Especificações Básicas (Mobile)',
    instructions: 'JSON com especificações básicas para visualização mobile. Ex: [{"name":"Processador","value":"AMD Ryzen Zen 2","category":"Informações Gerais","icon":"⚙️","highlight":true}]',
    type: 'json',
    example: '[{"name":"Processador","value":"AMD Ryzen Zen 2","category":"Informações Gerais","icon":"⚙️","highlight":true}]',
    width: 60
  },
  {
    key: 'technical_specs',
    label: 'Especificações Técnicas (Desktop)',
    instructions: 'JSON com specs técnicas detalhadas organizadas em 4 categorias: ⚙️ Especificações Técnicas, 🚀 Performance, 💾 Armazenamento, 🔌 Conectividade. Ex: {"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD","fps":"60 FPS","multiplayer":"Sim"}',
    type: 'json',
    example: '{"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD","fps":"60 FPS","multiplayer":"Sim"}',
    width: 50
  },
  
  // === DESTAQUES ===
  {
    key: 'product_highlights',
    label: 'Destaques do Produto',
    instructions: 'JSON com destaques. Ex: ["SSD ultra-rápido","Ray tracing","4K gaming","Compatibilidade PS4"]',
    type: 'json',
    example: '["SSD ultra-rápido","Ray tracing","4K gaming","Compatibilidade PS4"]',
    width: 40
  },
  
  // === ENTREGA ===
  {
    key: 'shipping_weight',
    label: 'Peso (kg)',
    instructions: 'Peso do produto em quilogramas',
    type: 'number',
    example: 4.2,
    width: 10
  },
  {
    key: 'free_shipping',
    label: 'Frete Grátis?',
    instructions: 'TRUE se tem frete grátis',
    type: 'boolean',
    example: 'TRUE',
    width: 12
  },
  
  // === EXIBIÇÃO ===
  {
    key: 'badge_text',
    label: 'Texto do Badge',
    instructions: 'Texto do badge promocional',
    type: 'text',
    example: 'NOVO',
    width: 15
  },
  {
    key: 'badge_color',
    label: 'Cor do Badge',
    instructions: 'Cor do badge (hex)',
    type: 'text',
    example: '#22c55e',
    width: 12
  },
  {
    key: 'badge_visible',
    label: 'Badge Visível?',
    instructions: 'TRUE se o badge deve aparecer',
    type: 'boolean',
    example: 'TRUE',
    width: 12
  },
  
  // === SEO ===
  {
    key: 'meta_title',
    label: 'Título SEO',
    instructions: 'Título para SEO/motores de busca',
    type: 'text',
    example: 'PlayStation 5 Digital - Console Next-Gen | Loja UTI Games',
    width: 40
  },
  {
    key: 'meta_description',
    label: 'Descrição SEO',
    instructions: 'Descrição para SEO/motores de busca',
    type: 'text',
    example: 'Compre o PlayStation 5 Digital Edition com os melhores preços. Tecnologia revolucionária, jogos incríveis. Frete grátis!',
    width: 50
  },
  {
    key: 'slug',
    label: 'Slug da URL',
    instructions: 'Slug para URL (sem espaços, só letras minúsculas e hífens)',
    type: 'text',
    example: 'playstation-5-digital-edition',
    width: 30
  },
  
  // === CATEGORIZAÇÃO ===
  {
    key: 'brand',
    label: 'Marca',
    instructions: 'Marca do produto',
    type: 'text',
    example: 'Sony',
    width: 15
  },
  {
    key: 'category',
    label: 'Categoria',
    instructions: 'Categoria do produto',
    type: 'text',
    example: 'Console',
    width: 15
  },
  {
    key: 'platform',
    label: 'Plataforma',
    instructions: 'Plataforma do produto (Xbox, PlayStation, PC, etc.)',
    type: 'text',
    example: 'PlayStation 5',
    width: 20
  },
  {
    key: 'tags',
    label: 'Tags',
    instructions: 'Nomes das tags separados por vírgula',
    type: 'array',
    example: 'console,playstation,next-gen,4k',
    width: 30
  },
  
  // === STATUS ===
  {
    key: 'is_active',
    label: 'Produto Ativo?',
    instructions: 'TRUE se o produto deve ficar ativo',
    type: 'boolean',
    example: 'TRUE',
    width: 12
  },
  {
    key: 'is_featured',
    label: 'Produto Destaque?',
    instructions: 'TRUE se é produto em destaque',
    type: 'boolean',
    example: 'FALSE',
    width: 15
  }
];

export async function generateImportTutorial(): Promise<string> {
  try {
    // Buscar produtos mestres existentes
    const { data: masterProducts, error: mastersError } = await supabase
      .from('products')
      .select('sku_code, name')
      .eq('product_type', 'master')
      .eq('is_active', true)
      .order('name');
    
    if (mastersError) throw mastersError;

    // Buscar tags existentes
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('name')
      .order('name');
    
    if (tagsError) throw tagsError;

    // Buscar plataformas únicas dos produtos
    const { data: platforms, error: platformsError } = await supabase
      .from('products')
      .select('platform')
      .not('platform', 'is', null)
      .not('platform', 'eq', '');
    
    if (platformsError) throw platformsError;

    const uniquePlatforms = [...new Set(platforms?.map(p => p.platform).filter(Boolean))].sort();

    const tutorial = `# TUTORIAL DE IMPORTAÇÃO EM MASSA DE PRODUTOS
Atualizado automaticamente em: ${new Date().toLocaleString('pt-BR')}

## 🚀 INTRODUÇÃO
Este sistema permite importar múltiplos produtos de forma eficiente usando planilhas Excel.
Você pode criar produtos simples, produtos com variações (sistema SKU) ou adicionar variações a produtos mestres existentes.

## 📋 TIPOS DE PRODUTOS SUPORTADOS

### 1. PRODUTO SIMPLES
- Produto independente sem variações
- Configure: is_master_product = FALSE
- Deixe parent_product_id vazio
- Exemplo: Cabo HDMI, Mouse Gamer, etc.

### 2. PRODUTO MESTRE + VARIAÇÕES
- Produto principal com múltiplas versões
- Primeiro: Crie o mestre (is_master_product = TRUE)
- Depois: Crie as variações (parent_product_id = SKU do mestre)
- Exemplo: Camiseta (M, G, GG) ou Console (Digital, Físico)

### 3. ADICIONAR VARIAÇÃO A PRODUTO EXISTENTE
- Use o SKU de um produto mestre já existente no site
- Configure parent_product_id com o SKU do mestre
- Veja lista de produtos mestres disponíveis abaixo

## 🏷️ PRODUTOS MESTRES DISPONÍVEIS NO SITE
${masterProducts && masterProducts.length > 0 
  ? masterProducts.map(p => `- ${p.sku_code} | ${p.name}`).join('\n')
  : 'Nenhum produto mestre encontrado no site.'
}

## 🏷️ TAGS DISPONÍVEIS NO SITE
Use essas tags existentes para evitar duplicatas:
${tags && tags.length > 0 
  ? tags.map(t => `- ${t.name}`).join('\n')
  : 'Nenhuma tag encontrada no site.'
}

## 🎮 PLATAFORMAS DISPONÍVEIS NO SITE
Use essas plataformas existentes:
${uniquePlatforms.length > 0 
  ? uniquePlatforms.map(p => `- ${p}`).join('\n')
  : 'Nenhuma plataforma encontrada no site.'
}

## 📊 CAMPOS OBRIGATÓRIOS
- **name**: Nome do produto (sempre obrigatório)
- **price**: Preço do produto (sempre obrigatório)

## 📊 CAMPOS IMPORTANTES

### Sistema SKU (Para produtos com variações)
- **is_master_product**: TRUE para produto mestre, FALSE para variação
- **parent_product_id**: SKU do produto mestre (só para variações)
- **sku_code**: Código único do produto/variação
- **variant_attributes**: JSON com atributos da variação

### Preços
- **price**: Preço principal (obrigatório)
- **pro_price**: Preço para membros UTI Pro
- **list_price**: Preço original (para mostrar desconto)

### Categorização
- **brand**: Marca do produto
- **category**: Categoria do produto
- **platform**: Plataforma (veja lista acima)
- **tags**: Tags separadas por vírgula (veja lista acima)

### SEO
- **meta_title**: Título para busca no Google
- **meta_description**: Descrição para busca no Google
- **slug**: URL amigável (será gerada automaticamente se vazia)

## 💡 EXEMPLOS PRÁTICOS

### Exemplo 1: Produto Simples
\`\`\`
name: Mouse Gamer RGB
description: Mouse gamer com iluminação RGB
price: 199.99
stock: 50
brand: Logitech
category: Periféricos
platform: PC
tags: mouse,gamer,rgb
specifications: [{"label":"DPI","value":"25600","icon":"","highlight":true}]
technical_specs: {"dpi":"25600","buttons":"11","weight":"85g","connectivity":"USB-A"}
meta_title: Mouse Gamer RGB Logitech - Alta Performance | UTI Games
meta_description: Mouse gamer Logitech com 25600 DPI e iluminação RGB. Ideal para jogos competitivos.
is_master_product: FALSE
is_active: TRUE
\`\`\`

### Exemplo 2: Produto Mestre + Variações
**Linha 1 - Produto Mestre:**
\`\`\`
name: Camiseta UTI Games
description: Camiseta oficial da UTI Games
price: 0
stock: 0
is_master_product: TRUE
sku_code: CAMISA-UTI-MASTER
brand: UTI Games
category: Vestuário
tags: camiseta,oficial
specifications: [{"label":"Material","value":"100% Algodão","icon":"","highlight":false}]
meta_title: Camiseta UTI Games Oficial - Vestuário Gamer | UTI Games
meta_description: Camiseta oficial UTI Games 100% algodão. Disponível em vários tamanhos.
is_active: TRUE
\`\`\`

**Linha 2 - Variação M:**
\`\`\`
name: Camiseta UTI Games - Tamanho M
description: Camiseta oficial da UTI Games tamanho M
price: 59.99
stock: 20
is_master_product: FALSE
parent_product_id: CAMISA-UTI-MASTER
sku_code: CAMISA-UTI-M
variant_attributes: {"size":"M","color":"preto"}
specifications: [{"label":"Tamanho","value":"M (Médio)","icon":"","highlight":true}]
meta_title: Camiseta UTI Games Tamanho M - Vestuário Gamer | UTI Games
meta_description: Camiseta oficial UTI Games tamanho M, 100% algodão. Ideal para gamers.
is_active: TRUE
\`\`\`

**Linha 3 - Variação G:**
\`\`\`
name: Camiseta UTI Games - Tamanho G
description: Camiseta oficial da UTI Games tamanho G
price: 59.99
stock: 15
is_master_product: FALSE
parent_product_id: CAMISA-UTI-MASTER
sku_code: CAMISA-UTI-G
variant_attributes: {"size":"G","color":"preto"}
specifications: [{"label":"Tamanho","value":"G (Grande)","icon":"","highlight":true}]
meta_title: Camiseta UTI Games Tamanho G - Vestuário Gamer | UTI Games
meta_description: Camiseta oficial UTI Games tamanho G, 100% algodão. Ideal para gamers.
is_active: TRUE
\`\`\`

### Exemplo 3: Adicionar Variação a Produto Existente
Se você tem um produto mestre "CP2077-ULTIMATE-MASTER" no site:
\`\`\`
name: Cyberpunk 2077 Ultimate - Edição Xbox
description: Versão Ultimate para Xbox Series X
price: 299.99
stock: 10
is_master_product: FALSE
parent_product_id: CP2077-ULTIMATE-MASTER
sku_code: CP2077-ULTIMATE-XBOX
variant_attributes: {"platform":"Xbox Series X","edition":"Ultimate"}
specifications: [{"label":"Plataforma","value":"Xbox Series X","icon":"","highlight":true}]
technical_specs: {"platform":"Xbox Series X","resolution":"4K","fps":"60","storage":"70GB"}
meta_title: Cyberpunk 2077 Ultimate Xbox Series X - Jogo RPG | UTI Games
meta_description: Cyberpunk 2077 Ultimate Edition para Xbox Series X. Versão completa com todas as DLCs.
is_active: TRUE
\`\`\`

## 🔧 CAMPOS JSON

### specifications (Especificações Básicas - SOMENTE Mobile View)
**IMPORTANTE**: Este campo é usado APENAS na visualização MOBILE do produto.
Array de especificações básicas simples. Todas sempre aparecem na categoria "Informações Gerais".

**Regras importantes:**
- ✅ IMPORTANTE: Use "label" ao invés de "name" no campo specifications
- ✅ Use apenas emojis simples (1-2 caracteres) no campo "icon", ou deixe vazio
- ✅ O campo "category" é ignorado - sempre será "Informações Gerais"
- ✅ Use para informações simples e resumidas
- ❌ NÃO coloque especificações técnicas detalhadas aqui

\`\`\`json
[
  {
    "label": "Tipo", 
    "value": "Console Next-Gen",
    "icon": "",
    "highlight": true
  },
  {
    "label": "Garantia",
    "value": "1 ano", 
    "icon": "",
    "highlight": false
  },
  {
    "label": "Cor",
    "value": "Branco",
    "icon": "",
    "highlight": false
  }
]
\`\`\`

### technical_specs (Especificações Técnicas - SOMENTE Desktop View)
**IMPORTANTE**: Este campo é usado APENAS na visualização DESKTOP do produto.
Objeto com especificações técnicas detalhadas, organizadas automaticamente em 4 categorias:

**🏷️ As 4 categorias automáticas do Desktop:**
- **⚙️ Especificações Técnicas**: Hardware e sistema (cpu, gpu, ram, platform, etc.)
- **🚀 Performance**: Desempenho e gráficos (fps, resolution, framerate, etc.)
- **💾 Armazenamento**: Espaço e instalação (storage, size, ssd, hdd, etc.)
- **🔌 Conectividade**: Multiplayer e rede (multiplayer, online, wifi, bluetooth, etc.)

**Regras importantes:**
- ✅ Use nomes de campos técnicos em inglês ou português
- ✅ O sistema detecta automaticamente a categoria pela palavra-chave
- ✅ Use para especificações técnicas detalhadas
- ❌ NÃO misture com especificações básicas

\`\`\`json
{
  "cpu": "AMD Zen 2 8-Core 3.8GHz",
  "gpu": "RDNA 2 Custom 12 TFLOPS", 
  "ram": "16GB GDDR6",
  "platform": "Xbox Series X",
  "storage": "1TB SSD NVMe",
  "fps": "Até 120 FPS",
  "resolution": "4K Ultra HD (2160p)",
  "multiplayer": "Até 4 jogadores online",
  "wifi": "Wi-Fi 6 (802.11ax)",
  "bluetooth": "Bluetooth 5.1"
}
\`\`\`

### product_highlights (Destaques)
\`\`\`json
["SSD ultra-rápido", "Ray tracing", "4K gaming", "Compatibilidade PS4"]
\`\`\`

### variant_attributes (Atributos da Variação)
\`\`\`json
{
  "color": "white",
  "size": "standard",
  "platform": "PlayStation 5",
  "edition": "Digital"
}
\`\`\`

## ⚠️ DICAS IMPORTANTES

1. **SKUs Únicos**: Cada SKU deve ser único em toda a planilha e no site
2. **Produto Mestre**: Sempre defina price=0 e stock=0 para produtos mestres
3. **Variações**: Sempre defina price e stock reais para variações
4. **URLs de Imagem**: Use URLs válidas e acessíveis
5. **Slugs**: Serão gerados automaticamente baseados no nome se não fornecidos
6. **Campos Booleanos**: Use TRUE/FALSE (maiúsculo)
7. **Arrays**: Separe itens por vírgula (ex: tag1,tag2,tag3)
8. **JSON**: Use formato JSON válido para campos estruturados

## 🚨 VALIDAÇÕES AUTOMÁTICAS

O sistema verificará:
- ✅ Campos obrigatórios preenchidos
- ✅ SKUs únicos
- ✅ Slugs únicos
- ✅ URLs válidas
- ✅ JSON válido nos campos estruturados
- ✅ Consistência entre produtos mestres e variações
- ⚠️ Produtos mestres inexistentes (aviso, não erro)

## 📞 SUPORTE

Em caso de dúvidas ou erros na importação:
1. Verifique se seguiu os exemplos corretamente
2. Valide o formato JSON dos campos estruturados
3. Certifique-se de que os SKUs são únicos
4. Verifique se os produtos mestres existem (veja lista acima)

Última atualização: ${new Date().toLocaleString('pt-BR')}
`;

    return tutorial;
  } catch (error) {
    console.error('Erro ao gerar tutorial:', error);
    return `# TUTORIAL DE IMPORTAÇÃO EM MASSA DE PRODUTOS

Erro ao carregar dados dinâmicos. Verifique sua conexão e tente novamente.

Data: ${new Date().toLocaleString('pt-BR')}
`;
  }
}

export function generateProductTemplate(): ProductTemplate {
  const templateData = [{}];
  
  const instructions = [
    {
      'Seção': 'INFORMAÇÕES BÁSICAS',
      'Descrição': 'Campos essenciais para qualquer produto',
      'Campos Obrigatórios': 'name, price',
      'Observações': 'Nome e preço são sempre obrigatórios'
    },
    {
      'Seção': 'SISTEMA SKU - PRODUTOS COM VARIAÇÕES',
      'Descrição': 'Sistema para criar produtos com múltiplas versões',
      'Como usar': '1) Criar linha com is_master_product=TRUE e sku_code único. 2) Criar linhas filhas com parent_product_id=sku_code do mestre',
      'Observações': 'Produto mestre: price=0, stock=0. Variações: price e stock reais'
    },
    {
      'Seção': 'PREÇOS',
      'Descrição': 'Diferentes tipos de preço do produto',
      'Campos Obrigatórios': 'price',
      'Observações': 'pro_price para membros UTI Pro, list_price para mostrar desconto'
    },
    {
      'Seção': 'ESPECIFICAÇÕES',
      'Descrição': 'Características técnicas do produto',
      'Observações': 'Use JSON para estruturar especificações'
    },
    {
      'Seção': 'SEO',
      'Descrição': 'Otimização para motores de busca',
      'Observações': 'meta_title e meta_description melhoram posicionamento'
    }
  ];
  
  const examples = [
    {
      'Tipo': 'PRODUTO SIMPLES',
      'name': 'PlayStation 5 Digital Edition',
      'description': 'Console de videogame da nova geração',
      'price': 3999.99,
      'stock': 10,
      'image': 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/FkzwjnJknkrFlozkTdeQBMub.png',
      'is_master_product': false,
      'sku_code': 'PS5-DIGITAL',
      'specifications': '[{"name":"Processador","value":"AMD Ryzen Zen 2","category":"Informações Gerais","icon":"⚙️","highlight":true},{"name":"Memória","value":"16GB GDDR6","category":"Informações Gerais","icon":"🧠","highlight":true}]',
      'technical_specs': '{"cpu":"AMD Zen 2 8-Core","gpu":"RDNA 2 Custom","ram":"16GB GDDR6","storage":"825GB SSD NVMe","fps":"60 FPS","resolution":"4K Ultra HD","multiplayer":"Até 4 jogadores online","wifi":"Wi-Fi 6 (802.11ax)"}',
      'product_highlights': '["SSD ultra-rápido","Ray tracing","4K gaming","Compatibilidade PS4"]',
      'meta_title': 'PlayStation 5 Digital Edition - Console Next-Gen | UTI Games',
      'meta_description': 'Compre o PlayStation 5 Digital Edition com os melhores preços. Tecnologia revolucionária, jogos incríveis. Frete grátis!',
      'slug': 'playstation-5-digital-edition',
      'brand': 'Sony',
      'category': 'Console',
      'platform': 'PlayStation 5',
      'tags': 'console,playstation,next-gen,4k',
      'is_active': true,
      'is_featured': true
    }
  ];
  
  return {
    columns: TEMPLATE_COLUMNS,
    data: templateData,
    instructions,
    examples
  };
}

export function validateProductData(products: ImportedProduct[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const usedSKUs = new Set<string>();
  const usedSlugs = new Set<string>();
  const parentProductIds = new Set<string>();

  // Coletar todos os parent_product_ids mencionados na planilha
  products.forEach(product => {
    if (product.parent_product_id) {
      parentProductIds.add(String(product.parent_product_id).trim());
    }
  });

  // Coletar todos os SKU codes que serão produtos mestres
  const masterSKUs = new Set<string>();
  products.forEach(product => {
    if (parseBooleanField(product.is_master_product) && product.sku_code) {
      masterSKUs.add(String(product.sku_code).trim());
    }
  });

  products.forEach((product, index) => {
    const row = product._rowIndex || index + 2;

    // Validações obrigatórias
    if (!product.name || String(product.name).trim() === '') {
      errors.push({
        row,
        field: 'name',
        message: 'Nome do produto é obrigatório',
        severity: 'error'
      });
    }

    if (!product.price || Number(product.price) <= 0) {
      // Para produtos mestres, permitir preço 0
      if (!parseBooleanField(product.is_master_product)) {
        errors.push({
          row,
          field: 'price',
          message: 'Preço deve ser maior que 0 para produtos normais',
          severity: 'error'
        });
      }
    }

    // Avisos SEO (não obrigatórios, mas recomendados)
    if (!product.meta_title || String(product.meta_title).trim() === '') {
      errors.push({
        row,
        field: 'meta_title',
        message: 'Título SEO recomendado para melhor posicionamento',
        severity: 'warning'
      });
    }

    if (!product.meta_description || String(product.meta_description).trim() === '') {
      errors.push({
        row,
        field: 'meta_description',
        message: 'Descrição SEO recomendada para melhor posicionamento',
        severity: 'warning'
      });
    }

    // Validação de SKU único
    if (product.sku_code) {
      const skuCode = String(product.sku_code).trim();
      if (usedSKUs.has(skuCode)) {
        errors.push({
          row,
          field: 'sku_code',
          message: `SKU '${skuCode}' duplicado na planilha`,
          severity: 'error'
        });
      } else {
        usedSKUs.add(skuCode);
      }
    }

    // Validação de Slug único
    if (product.slug) {
      const slug = String(product.slug).trim();
      if (usedSlugs.has(slug)) {
        errors.push({
          row,
          field: 'slug',
          message: `Slug '${slug}' duplicado na planilha`,
          severity: 'error'
        });
      } else {
        usedSlugs.add(slug);
      }
    }

    // Validação de produto mestre/variação
    if (parseBooleanField(product.is_master_product)) {
      if (product.parent_product_id) {
        errors.push({
          row,
          field: 'parent_product_id',
          message: 'Produto mestre não pode ter produto pai',
          severity: 'error'
        });
      }
      if (!product.sku_code) {
        errors.push({
          row,
          field: 'sku_code',
          message: 'Produto mestre deve ter SKU code',
          severity: 'error'
        });
      }
    }

    if (product.parent_product_id && parseBooleanField(product.is_master_product)) {
      errors.push({
        row,
        field: 'is_master_product',
        message: 'Produto não pode ser mestre e ter produto pai ao mesmo tempo',
        severity: 'error'
      });
    }

    // Validação de parent_product_id - deve existir na planilha ou no banco
    if (product.parent_product_id && !parseBooleanField(product.is_master_product)) {
      const parentId = String(product.parent_product_id).trim();
      if (!masterSKUs.has(parentId)) {
        errors.push({
          row,
          field: 'parent_product_id',
          message: `Produto mestre com SKU '${parentId}' não encontrado na planilha. Certifique-se de que existe na planilha ou no site.`,
          severity: 'warning'
        });
      }
    }

    // Validações de JSON
    const jsonFields = [
      'variant_attributes', 'specifications', 'technical_specs',
      'product_highlights'
    ];

    jsonFields.forEach(field => {
      const value = (product as any)[field];
      if (value && !isValidJSON(value)) {
        errors.push({
          row,
          field,
          message: `Campo '${field}' deve ser um JSON válido`,
          severity: 'error'
        });
      }
    });

    // Validações de URLs
    if (product.image && !isValidURL(product.image)) {
      errors.push({
        row,
        field: 'image',
        message: 'URL da imagem inválida',
        severity: 'warning'
      });
    }
  });

  return errors;
}

export async function processProductImport(
  products: ImportedProduct[], 
  onProgress: (progress: number) => void
): Promise<ImportResult> {
  let created = 0;
  let updated = 0;
  
  try {
    console.log('[IMPORT] Iniciando importação de', products.length, 'produtos');

    // Validar SKUs únicos no banco
    const allSkuCodes = products
      .filter(p => p.sku_code)
      .map(p => String(p.sku_code).trim());
    
    if (allSkuCodes.length > 0) {
      const { data: existingSKUs, error } = await supabase
        .from('products')
        .select('sku_code')
        .in('sku_code', allSkuCodes);
        
      if (error) {
        throw new Error(`Erro ao verificar SKUs existentes: ${error.message}`);
      }
      
      if (existingSKUs && existingSKUs.length > 0) {
        const duplicatedSKUs = existingSKUs.map(s => s.sku_code).join(', ');
        throw new Error(`SKUs já existem no banco: ${duplicatedSKUs}`);
      }
    }
    
    // Separar produtos por tipo
    const masterProducts = products.filter(p => parseBooleanField(p.is_master_product));
    const variations = products.filter(p => !parseBooleanField(p.is_master_product) && p.parent_product_id);
    const simpleProducts = products.filter(p => !parseBooleanField(p.is_master_product) && !p.parent_product_id);
    
    const total = products.length;
    let processed = 0;
    
    // Mapear SKU codes para IDs reais
    const masterProductMap = new Map<string, string>();
    
    console.log(`[IMPORT] ${masterProducts.length} mestres, ${variations.length} variações, ${simpleProducts.length} simples`);
    
    // 1. Processar produtos mestres
    for (const product of masterProducts) {
      console.log(`[IMPORT] Criando produto mestre: ${product.name}`);
      const productData = convertImportedProductToDatabase(product);
      const newProduct = await createProductInDatabase(productData);
      
      if (product.sku_code) {
        masterProductMap.set(String(product.sku_code).trim(), newProduct.id);
        console.log(`[IMPORT] Mapeado SKU ${product.sku_code} -> ${newProduct.id}`);
      }
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
      }
      
      // Processar especificações
      await processProductSpecifications(newProduct.id, product);
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    // 2. Processar produtos simples
    for (const product of simpleProducts) {
      console.log(`[IMPORT] Criando produto simples: ${product.name}`);
      const productData = convertImportedProductToDatabase(product);
      const newProduct = await createProductInDatabase(productData);
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
      }
      
      // Processar especificações
      await processProductSpecifications(newProduct.id, product);
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    // 3. Buscar produtos mestres existentes no banco para os parent_product_ids
    const missingParentIds = Array.from(new Set(
      variations
        .map(p => String(p.parent_product_id).trim())
        .filter(id => !masterProductMap.has(id))
    ));
    
    if (missingParentIds.length > 0) {
      const { data: existingMasters, error } = await supabase
        .from('products')
        .select('id, sku_code')
        .eq('product_type', 'master')
        .in('sku_code', missingParentIds);
        
      if (error) {
        throw new Error(`Erro ao buscar produtos mestres existentes: ${error.message}`);
      }
      
      // Mapear produtos mestres existentes
      existingMasters?.forEach(master => {
        if (master.sku_code) {
          masterProductMap.set(master.sku_code, master.id);
          console.log(`[IMPORT] Encontrado mestre existente: ${master.sku_code} -> ${master.id}`);
        }
      });
    }

    // 4. Processar variações
    for (const product of variations) {
      console.log(`[IMPORT] Criando variação: ${product.name} (parent: ${product.parent_product_id})`);
      const productData = convertImportedProductToDatabase(product);
      
      // Mapear parent_product_id
      if (product.parent_product_id) {
        const parentSku = String(product.parent_product_id).trim();
        if (masterProductMap.has(parentSku)) {
          const realParentId = masterProductMap.get(parentSku);
          productData.parent_product_id = realParentId;
          console.log(`[IMPORT] Mapeando parent ${parentSku} -> ${realParentId}`);
        } else {
          throw new Error(`Produto mestre com SKU '${parentSku}' não encontrado na planilha nem no banco de dados.`);
        }
      }
      
      const newProduct = await createProductInDatabase(productData);
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
      }
      
      // Processar especificações
      await processProductSpecifications(newProduct.id, product);
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    console.log('[IMPORT] Importação concluída com sucesso');
    return {
      success: true,
      created,
      updated
    };
  } catch (error) {
    console.error('[IMPORT] Erro na importação:', error);
    return {
      success: false,
      created,
      updated,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

function convertImportedProductToDatabase(product: ImportedProduct): any {
  const isMasterProduct = parseBooleanField(product.is_master_product);
  const hasParentProduct = Boolean(product.parent_product_id);
  
  // Determinar product_type
  let productType: 'simple' | 'master' | 'sku' = 'simple';
  if (isMasterProduct) {
    productType = 'master';
  } else if (hasParentProduct) {
    productType = 'sku';
  }

  return {
    name: String(product.name || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    image: String(product.image || '').trim(),
    additional_images: parseArrayField(product.additional_images),
    
    // Sistema SKU
    product_type: productType,
    is_master_product: isMasterProduct,
    parent_product_id: null, // Será definido depois no caso de variações
    sku_code: product.sku_code ? String(product.sku_code).trim() : null,
    variant_attributes: parseJsonField(product.variant_attributes) || {},
    sort_order: Number(product.sort_order) || 0,
    
    // Preços
    pro_price: product.pro_price ? Number(product.pro_price) : null,
    list_price: product.list_price ? Number(product.list_price) : null,
    
    // Especificações
    specifications: parseJsonField(product.specifications) || [],
    technical_specs: parseJsonField(product.technical_specs) || {},
    
    // Conteúdo
    product_highlights: parseJsonField(product.product_highlights) || [],
    
    // Entrega
    shipping_weight: product.shipping_weight ? Number(product.shipping_weight) : null,
    free_shipping: parseBooleanField(product.free_shipping),
    
    // Display
    badge_text: String(product.badge_text || '').trim(),
    badge_color: String(product.badge_color || '#22c55e').trim(),
    badge_visible: parseBooleanField(product.badge_visible),
    
    // SEO
    meta_title: String(product.meta_title || '').trim(),
    meta_description: String(product.meta_description || '').trim(),
    slug: product.slug ? String(product.slug).trim() : generateSlug(String(product.name || '')),
    
    // Categorização
    brand: String(product.brand || '').trim(),
    category: String(product.category || '').trim(),
    platform: String(product.platform || '').trim(),
    
    // Status
    is_active: product.is_active !== undefined ? parseBooleanField(product.is_active) : true,
    is_featured: parseBooleanField(product.is_featured),
    
    // Campos padrão
    sizes: [],
    colors: []
  };
}

// Funções auxiliares
function parseBooleanField(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    return normalized === 'true' || normalized === '1' || normalized === 'sim';
  }
  return false;
}

function parseJsonField(value: any): any {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

function parseArrayField(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return String(value).split(',').map(s => s.trim()).filter(Boolean);
}

function isValidJSON(value: any): boolean {
  if (!value) return true;
  try {
    JSON.parse(String(value));
    return true;
  } catch {
    return false;
  }
}

function isValidURL(value: any): boolean {
  if (!value) return true;
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function createProductInDatabase(productData: any): Promise<any> {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
    
  if (error) {
    console.error('[DB] Erro ao criar produto:', error);
    throw error;
  }
  return data;
}

async function createProductTags(productId: string, tagNames: string[]): Promise<void> {
  if (!tagNames.length) return;
  
  for (const tagName of tagNames) {
    // Buscar ou criar tag
    let { data: tag, error } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Tag não existe, criar
      const { data: newTag, error: createError } = await supabase
        .from('tags')
        .insert([{ name: tagName }])
        .select('id')
        .single();
      
      if (createError) throw createError;
      tag = newTag;
    } else if (error) {
      throw error;
    }
    
    // Associar tag ao produto
    const { error: linkError } = await supabase
      .from('product_tags')
      .insert([{ product_id: productId, tag_id: tag.id }]);
    
    if (linkError && linkError.code !== '23505') { // Ignorar duplicatas
      throw linkError;
    }
  }
}

// Função para processar especificações técnicas do produto importado
async function processProductSpecifications(productId: string, product: ImportedProduct): Promise<void> {
  if (!productId) return;
  
  try {
    const specifications = parseJsonField(product.specifications);
    const technicalSpecs = parseJsonField(product.technical_specs);
    
    const specsToInsert: any[] = [];
    let orderIndex = 1;
    
// Processar especificações básicas (para mobile)
    if (specifications && Array.isArray(specifications)) {
      specifications.forEach((spec: any) => {
        // Aceitar tanto 'name' quanto 'label' como nome da especificação
        const specName = spec.name || spec.label;
        if (specName && spec.value) {
          // Filtrar ícones inválidos (apenas emojis únicos ou null)
          let cleanIcon = null;
          if (spec.icon && typeof spec.icon === 'string') {
            const trimmedIcon = spec.icon.trim();
            // Aceitar apenas emojis únicos (1-2 caracteres) ou ícones válidos
            if (trimmedIcon.length <= 2 && !/^[a-zA-Z0-9-_]+$/.test(trimmedIcon)) {
              cleanIcon = trimmedIcon;
            }
          }
          
          specsToInsert.push({
            product_id: productId,
            category: 'Informações Gerais', // Sempre usar esta categoria para mobile
            label: specName,
            value: String(spec.value),
            highlight: Boolean(spec.highlight || false),
            icon: cleanIcon,
            order_index: orderIndex++
          });
        }
      });
    }
    
    // Processar especificações técnicas detalhadas (formato objeto)
    if (technicalSpecs && typeof technicalSpecs === 'object') {
      Object.entries(technicalSpecs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Determinar categoria e ícone com base na chave
          const { category, icon } = getCategoryAndIconFromKey(key);
          
          // Formatar o nome da especificação
          const formattedLabel = formatSpecificationLabel(key);
          
          specsToInsert.push({
            product_id: productId,
            category: category,
            label: formattedLabel,
            value: String(value),
            highlight: isHighlightField(key),
            icon: icon,
            order_index: orderIndex++
          });
        }
      });
    }
    
    // Inserir todas as especificações no banco
    if (specsToInsert.length > 0) {
      const { error } = await supabase
        .from('product_specifications')
        .insert(specsToInsert);
      
      if (error) {
        console.error('Erro ao inserir especificações:', error);
      } else {
        console.log(`[IMPORT] ${specsToInsert.length} especificações adicionadas para produto ${productId}`);
      }
    }
    
  } catch (error) {
    console.error('Erro ao processar especificações do produto:', error);
  }
}

// Função para determinar categoria e ícone baseado na chave
function getCategoryAndIconFromKey(key: string): { category: string; icon: string | null } {
  const lowerKey = key.toLowerCase();
  
  // Mapeamento para as 4 categorias principais (Desktop)
  const categoryMap: Record<string, { category: string; icon: string }> = {
    // ⚙️ Especificações Técnicas - Hardware e Sistema
    'cpu': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'processor': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'processador': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'gpu': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'graphics': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'placa_video': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'ram': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'memory': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'memoria': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'sistema': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'system': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'os': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'platform': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    'plataforma': { category: '⚙️ Especificações Técnicas', icon: '⚙️' },
    
    // 🚀 Performance - Desempenho e Gráficos
    'performance': { category: '🚀 Performance', icon: '🚀' },
    'resolution': { category: '🚀 Performance', icon: '🚀' },
    'fps': { category: '🚀 Performance', icon: '🚀' },
    'resolução': { category: '🚀 Performance', icon: '🚀' },
    'framerate': { category: '🚀 Performance', icon: '🚀' },
    'graphics_quality': { category: '🚀 Performance', icon: '🚀' },
    'qualidade_graficos': { category: '🚀 Performance', icon: '🚀' },
    'optimization': { category: '🚀 Performance', icon: '🚀' },
    'otimização': { category: '🚀 Performance', icon: '🚀' },
    
    // 💾 Armazenamento - Espaço e Instalação
    'storage': { category: '💾 Armazenamento', icon: '💾' },
    'armazenamento': { category: '💾 Armazenamento', icon: '💾' },
    'disco': { category: '💾 Armazenamento', icon: '💾' },
    'ssd': { category: '💾 Armazenamento', icon: '💾' },
    'hdd': { category: '💾 Armazenamento', icon: '💾' },
    'size': { category: '💾 Armazenamento', icon: '💾' },
    'tamanho': { category: '💾 Armazenamento', icon: '💾' },
    'installation': { category: '💾 Armazenamento', icon: '💾' },
    'instalação': { category: '💾 Armazenamento', icon: '💾' },
    'download': { category: '💾 Armazenamento', icon: '💾' },
    'space': { category: '💾 Armazenamento', icon: '💾' },
    'espaço': { category: '💾 Armazenamento', icon: '💾' },
    
    // 🔌 Conectividade - Multiplayer e Rede
    'multiplayer': { category: '🔌 Conectividade', icon: '🔌' },
    'online': { category: '🔌 Conectividade', icon: '🔌' },
    'network': { category: '🔌 Conectividade', icon: '🔌' },
    'wifi': { category: '🔌 Conectividade', icon: '🔌' },
    'bluetooth': { category: '🔌 Conectividade', icon: '🔌' },
    'internet': { category: '🔌 Conectividade', icon: '🔌' },
    'connection': { category: '🔌 Conectividade', icon: '🔌' },
    'conexão': { category: '🔌 Conectividade', icon: '🔌' },
    'cooperative': { category: '🔌 Conectividade', icon: '🔌' },
    'cooperativo': { category: '🔌 Conectividade', icon: '🔌' },
    'crossplay': { category: '🔌 Conectividade', icon: '🔌' },
    'cloud': { category: '🔌 Conectividade', icon: '🔌' },
    'nuvem': { category: '🔌 Conectividade', icon: '🔌' }
  };
  
  // Buscar correspondência exata
  if (categoryMap[lowerKey]) {
    return categoryMap[lowerKey];
  }
  
  // Buscar correspondência parcial
  for (const [mapKey, value] of Object.entries(categoryMap)) {
    if (lowerKey.includes(mapKey) || mapKey.includes(lowerKey)) {
      return value;
    }
  }
  
  // Padrão: primeira categoria
  return { category: '⚙️ Especificações Técnicas', icon: '⚙️' };
}

// Função para formatar label de especificação
function formatSpecificationLabel(key: string): string {
  const labelMap: Record<string, string> = {
    'cpu': 'Processador',
    'gpu': 'Placa de Vídeo',
    'ram': 'Memória RAM',
    'storage': 'Armazenamento',
    'resolution': 'Resolução',
    'fps': 'Taxa de Quadros',
    'audio': 'Áudio',
    'video': 'Vídeo',
    'multiplayer': 'Multijogador',
    'online': 'Online',
    'wifi': 'Wi-Fi',
    'bluetooth': 'Bluetooth',
    'performance': 'Performance'
  };
  
  const lowerKey = key.toLowerCase();
  if (labelMap[lowerKey]) {
    return labelMap[lowerKey];
  }
  
  // Capitalizar primeira letra e substituir _ por espaço
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

// Função para determinar se o campo deve ser destacado
function isHighlightField(key: string): boolean {
  const highlightFields = ['cpu', 'gpu', 'ram', 'storage', 'resolution', 'fps'];
  return highlightFields.includes(key.toLowerCase());
}