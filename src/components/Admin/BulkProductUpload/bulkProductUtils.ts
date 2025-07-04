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
  {
    key: 'master_slug',
    label: 'Slug do Produto Mestre',
    instructions: 'Slug do produto mestre (para variações)',
    type: 'text',
    example: 'playstation-5',
    width: 20
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
  {
    key: 'uti_pro_enabled',
    label: 'UTI Pro Habilitado?',
    instructions: 'TRUE se tem desconto UTI Pro',
    type: 'boolean',
    example: 'TRUE',
    width: 15
  },
  {
    key: 'uti_pro_value',
    label: 'Valor Desconto UTI Pro',
    instructions: 'Valor ou percentual de desconto UTI Pro',
    type: 'number',
    example: 10,
    width: 15
  },
  {
    key: 'uti_pro_type',
    label: 'Tipo Desconto UTI Pro',
    instructions: 'percentage ou fixed',
    type: 'text',
    example: 'percentage',
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
  {
    key: 'product_videos',
    label: 'Vídeos do Produto',
    instructions: 'JSON com vídeos. Ex: [{"url":"https://youtube.com/watch?v=abc","title":"Review","type":"youtube"}]',
    type: 'json',
    example: '[{"url":"https://youtube.com/watch?v=abc","title":"Review","type":"youtube"}]',
    width: 50
  },
  
  // === DESCRIÇÕES DETALHADAS ===
  {
    key: 'product_descriptions',
    label: 'Descrições Detalhadas',
    instructions: 'JSON com descrições. Ex: {"short":"Desc curta","detailed":"Desc detalhada","technical":"Specs técnicas","marketing":"Texto marketing"}',
    type: 'json',
    example: '{"short":"Console next-gen","detailed":"PlayStation 5 com tecnologia revolucionária...","technical":"CPU AMD Zen 2...","marketing":"Experimente a nova era dos jogos!"}',
    width: 60
  },
  
  // === ESPECIFICAÇÕES ===
  {
    key: 'specifications',
    label: 'Especificações',
    instructions: 'JSON com especificações. Ex: [{"name":"Processador","value":"AMD Ryzen Zen 2"},{"name":"Memória","value":"16GB GDDR6"}]',
    type: 'json',
    example: '[{"name":"Processador","value":"AMD Ryzen Zen 2"},{"name":"Memória","value":"16GB GDDR6"}]',
    width: 50
  },
  {
    key: 'technical_specs',
    label: 'Especificações Técnicas',
    instructions: 'JSON com specs técnicas detalhadas. Ex: {"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD"}',
    type: 'json',
    example: '{"cpu":"AMD Zen 2","gpu":"RDNA 2","ram":"16GB","storage":"825GB SSD"}',
    width: 50
  },
  {
    key: 'product_features',
    label: 'Características do Produto',
    instructions: 'JSON com características. Ex: {"raytracing":true,"4k":true,"backwards_compatible":true}',
    type: 'json',
    example: '{"raytracing":true,"4k":true,"backwards_compatible":true}',
    width: 40
  },
  
  // === FAQ ===
  {
    key: 'product_faqs',
    label: 'Perguntas Frequentes',
    instructions: 'JSON com FAQs. Ex: [{"question":"É compatível com jogos PS4?","answer":"Sim, a maioria dos jogos PS4 funciona no PS5"}]',
    type: 'json',
    example: '[{"question":"É compatível com jogos PS4?","answer":"Sim, a maioria dos jogos PS4 funciona no PS5"}]',
    width: 60
  },
  {
    key: 'product_highlights',
    label: 'Destaques do Produto',
    instructions: 'JSON com destaques. Ex: ["SSD ultra-rápido","Ray tracing","4K gaming","Compatibilidade PS4"]',
    type: 'json',
    example: '["SSD ultra-rápido","Ray tracing","4K gaming","Compatibilidade PS4"]',
    width: 40
  },
  
  // === REVIEWS ===
  {
    key: 'reviews_config',
    label: 'Configuração de Reviews',
    instructions: 'JSON com config de reviews. Ex: {"enabled":true,"show_rating":true,"custom_rating":{"value":4.8,"count":1250,"use_custom":true}}',
    type: 'json',
    example: '{"enabled":true,"show_rating":true,"custom_rating":{"value":4.8,"count":1250,"use_custom":true}}',
    width: 50
  },
  
  // === TRUST INDICATORS ===
  {
    key: 'trust_indicators',
    label: 'Indicadores de Confiança',
    instructions: 'JSON com indicadores. Ex: [{"icon":"shield","text":"Garantia 2 anos"},{"icon":"truck","text":"Frete grátis"}]',
    type: 'json',
    example: '[{"icon":"shield","text":"Garantia 2 anos"},{"icon":"truck","text":"Frete grátis"}]',
    width: 50
  },
  
  // === ENTREGA ===
  {
    key: 'delivery_config',
    label: 'Configuração de Entrega',
    instructions: 'JSON com config de entrega. Ex: {"custom_shipping_time":"2-3 dias úteis","express_available":true,"shipping_notes":"Produto frágil"}',
    type: 'json',
    example: '{"custom_shipping_time":"2-3 dias úteis","express_available":true,"shipping_notes":"Produto frágil"}',
    width: 50
  },
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
    key: 'display_config',
    label: 'Configuração de Exibição',
    instructions: 'JSON com config de display. Ex: {"show_stock_counter":true,"show_urgency_banner":true,"urgency_text":"Últimas unidades!"}',
    type: 'json',
    example: '{"show_stock_counter":true,"show_urgency_banner":true,"urgency_text":"Últimas unidades!"}',
    width: 50
  },
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
  
  // === NAVEGAÇÃO ===
  {
    key: 'breadcrumb_config',
    label: 'Configuração de Breadcrumb',
    instructions: 'JSON com config de breadcrumb. Ex: {"custom_path":[{"label":"Consoles","url":"/consoles"}],"use_custom":true}',
    type: 'json',
    example: '{"custom_path":[{"label":"Consoles","url":"/consoles"},{"label":"PlayStation","url":"/playstation"}],"use_custom":true}',
    width: 50
  },
  
  // === CATEGORIZAÇÃO ===
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
  // Dados vazios para o template (uma linha de exemplo)
  const templateData = [{}];
  
  // Instruções detalhadas
  const instructions = [
    {
      'Seção': 'INFORMAÇÕES BÁSICAS',
      'Descrição': 'Campos essenciais para qualquer produto',
      'Campos Obrigatórios': 'name, price',
      'Observações': 'Nome e preço são sempre obrigatórios'
    },
    {
      'Seção': 'SISTEMA SKU - PRODUTOS COM VARIAÇÕES',
      'Descrição': 'Sistema para criar produtos com múltiplas versões (PC, Xbox, PlayStation, etc)',
      'Exemplo': 'Resident Evil Village: 1 produto mestre + 3 SKUs (PC, Xbox, PS5)',
      'Como usar': '1) Criar linha com is_master_product=TRUE e sku_code único. 2) Criar linhas filhas com parent_product_id=sku_code do mestre',
      'Campos Obrigatórios': 'sku_code sempre, parent_product_id para variações',
      'Observações': 'Produto mestre: price=0, stock=0. Variações: price e stock reais'
    },
    {
      'Seção': 'PREÇOS',
      'Descrição': 'Diferentes tipos de preço do produto',
      'Campos Obrigatórios': 'price',
      'Observações': 'pro_price para membros UTI Pro, list_price para mostrar desconto'
    },
    {
      'Seção': 'MÍDIA',
      'Descrição': 'Imagens e vídeos do produto',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'URLs separadas por vírgula para imagens adicionais'
    },
    {
      'Seção': 'DESCRIÇÕES',
      'Descrição': 'Textos descritivos do produto',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'Use JSON para descrições estruturadas'
    },
    {
      'Seção': 'ESPECIFICAÇÕES',
      'Descrição': 'Características técnicas do produto',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'Use JSON para listas de especificações'
    },
    {
      'Seção': 'CONTEÚDO EXTRA',
      'Descrição': 'FAQ, highlights, reviews',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'Use JSON para estruturar perguntas e respostas'
    },
    {
      'Seção': 'ENTREGA',
      'Descrição': 'Informações de frete e entrega',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'shipping_weight em kg, free_shipping como TRUE/FALSE'
    },
    {
      'Seção': 'SEO',
      'Descrição': 'Otimização para motores de busca',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'meta_title e meta_description melhoram posicionamento'
    },
    {
      'Seção': 'STATUS',
      'Descrição': 'Estado do produto no site',
      'Campos Obrigatórios': 'Nenhum',
      'Observações': 'is_active=FALSE para deixar produto invisível'
    }
  ];
  
  // Exemplos práticos - RESIDENT EVIL VILLAGE COMPLETO
  const examples = [
    {
      'Tipo': 'PRODUTO MESTRE - Resident Evil Village',
      'name': 'Resident Evil Village',
      'description': 'Jogo de terror e sobrevivência da Capcom',
      'price': 0,
      'stock': 0,
      'image': 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/FkzwjnJknkrFlozkTdeQBMub.png',
      'is_master_product': true,
      'sku_code': 'RE-VILLAGE-MASTER',
      'master_slug': 'resident-evil-village',
      'variant_attributes': '{"platforms":["pc","xbox","playstation"],"editions":["standard","deluxe"]}',
      'product_descriptions': '{"short":"Terror e sobrevivência em primeira pessoa","detailed":"Anos após os trágicos eventos de Resident Evil 7 biohazard, Ethan Winters se mudou com sua esposa Mia para começar uma nova vida livre do passado, mas isso não durará muito.","technical":"Engine RE Engine, suporte 4K, Ray Tracing","marketing":"O terror retorna em alta definição!"}',
      'specifications': '[{"name":"Gênero","value":"Terror/Sobrevivência"},{"name":"Desenvolvedor","value":"Capcom"},{"name":"Classificação","value":"18 anos"}]',
      'product_highlights': '["Gráficos em 4K","Ray Tracing","Modo VR disponível","História imersiva"]',
      'tags': 'resident evil,terror,capcom,sobrevivencia,ethan',
      'is_active': true,
      'is_featured': true
    },
    {
      'Tipo': 'SKU PC - Resident Evil Village',
      'name': 'Resident Evil Village - PC Steam',
      'description': 'Versão para PC via Steam com gráficos otimizados',
      'price': 199.99,
      'stock': 25,
      'image': 'https://cdn.akamai.steamstatic.com/steam/apps/1196590/header.jpg',
      'additional_images': 'https://cdn.akamai.steamstatic.com/steam/apps/1196590/ss_1.jpg,https://cdn.akamai.steamstatic.com/steam/apps/1196590/ss_2.jpg',
      'is_master_product': false,
      'parent_product_id': 'RE-VILLAGE-MASTER',
      'sku_code': 'RE-VILLAGE-PC',
      'variant_attributes': '{"platform":"pc","store":"steam","dlss":true,"raytracing":true}',
      'master_slug': 'resident-evil-village',
      'pro_price': 179.99,
      'list_price': 249.99,
      'technical_specs': '{"min_requirements":"GTX 1050 Ti","recommended":"RTX 2070","dlss":"Suportado","raytracing":"Suportado"}',
      'tags': 'resident evil,pc,steam,dlss,raytracing',
      'is_active': true
    },
    {
      'Tipo': 'SKU Xbox - Resident Evil Village',
      'name': 'Resident Evil Village - Xbox Series X|S',
      'description': 'Versão otimizada para Xbox Series X|S',
      'price': 229.99,
      'stock': 15,
      'image': 'https://assets.xboxservices.com/assets/fb/d2/fbd2cb43-5c69-4d3f-9e1b-4caa5fa04e1a.jpg',
      'additional_images': 'https://assets.xboxservices.com/assets/5e/7f/5e7f9c4f-5c69-4d3f-9e1b-4caa5fa04e1b.jpg',
      'is_master_product': false,
      'parent_product_id': 'RE-VILLAGE-MASTER',
      'sku_code': 'RE-VILLAGE-XBOX',
      'variant_attributes': '{"platform":"xbox","generation":"series","smart_delivery":true}',
      'master_slug': 'resident-evil-village',
      'pro_price': 199.99,
      'list_price': 269.99,
      'technical_specs': '{"resolution":"4K","fps":"60 FPS","hdr":"Suportado","smart_delivery":"Sim"}',
      'tags': 'resident evil,xbox,series x,4k,smart delivery',
      'is_active': true
    },
    {
      'Tipo': 'SKU PlayStation - Resident Evil Village',
      'name': 'Resident Evil Village - PlayStation 5',
      'description': 'Versão para PlayStation 5 com funcionalidades DualSense',
      'price': 239.99,
      'stock': 20,
      'image': 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/FkzwjnJknkrFlozkTdeQBMub.png',
      'additional_images': 'https://image.api.playstation.com/vulcan/ap/rnd/202101/0812/vmKAKGTDz0RLJYJKk00Yzrmhj.jpg',
      'is_master_product': false,
      'parent_product_id': 'RE-VILLAGE-MASTER',
      'sku_code': 'RE-VILLAGE-PS5',
      'variant_attributes': '{"platform":"playstation","generation":"ps5","haptic_feedback":true,"adaptive_triggers":true}',
      'master_slug': 'resident-evil-village',
      'pro_price': 209.99,
      'list_price': 279.99,
      'technical_specs': '{"resolution":"4K","fps":"60 FPS","haptic_feedback":"Sim","adaptive_triggers":"Sim","3d_audio":"Sim"}',
      'product_features': '{"dualsense_haptic":true,"adaptive_triggers":true,"3d_audio":true,"activity_cards":true}',
      'tags': 'resident evil,playstation,ps5,dualsense,haptic',
      'is_active': true
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
  const skuCodes = new Set<string>();
  const slugs = new Set<string>();
  
  products.forEach((product, index) => {
    const row = product._rowIndex || index + 2;
    
    // Validações obrigatórias
    if (!product.name || product.name.toString().trim() === '') {
      errors.push({
        row,
        field: 'name',
        message: 'Nome do produto é obrigatório',
        severity: 'error'
      });
    }
    
    // Validação de preço corrigida para sistema SKU
    const isMasterProduct = parseBooleanField(product.is_master_product);
    const price = Number(product.price);
    
    if (isNaN(price)) {
      errors.push({
        row,
        field: 'price',
        message: 'Preço deve ser um número válido',
        severity: 'error'
      });
    } else if (!isMasterProduct && price <= 0) {
      // SKUs devem ter preço > 0
      errors.push({
        row,
        field: 'price',
        message: 'SKU deve ter preço maior que zero',
        severity: 'error'
      });
    } else if (isMasterProduct && price !== 0) {
      // Produtos mestre deveriam ter preço = 0 (aviso)
      errors.push({
        row,
        field: 'price',
        message: 'Produto mestre deveria ter preço = 0',
        severity: 'warning'
      });
    }
    
    // Validação SKU - MELHORADA
    if (product.sku_code) {
      const skuCode = product.sku_code.toString().trim();
      if (skuCodes.has(skuCode)) {
        errors.push({
          row,
          field: 'sku_code',
          message: `Código SKU "${skuCode}" duplicado na planilha`,
          severity: 'error'
        });
      } else {
        skuCodes.add(skuCode);
      }
    } else if (isMasterProduct || product.parent_product_id) {
      // SKU code é obrigatório para produtos mestre e variações
      errors.push({
        row,
        field: 'sku_code',
        message: 'Código SKU é obrigatório para produtos mestre e variações',
        severity: 'error'
      });
    }
    
    // Validação Slug
    if (product.slug) {
      if (slugs.has(product.slug.toString())) {
        errors.push({
          row,
          field: 'slug',
          message: `Slug "${product.slug}" duplicado`,
          severity: 'error'
        });
      } else {
        slugs.add(product.slug.toString());
      }
    }
    
    // Validação de produto mestre vs variação
    if (product.is_master_product && product.parent_product_id) {
      errors.push({
        row,
        field: 'parent_product_id',
        message: 'Produto mestre não pode ter produto pai',
        severity: 'error'
      });
    }
    
    if (!product.is_master_product && product.parent_product_id && !product.sku_code) {
      errors.push({
        row,
        field: 'sku_code',
        message: 'Variações precisam ter código SKU',
        severity: 'error'
      });
    }
    
    // Validação de variações - garantir que existe plataforma
    if (!isMasterProduct && product.parent_product_id) {
      const variantAttrs = parseJsonField(product.variant_attributes);
      if (!variantAttrs || !variantAttrs.platform) {
        errors.push({
          row,
          field: 'variant_attributes',
          message: 'Variações devem ter plataforma definida em variant_attributes',
          severity: 'error'
        });
      }
    }
    
    // Validação JSON
    const jsonFields = [
      'variant_attributes', 'product_videos', 'product_descriptions',
      'specifications', 'technical_specs', 'product_features',
      'product_faqs', 'product_highlights', 'reviews_config',
      'trust_indicators', 'delivery_config', 'display_config',
      'breadcrumb_config'
    ];
    
    jsonFields.forEach(field => {
      const value = (product as any)[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        try {
          JSON.parse(value);
        } catch (e) {
          errors.push({
            row,
            field,
            message: `Campo "${field}" deve conter JSON válido`,
            severity: 'error'
          });
        }
      }
    });
    
    // Validação de URLs
    const urlFields = ['image', 'additional_images'];
    urlFields.forEach(field => {
      const value = (product as any)[field];
      if (value && typeof value === 'string') {
        const urls = field === 'additional_images' ? value.split(',') : [value];
        urls.forEach(url => {
          if (url.trim() && !isValidUrl(url.trim())) {
            errors.push({
              row,
              field,
              message: `URL inválida em "${field}": ${url.trim()}`,
              severity: 'warning'
            });
          }
        });
      }
    });
    
    // Avisos úteis
    if (!product.description) {
      errors.push({
        row,
        field: 'description',
        message: 'Descrição recomendada para melhor experiência do usuário',
        severity: 'warning'
      });
    }
    
    if (!product.meta_title) {
      errors.push({
        row,
        field: 'meta_title',
        message: 'Título SEO recomendado para melhor posicionamento',
        severity: 'warning'
      });
    }
    
    if (!product.slug) {
      errors.push({
        row,
        field: 'slug',
        message: 'Slug será gerado automaticamente a partir do nome',
        severity: 'warning'
      });
    }
  });
  
  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseJsonField(value: any): any {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return undefined;
  }
}

function parseArrayField(value: any): string[] {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return [];
  }
  return value.split(',').map(item => item.trim()).filter(item => item !== '');
}

function parseBooleanField(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'sim';
  }
  return false;
}

async function createProductInDatabase(productData: any): Promise<any> {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

async function createProductTags(productId: string, tagNames: string[]): Promise<void> {
  if (tagNames.length === 0) return;
  
  // Buscar ou criar tags
  const { data: existingTags } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', tagNames);
    
  const existingTagNames = existingTags?.map(tag => tag.name) || [];
  const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));
  
  // Criar tags que não existem
  if (newTagNames.length > 0) {
    await supabase
      .from('tags')
      .insert(newTagNames.map(name => ({ name })));
  }
  
  // Buscar todas as tags novamente
  const { data: allTags } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', tagNames);
    
  if (allTags) {
    // Associar tags ao produto
    const productTags = allTags.map(tag => ({
      product_id: productId,
      tag_id: tag.id
    }));
    
    await supabase
      .from('product_tags')
      .insert(productTags);
  }
}

export async function processProductImport(
  products: ImportedProduct[], 
  onProgress: (progress: number) => void
): Promise<ImportResult> {
  let created = 0;
  let updated = 0;
  
  try {
    // Validar se não há SKUs duplicados no banco
    const allSkuCodes = products
      .filter(p => p.sku_code)
      .map(p => p.sku_code!.toString().trim());
    
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
    
    // Primeiro passo: processar produtos mestres
    const masterProducts = products.filter(p => p.is_master_product);
    const variations = products.filter(p => !p.is_master_product && p.parent_product_id);
    const simpleProducts = products.filter(p => !p.is_master_product && !p.parent_product_id);
    
    const total = products.length;
    let processed = 0;
    
  // Mapear parent_product_id (sku_code) para IDs reais
    const masterProductMap = new Map<string, string>();
    
    console.log(`[IMPORT] Iniciando importação: ${masterProducts.length} mestres, ${variations.length} variações, ${simpleProducts.length} simples`);
    
    // Processar produtos mestres
    for (const product of masterProducts) {
      console.log(`[IMPORT] Criando produto mestre: ${product.name}`);
      const productData = convertImportedProductToDatabase(product);
      const newProduct = await createProductInDatabase(productData);
      
      console.log(`[IMPORT] Produto mestre criado: ${newProduct.id} (${newProduct.name})`);
      
      if (product.sku_code) {
        masterProductMap.set(product.sku_code, newProduct.id);
        console.log(`[IMPORT] Mapeado SKU ${product.sku_code} -> ${newProduct.id}`);
      }
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
        console.log(`[IMPORT] Tags adicionadas: ${tagNames.join(', ')}`);
      }
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    // Processar produtos simples
    for (const product of simpleProducts) {
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
    
    // Processar variações
    for (const product of variations) {
      console.log(`[IMPORT] Criando variação: ${product.name} (parent: ${product.parent_product_id})`);
      const productData = convertImportedProductToDatabase(product);
      
      // Mapear parent_product_id
      if (product.parent_product_id && masterProductMap.has(product.parent_product_id)) {
        const realParentId = masterProductMap.get(product.parent_product_id);
        productData.parent_product_id = realParentId;
        console.log(`[IMPORT] Mapeando parent ${product.parent_product_id} -> ${realParentId}`);
      } else {
        console.warn(`[IMPORT] Parent product não encontrado: ${product.parent_product_id}`);
      }
      
      const newProduct = await createProductInDatabase(productData);
      console.log(`[IMPORT] Variação criada: ${newProduct.id} (${newProduct.name})`);
      
      // Processar tags
      if (product.tags) {
        const tagNames = parseArrayField(product.tags);
        await createProductTags(newProduct.id, tagNames);
        console.log(`[IMPORT] Tags da variação adicionadas: ${tagNames.join(', ')}`);
      }
      
      created++;
      processed++;
      onProgress(Math.round((processed / total) * 100));
    }
    
    return {
      success: true,
      created,
      updated
    };
  } catch (error) {
    console.error('Erro na importação:', error);
    return {
      success: false,
      created,
      updated,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

function getAvailableVariants(product: ImportedProduct): any {
  // Se já tem available_variants definido, usar ele
  const existingVariants = parseJsonField(product.variant_attributes);
  if (existingVariants && typeof existingVariants === 'object') {
    return existingVariants;
  }
  
  // Caso contrário, criar com plataformas padrão
  return {
    platforms: ['pc', 'xbox', 'playstation', 'nintendo'],
    editions: ['standard', 'deluxe', 'collector'],
    regions: ['global', 'br', 'us', 'eu']
  };
}

async function testImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

function convertImportedProductToDatabase(product: ImportedProduct): any {
  const isMasterProduct = parseBooleanField(product.is_master_product);
  const hasParentProduct = Boolean(product.parent_product_id);
  
  // Determinar product_type corretamente
  let productType: 'simple' | 'master' | 'sku' = 'simple';
  if (isMasterProduct) {
    productType = 'master';
  } else if (hasParentProduct) {
    productType = 'sku';
  }

  return {
    name: product.name,
    description: product.description || '',
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    image: product.image || '',
    additional_images: parseArrayField(product.additional_images),
    
    // Sistema SKU - CORRIGIDO
    product_type: productType,
    is_master_product: isMasterProduct,
    parent_product_id: product.parent_product_id || null,
    sku_code: product.sku_code || null,
    variant_attributes: parseJsonField(product.variant_attributes) || {},
    master_slug: product.master_slug || null,
    inherit_from_master: parseJsonField(product.inherit_from_master) || {},
    sort_order: Number(product.sort_order) || 0,
    available_variants: isMasterProduct ? getAvailableVariants(product) : {},
    
    // Preços
    pro_price: product.pro_price ? Number(product.pro_price) : null,
    list_price: product.list_price ? Number(product.list_price) : null,
    uti_pro_enabled: parseBooleanField(product.uti_pro_enabled),
    uti_pro_value: product.uti_pro_value ? Number(product.uti_pro_value) : null,
    uti_pro_custom_price: product.uti_pro_custom_price ? Number(product.uti_pro_custom_price) : null,
    uti_pro_type: product.uti_pro_type || 'percentage',
    
    // Mídia e conteúdo
    product_videos: parseJsonField(product.product_videos) || [],
    product_descriptions: parseJsonField(product.product_descriptions) || {
      short: '',
      detailed: '',
      technical: '',
      marketing: ''
    },
    
    // Especificações - CORRIGIDO
    specifications: parseJsonField(product.specifications) || [],
    technical_specs: parseJsonField(product.technical_specs) || {},
    product_features: parseJsonField(product.product_features) || {},
    
    // Reviews e FAQ - CORRIGIDO
    product_faqs: parseJsonField(product.product_faqs) || [],
    product_highlights: parseJsonField(product.product_highlights) || [],
    reviews_config: parseJsonField(product.reviews_config) || {
      enabled: true,
      show_rating: true,
      show_count: true,
      allow_reviews: true,
      custom_rating: { value: 0, count: 0, use_custom: false }
    },
    
    // Trust indicators
    trust_indicators: parseJsonField(product.trust_indicators) || [],
    
    // Entrega
    delivery_config: parseJsonField(product.delivery_config) || {
      custom_shipping_time: '',
      shipping_regions: [],
      express_available: false,
      pickup_locations: [],
      shipping_notes: ''
    },
    shipping_weight: product.shipping_weight ? Number(product.shipping_weight) : null,
    free_shipping: parseBooleanField(product.free_shipping),
    
    // Display
    display_config: parseJsonField(product.display_config) || {
      show_stock_counter: true,
      show_view_counter: false,
      custom_view_count: 0,
      show_urgency_banner: false,
      urgency_text: '',
      show_social_proof: false,
      social_proof_text: ''
    },
    badge_text: product.badge_text || '',
    badge_color: product.badge_color || '#22c55e',
    badge_visible: parseBooleanField(product.badge_visible),
    
    // SEO
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    slug: product.slug || generateSlug(product.name || ''),
    
    // Navegação
    breadcrumb_config: parseJsonField(product.breadcrumb_config) || {
      custom_path: [],
      use_custom: false,
      show_breadcrumb: true
    },
    
    // Status
    is_active: product.is_active !== undefined ? parseBooleanField(product.is_active) : true,
    is_featured: parseBooleanField(product.is_featured),
    
    // Campos padrão
    sizes: [],
    colors: []
  };
}