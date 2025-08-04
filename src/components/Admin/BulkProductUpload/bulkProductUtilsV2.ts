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
    label: 'Especificações Básicas',
    instructions: 'JSON com especificações básicas. Ex: [{"name":"Processador","value":"AMD Ryzen Zen 2","category":"technical","icon":"⚙️","highlight":true}]',
    type: 'json',
    example: '[{"name":"Processador","value":"AMD Ryzen Zen 2","category":"technical","icon":"⚙️","highlight":true}]',
    width: 60
  },
  {
    key: 'technical_specs',
    label: 'Especificações Técnicas',
    instructions: 'JSON com specs técnicas detalhadas. Ex: {"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD"}',
    type: 'json',
    example: '{"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD"}',
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
      'specifications': '[{"name":"Processador","value":"AMD Ryzen Zen 2","category":"technical","icon":"⚙️","highlight":true}]',
      'technical_specs': '{"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD"}',
      'product_highlights': '["SSD ultra-rápido","Ray tracing","4K gaming"]',
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
      errors.push({
        row,
        field: 'price',
        message: 'Preço deve ser maior que 0',
        severity: 'error'
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
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    // 3. Processar variações
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
          throw new Error(`Produto mestre com SKU '${parentSku}' não encontrado. Certifique-se de que existe na planilha.`);
        }
      }
      
      const newProduct = await createProductInDatabase(productData);
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
      }
      
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